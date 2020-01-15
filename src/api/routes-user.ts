import http from "http";
import fastify, { JWT } from "fastify";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  fastify.post("/signup", (_request: any, reply: any) => {
    const payload = "abc";
    const token = (fastify.jwt as JWT).sign({ payload });
    reply.send({ token });
  });

  done();
}
