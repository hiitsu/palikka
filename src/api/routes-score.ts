import http from "http";
import fastify from "fastify";
import { onRequestVerifyJWT } from "./fastify-hooks";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  fastify.post(
    "/new",
    { onRequest: onRequestVerifyJWT },
    (_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      reply.header("Content-Type", "application/json").code(200);
      reply.send({ score: 1 });
    }
  );

  done();
}
