/**
 * @jest-environment jsdom
 */

import Api from "./Api";
import nock from "nock";

describe("Api", () => {
  const baseUrl = `http://localhost:8089`;
  beforeAll(() => {
    Api.axiosInstance.defaults.baseURL = baseUrl;
  });

  describe("user", () => {
    describe("signup", () => {
      beforeEach(() => {});
      it("when server is down with 504 gateway timeout", async () => {
        const scope = nock(baseUrl)
          .defaultReplyHeaders({ "access-control-allow-origin": "*" })
          .post("/signup")
          .reply(504);

        try {
          await Api.user.signup();
        } catch (error) {
          expect(error).toBeDefined();
        }

        scope.done();
      });

      it("happy path should be 201", async () => {
        const auth = { token: "abc", user: { id: 1 } };
        const scope = nock(baseUrl)
          .defaultReplyHeaders({ "access-control-allow-origin": "*" })
          .post("/signup")
          .reply(201, auth);
        const signup = await Api.user.signup();
        expect(signup).toEqual({ ...auth });
        scope.done();
        nock.cleanAll();
      });
    });
  });
});
