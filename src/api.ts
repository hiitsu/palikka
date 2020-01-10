import fastify from "fastify";
import http from "http";
import { AddressInfo } from "net";

const server = fastify();

const opts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          hello: {
            type: "string"
          }
        }
      }
    }
  }
};

function handler(req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) {
  reply.header("Content-Type", "application/json").code(200);
  reply.send({ puzzle: "time" });
}

server.get("/", opts, handler);

const port = process.env.PORT || "3001";
server.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`server listening on ${(server.server.address() as AddressInfo).port}`);
});
