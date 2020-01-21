import Fastify from "fastify";
import helmet from "fastify-helmet";
import jwt from "fastify-jwt";
import cors from "fastify-cors";

import routesPuzzle from "./routes-puzzle";
import routesSolution from "./routes-solution";
import routesUser from "./routes-user";

import { destroy } from "./knex";

export default function() {
  const fastify = Fastify({
    logger:
      process.env.NODE_ENV === "test"
        ? false
        : {
            prettyPrint: true,
            level: "info"
          }
  });

  fastify.register(cors, { origin: true });
  fastify.register(helmet);
  fastify.register(jwt, {
    secret: "supersecret"
  });

  fastify.register(routesPuzzle);
  fastify.register(routesSolution);
  fastify.register(routesUser);

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
