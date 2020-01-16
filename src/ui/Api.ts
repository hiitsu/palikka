import axios from "axios";
import { PositionedBlock } from "src/primitives";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3001",
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
});

export default {
  score: {
    save(puzzleId: number, blocks: PositionedBlock[]) {
      api.post("/score/save");
    }
  }
};
