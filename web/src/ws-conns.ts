import { Game } from "./app.js";
import { MessagesHandler } from "./messagesHandler.js";

export enum ServerMessageType {
    CursorPosition = 1,
    GameMaxtrix = 2,
    ServerGameMatrixUpdate = 3,
}

export type ServerMessage = {
    type: ServerMessageType.CursorPosition;
    id: number;
    CursorPosition: number[];
} | {
    type: ServerMessageType.GameMaxtrix;
    gameMatrix: number[][];
} | {
    type: ServerMessageType.ServerGameMatrixUpdate,
    updatedMatrixPosition: number[],

}
enum ClientMessageType {
    ClientCursorPosition = 1,
    ClientGameMatrix = 2,
    ClientGameMatrixUpdate = 3,
}

type ClientMessage = {
    type: ClientMessageType.ClientCursorPosition;
    CursorPosition: number[];
} | {
    type: ClientMessageType.ClientGameMatrixUpdate;
    UpdatedPosition: number[]
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

    private handleMessage(e: MessageEvent) {

        const msg = JSON.parse(e.data) as ServerMessage;
        console.log(msg)

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

        }
    }

}
