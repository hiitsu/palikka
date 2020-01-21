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
  axiosInstance: api,
  user: {
    async signup(): Promise<string> {
      let token;
      if (localStorage && localStorage.getItem("token")) {
        token = localStorage.getItem("token");
        console.log("token revived from localStorage", token);
      } else {
        const res = await api.post("signup");
        token = res.data.token;
        console.log("token acquired from POST /signup", token);
        // TODO: handle QuotaExceededError
        localStorage && localStorage.setItem("token", token);
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return token;
    }
  },
  puzzle: {
    new(size: Size): Promise<any> {
      return api.post("puzzle", {});
    }
  },
  solution: {
    list(): Promise<Score[]> {
      return api.get("/solution");
    },
    save(puzzleId: number, blocks: PositionedBlock[]): Promise<Score> {
      return api.post("/solution", { puzzleId, blocks });
    }
  }
};
