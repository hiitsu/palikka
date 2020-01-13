import fastify from "fastify";
import http from "http";
import helmet from "fastify-helmet";

export default function() {
  const server = fastify();

  server.register(helmet);

  const opts = {
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
  };

  function handler(
    _req: fastify.FastifyRequest<http.IncomingMessage>,
    reply: fastify.FastifyReply<http.ServerResponse>
  ) {
    reply.header("Content-Type", "application/json").code(200);
    reply.send({ puzzle: "time", abc: 1 });
  }

  server.get("/", opts, handler);
  return server;
}
