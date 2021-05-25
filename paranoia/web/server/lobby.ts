import { Option } from "fp-ts/lib/Option";
import { Socket } from "socket.io";
import { io } from ".";

export interface StateContainer<S> {
  setState(state: S): Promise<void>;
  getState<A>(f: (s: S) => A | undefined): Promise<Option<A>>;
  withState(f: (s: S) => S): Promise<void>;
  execState(f: (s: S) => Promise<void>, onNone?: () => Promise<void>): Promise<void>;
}

export type LobbyContainer = StateContainer<LobbyState>;

export interface Player {
  id: number | string;
  name: string;
}

export interface LobbyState {
  creator: Player;
  players: Player[];
}

export function onJoinLobby(socket: Socket, name: string) {
  socket.data.name = name;
  io.emit("lobby:room-joined", name, socket.id);
}

export async function onCreateLobby(socket: Socket, name: string, lobbyState: LobbyContainer) {
  await lobbyState.execState(
    async (state) => {
      socket.emit("lobby:already-created", state.creator.name);
    },
    async () => {
      const creator = { id: socket.id, name };
      await lobbyState.setState({
        creator,
        players: [creator],
      });
      socket.emit("lobby:created");
    }
  );
}

export async function onStartLobby(socket: Socket, lobbyState: LobbyContainer) {
  await lobbyState.execState(
    async (lobbyState) => {
      if (lobbyState.creator.id === socket.id) {
        io.sockets.emit("lobby:start");
        // TODO transition events to game events
      } else {
        socket.emit("lobby:error", "you cannot start the lobby, as you do not own it.");
      }
    },
    async () => {
      socket.emit("lobby:not-created");
    }
  );
}

export function onLeaveLobby(socket: Socket) {
  io.sockets.emit("lobby:leave", socket.data.name, socket.id);
}

export function registerLobbyEvents(socket: Socket, lobbyState: LobbyContainer) {
  socket.on("lobby:create", (name) => onCreateLobby(socket, name, lobbyState));
  socket.on("lobby:join", (name) => onJoinLobby(socket, name));
  socket.on("lobby:start", () => onStartLobby(socket, lobbyState));
  socket.on("disconnect", () => onLeaveLobby(socket));
}
