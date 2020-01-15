import { AddressInfo } from "net";
import buildFastify from "./fastify";

const fastify = buildFastify();
const port = parseInt(process.env.PORT || "3001");

fastify.listen(port, "0.0.0.0", (err: Error) => {
  if (err) throw err;
  console.log(`server listening on ${(fastify.server.address() as AddressInfo).port}`);
});
