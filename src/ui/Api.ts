import axios from "axios";
import { PositionedBlock, Size, Puzzle, Auth } from "../primitives";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3001",
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
});

export default {
  axiosInstance: api,
  user: {
    async signup(): Promise<Auth> {
      let auth: Auth;
      if (localStorage && localStorage.getItem("auth")) {
        auth = JSON.parse(localStorage.getItem("auth") as string) as Auth;
      } else {
        auth = await api.post("signup").then(res => {
          console.log("Api.signup", res.data);
          return res.data as Auth;
        });
        console.log("Auth info acquired from POST /signup", auth);
        // TODO: handle QuotaExceededError
        localStorage && localStorage.setItem("auth", JSON.stringify(auth));
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      return auth;
    }
  },
  puzzle: {
    async newPuzzle(width: number = 6, height: number = 6): Promise<Puzzle> {
      const res = await api.post("puzzle", { width, height });
      return res.data.data;
    }
  },
  solution: {
    list(): Promise<Puzzle[]> {
      return api.get("/solution");
    },
    save(puzzleId: number, blocks: PositionedBlock[]): Promise<Puzzle> {
      return api.post("/solution", { puzzleId, blocks });
    }
  }
};
