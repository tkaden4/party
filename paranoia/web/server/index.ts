import express, { json } from "express";
import http from "http";
import { Server } from "socket.io";

const PORT: number = +process.env.PARANOIA_PORT || 8080;

const app = express();
app.use(json());

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("connect", () => {});

  socket.on("message", (command) => {
    if (command.type !== undefined) {
      switch (command.type) {
        case "create":
        // TODO
        default:
          break;
      }
    }
  });

  socket.on("disconnect", (reason) => {});
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
