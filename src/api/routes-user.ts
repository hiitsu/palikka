import http from "http";
import fastify, { JWT } from "fastify";
import knex from "./knex";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  fastify.post(
    "/signup",
    async (request: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      if (request.headers && request.headers.authorization) {
        reply
          .header("Content-Type", "application/json")
          .code(403)
          .send({ message: "authorization header already exists" });
        return;
      }
      const [id] = await knex("users")
        .insert({})
        .returning("id");
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12;
      const payload = { iss: "palikka-api", aud: "palikka-services", exp, sub: id };
      const token = (fastify.jwt as JWT).sign(payload);
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ token, user: { id } });
    }
  );

  fastify.post(
    "/verify",
    async (request: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const payload: any = (fastify.jwt as JWT).decode(request.body.token);
      reply
        .header("Content-Type", "application/json")
        .code(200)
        .send({ token: request.body.token, user: { id: payload ? payload.sub : null } });
    }
  );

  done();
}
