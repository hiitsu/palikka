import Fastify from "fastify";
import http from "http";
import buildFastify from "./fastify";
import knex, { destroy } from "./knex";
import supertest from "supertest";

type Auth = { token: string; user: { id: number | string } };
type FastifyInstance = Fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;

describe("api", () => {
  let fastify: FastifyInstance;

  async function signUp(fastify: FastifyInstance): Promise<Auth> {
    const response = await supertest(fastify.server).post("/signup");
    return response.body;
  }

  beforeAll(async () => {
    fastify = buildFastify();
    await fastify.ready();

    await knex("solutions").del();
    await knex("puzzles").del();
    await knex("users").del();
  });

  afterAll(async () => {
    await knex("solutions").del();
    await knex("puzzles").del();
    await knex("users").del();
    await destroy();
    await fastify.close();
  });

  it("loading root succesfully with 404 (nothing there)", async () => {
    await supertest(fastify.server)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  it("sets helmet-library provided security headers", async () => {
    await supertest(fastify.server)
      .get("/")
      .expect("X-DNS-Prefetch-Control", "off")
      .expect("X-Frame-Options", "SAMEORIGIN")
      .expect("Strict-Transport-Security", /includeSubDomains/)
      .expect("X-Download-Options", "noopen")
      .expect("X-Content-Type-Options", "nosniff")
      .expect("X-XSS-Protection", "1; mode=block");
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
        await supertest(fastify.server)
          .post("/verify")
          .set("Authorization", `Bearer ${auth.token}`)
          .send({ token: auth.token })
          .expect(200, auth);
      });
    });
  });

  describe("solution", () => {
    let user: Auth;
    beforeAll(async () => {
      user = await signUp(fastify);
    });

    it("should give 400 when sending valid solution with non-existing puzzle id", async () => {
      await supertest(fastify.server)
        .post("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ puzzleId: 1234567890, blocks: [[[1]]], seconds: 12 })
        .expect(400);
    });

    it("should give 400 when sending solution with invalid puzzleId", async () => {
      await supertest(fastify.server)
        .post("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ puzzleId: "a", blocks: [[[1]]], seconds: 12 })
        .expect(400);
    });

    it("should give 400 when sending solution with invalid block type", async () => {
      await supertest(fastify.server)
        .post("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ puzzleId: "a", blocks: 123, seconds: 12 })
        .expect(400);
    });

    it("should give 400 when sending solution with invalid block values", async () => {
      await supertest(fastify.server)
        .post("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ puzzleId: "a", blocks: [[[3]]], seconds: 12 })
        .expect(400);
    });

    it("saving a new solution returns id", async () => {
      const puzzle = await supertest(fastify.server)
        .post("/puzzle")
        .set("Authorization", `Bearer ${user.token}`)
        .send({})
        .expect(201)
        .then(res => {
          expect(res.body.id).toBeGreaterThanOrEqual(1);
          expect(res.body.blocks.length).toBeGreaterThanOrEqual(2);
          return res.body;
        });

      await supertest(fastify.server)
        .post("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ puzzleId: puzzle.id, blocks: puzzle.blocks, seconds: 12 })
        .expect(201);
    });

    it("retrieving solutions", async () => {
      const res = await supertest(fastify.server)
        .get("/solution")
        .set("Authorization", `Bearer ${user.token}`)
        .expect(200);
    });
  });

  describe("puzzle", () => {
    it("should create new random puzzle", async () => {
      const res = await supertest(fastify.server)
        .post("/puzzle")
        .expect(201);
      expect(res.body.id).toBeGreaterThanOrEqual(1);
      expect(res.body.blocks.length).toBeGreaterThanOrEqual(2);
    });
  });
});
