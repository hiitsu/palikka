import http from "http";
import fastify from "fastify";
import knex from "./knex";
import { randomPuzzle } from "../puzzle";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  fastify.post(
    "/puzzle",
    async (request: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const size = 6;
      const puzzle = randomPuzzle({ w: size, h: size }, 10);
      const [puzzleId] = await knex("puzzles")
        .insert({ blocks: JSON.stringify(puzzle.blocks), width: size, height: size })
        .returning("id");
      const [solutionId] = await knex("solutions")
        .insert({ blocks: JSON.stringify(puzzle.positionedBlocks), userId: null, seconds: 0, puzzleId })
        .returning("id");
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ id: puzzleId, blocks: puzzle.blocks });
    }
  );

  done();
}
