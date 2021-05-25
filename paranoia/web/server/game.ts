import { io } from ".";
import { getPlayerSocket, LobbyContainer } from "./lobby";
import { ParanoiaOperators } from "./paranoia";

export default interface GameState {
  round: number;
}

export async function getParanoiaOperations(lobbyContainer: LobbyContainer): Promise<ParanoiaOperators> {
  // TODO
  return {
    async askPlayer(player: string, question: string) {
      return prompt(lobbyContainer, player, question);
    },
    async showQuestion() {
      return false;
    },
    async choosePlayers() {
      return ["", ""];
    },
    async displayHidden() {},
    async displayResult() {},
    async getQuestion(player: string) {
      return "";
    },
  };
}

export async function prompt(
  lobbyContainer: LobbyContainer,
  player: string,
  question: string
): Promise<string | undefined> {
  return new Promise(async (resolve, reject) => {
    const playerSocket = await getPlayerSocket(lobbyContainer, player);
    if (playerSocket === undefined) {
      throw new Error("Player " + player + " does not exist.");
    }
    playerSocket.emit("game:question", question, (response: unknown) => {
      if (typeof response === "string" || typeof response === "undefined") {
        resolve(response);
        return;
      }
      reject("Did not get a string response, got " + typeof response + ": " + JSON.stringify(response));
    });
  });
}

export async function transitionToGame(lobbyContainer: LobbyContainer) {
  io.sockets.removeAllListeners();

  io.sockets.on("connect", (socket) => {
    socket.emit("no longer accepting players");
    socket.disconnect();
  });

  io.sockets.on("disconnect", () => {
    // TODO get leaving socket?
    io.sockets.emit("game:leaver");
  });
}
