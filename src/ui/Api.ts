import axios from "axios";
import { PositionedBlock, Size, Puzzle, Auth, PuzzleStats } from "../primitives";

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
        const res = await api.post("signup");
        auth = res.data.data as Auth;

        try {
          localStorage && localStorage.setItem("auth", JSON.stringify(auth));
        } catch (err) {
          // TODO: handle QuotaExceededError
        }
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      //console.log("Authorization set to", `Bearer ${auth.token}`);
      return auth;
    }
  },
  puzzle: {
    async newPuzzle(width: number = 6, height: number = 6): Promise<Puzzle> {
      const res = await api.post("puzzle", { width, height });
      return res.data.data;
    },
    async stats(id: number): Promise<PuzzleStats> {
      const res = await api.get(`puzzle/${id}`);
      return res.data.data;
    }
  },
  solution: {
    async list(): Promise<Puzzle[]> {
      const res = await api.get("/solution");
      return res.data.data;
    },
    async save(puzzle: Puzzle): Promise<Puzzle> {
      const res = await api.post("/solution", puzzle);
      return res.data.data;
    }
  }
};
