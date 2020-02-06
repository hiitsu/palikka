import http from "http";
import fastify from "fastify";
import knex from "./knex";
import { randomPuzzle, obfuscatePuzzle } from "../puzzle";
import fastifyErrorHandler from "./fastify-error-handler";
import { PuzzleStats } from "src/primitives";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  const schema = {
    body: {
      type: "object",
      required: ["width", "height"],
      properties: {
        width: { type: "integer", minimum: 2, maximum: 16 },
        height: { type: "integer", minimum: 2, maximum: 16 }
      }
    }
  };

  fastify.post(
    "/puzzle",
    { schema },
    async (request: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const puzzle = obfuscatePuzzle(randomPuzzle({ w: request.body.width, h: request.body.height }, 10));
      const [id] = await knex("puzzles")
        .insert({
          ...puzzle,
          positionedBlocks: JSON.stringify(puzzle.positionedBlocks)
        })
        .returning("id");
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ data: { id, ...puzzle } });
    }
  );

  fastify.get(
    "/puzzle/:id",
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const id = req.params.id;
      const [averageTime, bestTime, solutionCount] = await Promise.all([
        knex
          .from("puzzles")
          .avg("seconds")
          .where("solutionFor", id)
          .then(rows => parseFloat((rows[0] as any).avg)),
        knex
          .from("puzzles")
          .min("seconds")
          .where("solutionFor", id)
          .then(rows => parseFloat((rows[0] as any).min)),
        knex
          .from("puzzles")
          .count()
          .where("solutionFor", id)
          .then(rows => parseInt((rows[0] as any).count))
      ]);
      const stats: PuzzleStats = { averageTime, bestTime, solutionCount };
      reply
        .header("Content-Type", "application/json")
        .code(200)
        .send({ data: stats });
    }
  );

  done();
}
