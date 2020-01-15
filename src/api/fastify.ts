import Fastify from "fastify";
import helmet from "fastify-helmet";
import jwt from "fastify-jwt";

import routesPuzzle from "./routes-puzzle";
import routesScore from "./routes-score";
import routesUser from "./routes-user";

import { destroy } from "./knex";

export default function() {
  const fastify = Fastify({
    logger: {
      level: "info"
    }
  });

  fastify.register(helmet);
  fastify.register(jwt, {
    secret: "supersecret"
  });

  fastify.register(routesPuzzle, { prefix: "/puzzle" });
  fastify.register(routesScore, { prefix: "/score" });
  fastify.register(routesUser, { prefix: "/user" });

  const termSignals: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];
  termSignals.forEach(signal => {
    process.once(signal, () => {
      fastify.close(() => {
        destroy();
      });
      const timeout = setTimeout(() => {
        process.exit(1);
      }, 5000);
      if (timeout.unref) timeout.unref();
    });
  });

  return fastify;
}
