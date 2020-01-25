import axios from "axios";
import { PositionedBlock, Size, Score, Auth } from "../primitives";

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
        auth = await api.post("signup").then(res => res.data as Auth);
        console.log("Auth info acquired from POST /signup", auth);
        // TODO: handle QuotaExceededError
        localStorage && localStorage.setItem("auth", JSON.stringify(auth));
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      return auth;
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
