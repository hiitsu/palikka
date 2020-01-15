import Fastify from "fastify";
import http from "http";
import buildFastify from "./fastify";

describe("api", () => {
  let fastify: Fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;

  beforeAll(() => {
    fastify = buildFastify();
  });

  afterAll(() => {
    fastify.close();
  });

  it("loading root succesfully with 404 (nothing there)", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/"
    });
    expect(response.statusCode).toBe(404);
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
        url: "/user/signup"
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toBeTruthy();
    });
  });

  describe("score", () => {
    it("should give 401 when sending score without token", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/score/new"
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("puzzle", () => {
    it("should give new random puzzle from root", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/puzzle/new"
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).length).toBeGreaterThan(1);
    });
  });
});
