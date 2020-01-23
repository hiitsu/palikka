import Fastify from "fastify";
import http from "http";
import buildFastify from "./fastify";
import knex, { destroy } from "./knex";

type Auth = { token: string; user: { id: number | string } };
type FastifyInstance = Fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;

describe("api", () => {
  let fastify: FastifyInstance;

  async function signUp(fastify: FastifyInstance): Promise<Auth> {
    const response = await fastify.inject({
      method: "POST",
      url: "/signup"
    });
    const payload: any = JSON.parse(response.payload);
    return payload;
  }

  beforeAll(async () => {
    await knex("solutions").del();
    await knex("puzzles").del();
    await knex("users").del();
    await knex.schema.dropTableIfExists("solutions");
    await knex.schema.dropTableIfExists("puzzles");
    await knex.schema.dropTableIfExists("users");
    fastify = buildFastify();
  });

  afterAll(async () => {
    await knex("solutions").del();
    await knex("puzzles").del();
    await knex("users").del();
    await knex.schema.dropTableIfExists("solutions");
    await knex.schema.dropTableIfExists("puzzles");
    await knex.schema.dropTableIfExists("users");
    await destroy();
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

  describe("user", () => {
    describe("signup", () => {
      it("should give a token", async () => {
        const auth = await signUp(fastify);
        expect(auth.token).toBeTruthy();
      });

      it("should give not give same token twice", async () => {
        const user1 = await signUp(fastify);
        const user2 = await signUp(fastify);
        expect(user1.token).not.toBe(user2.token);
      });
    });

    describe("verify", () => {
      it("should work for fresh signup", async () => {
        const auth = await signUp(fastify);
        const response = await fastify.inject({
          method: "POST",
          url: "/verify",
          payload: { token: auth.token }
        });
        //console.log("verify", response.payload);
        const verified: Auth = JSON.parse(response.payload);
        expect(response.statusCode).toBe(200);
        expect(auth.user.id).toBe(verified.user.id);
      });
    });
  });

  describe("solution", () => {
    let user: Auth;
    beforeAll(async () => {
      user = await signUp(fastify);
    });

    it("should give 400 when sending valid solution with non-existing puzzle id", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        payload: { puzzleId: 1234567890, blocks: [[[1]]], seconds: 12 }
      });
      expect(response.statusCode).toBe(400);
    });

    it("should give 400 when sending solution with invalid puzzleId", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        payload: { puzzleId: "a", blocks: [[[1]]], seconds: 12 }
      });
      expect(response.statusCode).toBe(400);
    });

    it("should give 400 when sending solution with invalid block type", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        payload: { puzzleId: "a", blocks: 123, seconds: 12 }
      });
      expect(response.statusCode).toBe(400);
    });

    it("should give 400 when sending solution with invalid block values", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        payload: { puzzleId: "a", blocks: [[[3]]], seconds: 12 }
      });
      expect(response.statusCode).toBe(400);
    });

    it("saving a new solution returns id", async () => {
      const puzzle = await fastify
        .inject({
          method: "POST",
          url: "/puzzle"
        })
        .then(res => JSON.parse(res.payload));

      const response = await fastify.inject({
        method: "POST",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        payload: { puzzleId: puzzle.id, blocks: [[[1]]], seconds: 23 }
      });
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload).id).toBeGreaterThanOrEqual(0);
    });

    it("retrieving solutions", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/solution",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log(response.payload);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).solutions).toHaveLength(1);
    });
  });

  describe("puzzle", () => {
    it("should create new random puzzle", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/puzzle"
      });
      const puzzle = JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(puzzle.id).toBeTruthy();
      expect(puzzle.blocks).toBeTruthy();
    });
  });
});
