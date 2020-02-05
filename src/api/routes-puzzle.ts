import http from "http";
import fastify from "fastify";
import knex from "./knex";
import { randomPuzzle, obfuscatePuzzle } from "../puzzle";

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

  done();
}
