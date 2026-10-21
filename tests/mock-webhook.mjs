// Stands in for the real inquiry webhook during e2e tests. Records the last payload.
import { createServer } from "node:http";

let last = null;
createServer((req, res) => {
  if (req.method === "POST" && req.url === "/hook") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      last = JSON.parse(body);
      res.writeHead(204).end();
    });
    return;
  }
  if (req.url === "/last") {
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(last));
    return;
  }
  res.writeHead(200).end("ok");
}).listen(3201, "127.0.0.1");
