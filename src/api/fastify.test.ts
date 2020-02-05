import Fastify from "fastify";
import http from "http";
import buildFastify from "./fastify";
import knex, { destroy } from "./knex";
import supertest from "supertest";
import { Auth, Puzzle } from "../primitives";

type FastifyInstance = Fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;

describe("api", () => {
  let fastify: FastifyInstance;

  async function signUp(): Promise<Auth> {
    const response = await supertest(fastify.server).post("/signup");
    return response.body.data;
  }

  async function newPuzzle(auth: Auth, width: number = 4, height: number = 4): Promise<Puzzle> {
    const res = await supertest(fastify.server)
      .post("/puzzle")
      .set("Authorization", `Bearer ${auth.token}`)
      .send({ width, height })
      .expect(201);

    const puzzle: Puzzle = res.body.data;
    expect(puzzle.id).toBeGreaterThanOrEqual(1);
    expect(puzzle.positionedBlocks.length).toBeGreaterThanOrEqual(2);
    expect(puzzle.width).toBeGreaterThanOrEqual(2);
    expect(puzzle.height).toBeGreaterThanOrEqual(2);
    return puzzle;
  }

  async function saveSolution(auth: Auth, solution: Puzzle): Promise<Puzzle> {
    delete solution.id;
    const res = await supertest(fastify.server)
      .post("/solution")
      .set("Authorization", `Bearer ${auth.token}`)
      .send(solution)
      .expect(201);

    return res.body.data;
  }

  beforeAll(async () => {
    fastify = buildFastify();
    await fastify.ready();

    await knex("puzzles").del();
    await knex("users").del();
  });

  afterAll(async () => {
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
        const auth = await signUp();
        expect(auth.token).toBeTruthy();
      });

      it("should give not give same token twice", async () => {
        const user1 = await signUp();
        const user2 = await signUp();
        expect(user1.token).not.toBe(user2.token);
      });
    });

    describe("verify", () => {
      it("should work for fresh signup", async () => {
        const auth = await signUp();
        await supertest(fastify.server)
          .post("/verify")
          .set("Authorization", `Bearer ${auth.token}`)
          .send({ token: auth.token })
          .expect(200, { data: auth });
      });
    });
  });

  describe("solution", () => {
    beforeAll(async () => {});

    beforeEach(async () => {
      await knex("puzzles").del();
      await knex("users").del();
    });

    afterEach(async () => {
      await knex("puzzles").del();
      await knex("users").del();
    });

    describe("saving a new solution ", () => {
      describe("validations", () => {
        let user: Auth;
        beforeAll(async () => {
          user = await signUp();
        });
        it("should give 400 when sending valid solution with non-existing puzzle id", async () => {
          await supertest(fastify.server)
            .post("/solution")
            .set("Authorization", `Bearer ${user.token}`)
            .send({ puzzleId: 1234567890, positionedBlocks: [[[1]]], seconds: 12 })
            .expect(400);
        });

        it("should give 400 when sending solution with invalid puzzleId", async () => {
          await supertest(fastify.server)
            .post("/solution")
            .set("Authorization", `Bearer ${user.token}`)
            .send({ puzzleId: "a", positionedBlocks: [[[1]]], seconds: 12 })
            .expect(400);
        });

        it("should give 400 when sending solution with invalid block type", async () => {
          await supertest(fastify.server)
            .post("/solution")
            .set("Authorization", `Bearer ${user.token}`)
            .send({ puzzleId: "a", positionedBlocks: 123, seconds: 12 })
            .expect(400);
        });

        it("should give 400 when sending solution with invalid block values", async () => {
          const user = await signUp();
          await supertest(fastify.server)
            .post("/solution")
            .set("Authorization", `Bearer ${user.token}`)
            .send({ puzzleId: "a", positionedBlocks: [[[3]]], seconds: 12 })
            .expect(400);
        });
      });

      it("should return id when succesfully saving one", async () => {
        const user = await signUp();
        const puzzle = await newPuzzle(user);
        const solution = { ...puzzle, puzzleId: puzzle.id, seconds: 12 };
        delete solution.id;
        console.log("solution", solution);
        const res = await supertest(fastify.server)
          .post("/solution")
          .set("Authorization", `Bearer ${user.token}`)
          .send(solution)
          .expect(201);
        expect(res.body.data.id).toBeDefined();
      });
    });

    describe("retrieving solutions", () => {
      it("should give 401 when trying to fetch without token", async () => {
        await supertest(fastify.server)
          .get("/solution")
          .expect(401);
      });

      it("should be empty array when no solutions exist", async () => {
        const user = await signUp();
        const res = await supertest(fastify.server)
          .get("/solution")
          .set("Authorization", `Bearer ${user.token}`)
          .expect(200);
        expect(res.body.data).toHaveLength(0);
      });

      it("should enlist a saved solution", async () => {
        const user = await signUp();
        const puzzle = await newPuzzle(user);
        await saveSolution(user, { ...puzzle, puzzleId: puzzle.id, seconds: 12 });
        const res = await supertest(fastify.server)
          .get("/solution")
          .set("Authorization", `Bearer ${user.token}`)
          .expect(200)
          .catch(err => {
            console.log(err);
            return err;
          });
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].puzzleId).toBe(puzzle.id);
      });

      it("should enlist saved solutions in order", async () => {
        const user = await signUp();
        const first = await newPuzzle(user);
        await saveSolution(user, { ...first, puzzleId: first.id, seconds: 12 });
        const second = await newPuzzle(user);
        await saveSolution(user, { ...second, puzzleId: second.id, seconds: 12 });
        const third = await newPuzzle(user);
        await saveSolution(user, { ...third, puzzleId: third.id, seconds: 12 });
        const res = await supertest(fastify.server)
          .get("/solution")
          .set("Authorization", `Bearer ${user.token}`)
          .expect(200);
        expect(res.body.data).toHaveLength(3);
        expect(res.body.data[0].puzzleId).toBe(first.id);
      });
    });
  });

  describe("puzzle", () => {
    it("asking new puzzle with invalid width should be 400", async () => {
      await supertest(fastify.server)
        .post("/puzzle")
        .send({ width: "im string", height: 4 })
        .expect(400);
    });

    it("asking new puzzle with invalid height should be 400", async () => {
      await supertest(fastify.server)
        .post("/puzzle")
        .send({ width: 4, height: 1.234 })
        .expect(400);
    });

    describe("new puzzle", () => {
      let puzzle: Puzzle;
      beforeAll(async () => {
        const user = await signUp();
        puzzle = await newPuzzle(user, 4, 7);
      });

      it("should have id set", async () => {
        expect(puzzle.id).toBeGreaterThan(1);
      });

      it("should have positionedBlocks more than 2", async () => {
        expect(puzzle.positionedBlocks.length).toBeGreaterThan(2);
      });

      it("should have mirror the request width and height", async () => {
        expect(puzzle.width).toBe(4);
        expect(puzzle.height).toBe(7);
      });
    });
  });
});
