import fastify, { JWT } from "fastify";
import http from "http";
import helmet from "fastify-helmet";
import jwt from "fastify-jwt";

export default function() {
  const server = fastify();

  server.register(helmet);
  server.register(jwt, {
    secret: "supersecret"
  });

  async function onRequest(request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }

  server.post("/signup", (_request: any, reply: any) => {
    const payload = "abc";
    const token = (server.jwt as JWT).sign({ payload });
    reply.send({ token });
  });

  server.post(
    "/score",
    { onRequest },
    (_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      reply.header("Content-Type", "application/json").code(200);
      reply.send({ score: 1 });
    }
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              puzzle: {
                type: "string"
              }
            }
          }
        }
      }
    },
    (_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      reply.header("Content-Type", "application/json").code(200);
      reply.send({ puzzle: "time" });
    }
  );

  return server;
}
