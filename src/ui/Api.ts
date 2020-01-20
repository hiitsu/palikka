import axios from "axios";
import { PositionedBlock, Size, Score } from "src/primitives";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3001",
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
});

export default {
  user: {
    async signup(): Promise<string> {
      const res = await api.post("signup");
      console.log("signup", res.data);
      const token = res.data.token;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return token;
    }
  },
  puzzle: {
    new(size: Size): Promise<any> {
      return api.post("puzzle", {});
    }
  },
  score: {
    list(): Promise<Score[]> {
      return api.get("/score");
    },
    save(puzzleId: number, blocks: PositionedBlock[]): Promise<Score> {
      return api.post("/score", { puzzleId, blocks });
    }
  }
};
