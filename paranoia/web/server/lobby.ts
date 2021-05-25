import { Option, toNullable } from "fp-ts/lib/Option";
import { Socket } from "socket.io";
import { io } from ".";
import { transitionToGame } from "./game";

export interface StateContainer<S> {
  setState(state: S): Promise<void>;
  getState<A>(f: (s: S) => A | undefined): Promise<Option<A>>;
  withState(f: (s: S) => S): Promise<void>;
  execState(f: (s: S) => Promise<void>, onNone?: () => Promise<void>): Promise<void>;
}

export type LobbyContainer = StateContainer<LobbyState>;

export interface Player {
  id: string;
  name: string;
}

export interface LobbyState {
  creator: Player;
  players: Player[];
}

export async function getPlayerSocket(lobbyContainer: LobbyContainer, player: string) {
  return await lobbyContainer
    .getState(async (state) => {
      const foundPlayer = state.players.find((x) => x.name === player);
      if (foundPlayer === undefined) {
        return undefined;
      }
      return io
        .in(foundPlayer.id)
        .fetchSockets()
        .then((x) => (x.length === 1 ? x[0] : undefined));
    })
    .then(toNullable);
}

export function onJoinLobby(socket: Socket, name: string) {
  socket.data.name = name;
  io.emit("lobby:room-joined", name, socket.id);
}

export async function onCreateLobby(socket: Socket, name: string, lobbyContainer: LobbyContainer) {
  await lobbyContainer.execState(
    async (state) => {
      socket.emit("lobby:already-created", state.creator.name);
    },
    async () => {
      const creator = { id: socket.id, name };
      await lobbyContainer.setState({
        creator,
        players: [creator],
      });
      socket.emit("lobby:created");
    }
  );
}

export async function onStartLobby(socket: Socket, lobbyContainer: LobbyContainer) {
  await lobbyContainer.execState(
    async (lobbyState) => {
      if (lobbyState.creator.id === socket.id) {
        io.sockets.emit("lobby:start");
        // TODO transition events to game events
        await transitionToGame(lobbyContainer);
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

export function registerLobbyEvents(socket: Socket, lobbyContainer: LobbyContainer) {
  socket.on("lobby:create", (name) => onCreateLobby(socket, name, lobbyContainer));
  socket.on("lobby:join", (name) => onJoinLobby(socket, name));
  socket.on("lobby:start", () => onStartLobby(socket, lobbyContainer));
  socket.on("disconnect", () => onLeaveLobby(socket));
}
