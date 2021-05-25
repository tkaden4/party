import express, { json } from "express";
import { fold, map, none, Option, some } from "fp-ts/lib/Option";
import http from "http";
import { Server } from "socket.io";
import { LobbyState, registerLobbyEvents, StateContainer } from "./lobby";

const PORT: number = +process.env.PARANOIA_PORT || 8080;

const app = express();
app.use(json());

const server = http.createServer(app);
export const io = new Server(server);

let state: Option<LobbyState> = none;
const gameState: StateContainer<LobbyState> = {
  async setState(s: LobbyState) {
    state = some(s);
  },
  async getState<A>(f: (s: LobbyState) => A): Promise<Option<A>> {
    return map(f)(state);
  },
  async withState(f) {
    state = map(f)(state);
  },
  async execState(f, onNone?) {
    return fold(onNone ?? (async () => {}), f)(state);
  },
};

io.on("connection", (socket) => {
  socket.on("connect", () => {
    registerLobbyEvents(socket, gameState);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
