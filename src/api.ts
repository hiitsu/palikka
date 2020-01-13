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
          puzzle: {
            type: "string"
          }
        }
      }
    }
  }
};

function handler(_req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) {
  reply.header("Content-Type", "application/json").code(200);
  reply.send({ puzzle: "time", abc: 1 });
}

server.get("/", opts, handler);

const port = parseInt(process.env.PORT || "3001");
server.listen(port, "0.0.0.0", (err: Error) => {
  if (err) throw err;
  console.log(`server listening on ${(server.server.address() as AddressInfo).port}`);
});
