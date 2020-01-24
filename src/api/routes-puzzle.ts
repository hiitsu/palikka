import http from "http";
import fastify from "fastify";
import knex from "./knex";
import { randomPuzzle } from "../puzzle";
import PuzzleComponent from "src/ui/PuzzleView";

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
      const [puzzle_id] = await knex("puzzles")
        .insert({ blocks: JSON.stringify(puzzle.blocks), width: size, height: size })
        .returning("id");
      const [solution_id] = await knex("solutions")
        .insert({ blocks: JSON.stringify(puzzle.positionedBlocks), user_id: null, seconds: 0, puzzle_id })
        .returning("id");
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ id: puzzle_id, blocks: puzzle.blocks });
    }
  );

  done();
}
