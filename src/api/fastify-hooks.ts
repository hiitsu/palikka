import fastify from "fastify";
import http from "http";

export async function onRequestVerifyJWT(
  request: fastify.FastifyRequest<http.IncomingMessage>,
  reply: fastify.FastifyReply<http.ServerResponse>
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}
