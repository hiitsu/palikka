import http from "http";
import fastify from "fastify";
import snakeCaseKeys from "snakecase-keys";
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
      required: ["puzzleId", "blocks"],
      properties: {
        blocks: {
          type: "array",
          maxItems: 20,
          items: {
            type: "array",
            maxItems: 5,
            minItems: 1,
            items: {
              type: "array",
              maxItems: 5,
              items: { type: "integer", minimum: 0, maximum: 1 }
            }
          }
        },
        seconds: { type: "number", minimum: 1, maximum: 60 * 60 },
        puzzleId: { type: "integer" }
      }
    }
  };

  fastify.post(
    "/score",
    { schema, onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const { blocks, puzzle_id, seconds } = snakeCaseKeys(req.body);
      const user_id = (req.user as any).sub;
      const id = await knex("scores")
        .insert({ puzzle_id, blocks: JSON.stringify(blocks), user_id, seconds })
        .returning("id")
        .then(ids => ids[0])
        .catch(fastifyErrorHandler(reply));
      reply.header("Content-Type", "application/json").code(201);
      reply.send({ id });
    }
  );

  fastify.get(
    "/score",
    { onRequest: onRequestVerifyJWT },
    async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
      const user_id = (req.user as any).sub;
      const scores = await knex
        .from("scores")
        .select("seconds", "puzzle_id")
        .where("user_id", user_id);
      reply.header("Content-Type", "application/json").code(200);
      reply.send({ scores });
    }
  );

  done();
}
