import { Game } from "./app.js";
import { MessagesHandler } from "./messagesHandler.js";

export enum ServerMessageType {
    CursorPosition = 1,
    GameMaxtrix = 2,
    ServerGameMatrixUpdate = 3,
    ServerBalanceNotify = 4,
}

export type ServerMessage = {
    type: ServerMessageType.CursorPosition;
    Username: string;
    CursorPosition: number[];
} | {
    type: ServerMessageType.GameMaxtrix;
    gameMatrix: number[][];
} | {
    type: ServerMessageType.ServerGameMatrixUpdate,
    updatedMatrixPosition: number[],
} | {
    type: ServerMessageType.ServerBalanceNotify,
    balance: number,
}
enum ClientMessageType {
    ClientCursorPosition = 1,
    ClientGameMatrix = 2,
    ClientGameMatrixUpdate = 3,
    ClientUpgradeBought = 4,
    ClientCreateLobby = 5,
    ClientJoinLobby = 6,
}

type ClientMessage = {
    type: ClientMessageType.ClientCursorPosition;
    CursorPosition: number[];
} | {
    type: ClientMessageType.ClientGameMatrixUpdate;
    UpdatedPosition: number[]
} | {
    type: ClientMessageType.ClientUpgradeBought;
    NewDamage: number;
    UpgradePrice: number;
} | {
    type: ClientMessageType.ClientCreateLobby | ClientMessageType.ClientJoinLobby;
    LobbyName: string;
    PlayerUsername: string;
}

export class WsDriver {
    conn: WebSocket;
    serverMessagesHandler: MessagesHandler


    constructor(game: Game) {
        this.conn = new WebSocket("ws://localhost:8080/ws")
        this.serverMessagesHandler = new MessagesHandler(game)
        this.conn.onmessage = (e) => this.handleMessage(e);
    }

    private send(msg: ClientMessage) {
        this.conn.send(JSON.stringify(msg))
    }

    public sendCursorPosition(userCursorPosition: number[]) {
        const msg: ClientMessage = {
            type: ClientMessageType.ClientCursorPosition,
            CursorPosition: userCursorPosition
        }
        this.send(msg)
    }

    public sendMatrixUpdate(updatedPosition: number[]) {
        const msg: ClientMessage = {
            type: ClientMessageType.ClientGameMatrixUpdate,
            UpdatedPosition: updatedPosition
        }
        this.send(msg)
    }

    public sendUserUpgradeBought(newDamage: number, upgradePrice: number) {
        const msg: ClientMessage = {
            type: ClientMessageType.ClientUpgradeBought,
            NewDamage: newDamage,
            UpgradePrice: upgradePrice,
        }
        this.send(msg);
    }

    public sendClientCreateLobby(lobbyName: string, username: string) {
        const msg: ClientMessage = {
            type: ClientMessageType.ClientCreateLobby,
            LobbyName: lobbyName,
            PlayerUsername: username,
        }
        this.send(msg);
    }

    public sendClientJoinLobby(lobbyName: string, username: string) {
        const msg: ClientMessage = {
            type: ClientMessageType.ClientJoinLobby,
            LobbyName: lobbyName,
            PlayerUsername: username,
        }
        this.send(msg);
    }

    private handleMessage(e: MessageEvent) {

        const msg = JSON.parse(e.data) as ServerMessage;

        switch (msg.type) {
            case ServerMessageType.CursorPosition:
                this.serverMessagesHandler.handleCursorOnServer(msg)
                break;
            case ServerMessageType.GameMaxtrix:
                this.serverMessagesHandler.handleGameMatrix(msg)
                break;
            case ServerMessageType.ServerGameMatrixUpdate:
                this.serverMessagesHandler.handleUpdateGameMatrix(msg)
                break
            case ServerMessageType.ServerBalanceNotify:
                this.serverMessagesHandler.handleBalanceUpdate(msg)

        }
    }

}
