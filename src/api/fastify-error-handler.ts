import fastify from "fastify";
import http from "http";
import PostgresErrorCodes from "./postgres-error-codes";

export default function(reply: fastify.FastifyReply<http.ServerResponse>) {
  return function(error: any) {
    console.log(error);
    reply.header("Content-Type", "application/json");
    if (error.code == PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
      reply.code(400).send({ message: "bad request" });
    } else {
      reply.code(500).send({ message: "unknown error" });
    }
  };
}
