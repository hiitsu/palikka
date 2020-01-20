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
    async (_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const blocks = randomPuzzle({ w: 6, h: 6 }, 10).blocks;
      const [id] = await knex("puzzles")
        .insert({ blocks: JSON.stringify(blocks) })
        .returning("id");
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ id, blocks });
    }
  );

  done();
}
