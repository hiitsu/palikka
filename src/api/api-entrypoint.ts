import { AddressInfo } from "net";
import buildFastify from "./api";

const server = buildFastify();
const port = parseInt(process.env.PORT || "3001");

server.listen(port, "0.0.0.0", (err: Error) => {
  if (err) throw err;
  console.log(`server listening on ${(server.server.address() as AddressInfo).port}`);
});
