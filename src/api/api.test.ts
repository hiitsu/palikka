import fastify from "fastify";
import http from "http";
import buildFastify from "./api";

describe("api", () => {
  let fastify: fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;

  beforeAll(() => {
    fastify = buildFastify();
  });

  afterAll(() => {
    fastify.close();
  });

  it("loading root succesfully", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/"
    });
    expect(response.statusCode).toBe(200);
  });

  it("sets helmet-library provided security headers", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/"
    });
    expect(response.headers["X-DNS-Prefetch-Control".toLocaleLowerCase()]).toBeTruthy();
    expect(response.headers["X-Frame-Options".toLocaleLowerCase()]).toBeTruthy();
    expect(response.headers["Strict-Transport-Security".toLocaleLowerCase()]).toBeTruthy();
    expect(response.headers["X-Download-Options".toLocaleLowerCase()]).toBeTruthy();
    expect(response.headers["X-Content-Type-Options".toLocaleLowerCase()]).toBeTruthy();
    expect(response.headers["X-XSS-Protection".toLocaleLowerCase()]).toBeTruthy();
  });

  describe("signup", () => {
    it("should give a token", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/signup"
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toBeTruthy();
    });
  });

  describe("score", () => {
    it("should give 401 is sending without token", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/score"
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
