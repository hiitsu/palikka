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
      required: ["solutionFor", "positionedBlocks", "width", "height", "seconds"],
      properties: {
        blocks: {
          type: "array",
          maxItems: 20
        },
        seconds: { type: "number", minimum: 1, maximum: 60 * 60 },
        width: { type: "integer", minimum: 2, maximum: 16 },
        height: { type: "integer", minimum: 2, maximum: 16 },
        solutionFor: { type: "integer" }
      }
    }
  };

  fastify.post(
    "/solution",
    { schema, onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const userId = (req.user as any).sub;
      const solution = { ...req.body, positionedBlocks: JSON.stringify(req.body.positionedBlocks), userId };
      await knex("puzzles")
        .insert(solution)
        .returning("id")
        .then(ids => ids[0])
        .then(id => {
          reply
            .header("Content-Type", "application/json")
            .code(201)
            .send({ data: { ...solution, id } });
        })
        .catch(fastifyErrorHandler(reply));
    }
  );

  fastify.get(
    "/solution",
    { onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const userId = (req.user as any).sub;
      await knex
        .from("puzzles")
        .select("seconds", "solutionFor", "positionedBlocks", "createdAt", "width", "height")
        .orderBy("createdAt", "asc")
        .where("userId", userId)
        .then(scores => {
          reply
            .header("Content-Type", "application/json")
            .code(200)
            .send({ data: scores });
        })
        .catch(fastifyErrorHandler(reply));
    }
  );

  done();
}
