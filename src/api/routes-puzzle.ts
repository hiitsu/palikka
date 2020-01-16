import http from "http";
import fastify from "fastify";
import { randomPuzzle } from "../puzzle";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  fastify.post(
    "/puzzle",
    (_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      reply.header("Content-Type", "application/json").code(200);
      reply.send(randomPuzzle({ w: 6, h: 6 }, 10).blocks);
    }
  );

  done();
}
