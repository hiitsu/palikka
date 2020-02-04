import http from "http";
import fastify from "fastify";
import { onRequestVerifyJWT } from "./fastify-hooks";
import knex from "./knex";
import fastifyErrorHandler from "./fastify-error-handler";

export default function(
  fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>,
  _opts: any,
  done: Function
) {
  const schema = {
    body: {
      type: "object",
      required: ["puzzleId", "positionedBlocks", "width", "height"],
      properties: {
        blocks: {
          type: "array",
          maxItems: 20
        },
        seconds: { type: "number", minimum: 1, maximum: 60 * 60 },
        width: { type: "integer", minimum: 2, maximum: 16 },
        height: { type: "integer", minimum: 2, maximum: 16 },
        puzzleId: { type: "integer" }
      }
    }
  };

  fastify.post(
    "/solution",
    { schema, onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const userId = (req.user as any).sub;
      const solution = { ...req.body, positionedBlocks: JSON.stringify(req.body.positionedBlocks), userId };
      const id = await knex("puzzles")
        .insert(solution)
        .returning("id")
        .then(ids => ids[0])
        .catch(fastifyErrorHandler(reply));
      reply
        .header("Content-Type", "application/json")
        .code(201)
        .send({ data: { ...solution, id } });
    }
  );

  fastify.get(
    "/solution",
    { onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const userId = (req.user as any).sub;
      const scores = await knex
        .from("solutions")
        .select("seconds", "puzzleId", "positionedBlocks", "createdAt")
        .orderBy("createdAt", "asc")
        .where("userId", userId)
        .catch(fastifyErrorHandler(reply));
      reply.header("Content-Type", "application/json").code(200);
      reply.send({ data: scores });
    }
  );

  done();
}
