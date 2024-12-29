import { MessagesHandler } from "./messagesHandler.js";
export var ServerMessageType;
(function (ServerMessageType) {
    ServerMessageType[ServerMessageType["CursorPosition"] = 1] = "CursorPosition";
    ServerMessageType[ServerMessageType["GameMaxtrix"] = 2] = "GameMaxtrix";
    ServerMessageType[ServerMessageType["ServerGameMatrixUpdate"] = 3] = "ServerGameMatrixUpdate";
    ServerMessageType[ServerMessageType["ServerBalanceNotify"] = 4] = "ServerBalanceNotify";
})(ServerMessageType || (ServerMessageType = {}));
var ClientMessageType;
(function (ClientMessageType) {
    ClientMessageType[ClientMessageType["ClientCursorPosition"] = 1] = "ClientCursorPosition";
    ClientMessageType[ClientMessageType["ClientGameMatrix"] = 2] = "ClientGameMatrix";
    ClientMessageType[ClientMessageType["ClientGameMatrixUpdate"] = 3] = "ClientGameMatrixUpdate";
})(ClientMessageType || (ClientMessageType = {}));
export class WsDriver {
    constructor(game) {
        this.conn = new WebSocket("ws://localhost:8080/ws");
        this.serverMessagesHandler = new MessagesHandler(game);
        this.conn.onmessage = (e) => this.handleMessage(e);
    }
    send(msg) {
        this.conn.send(JSON.stringify(msg));
    }
    sendCursorPosition(userCursorPosition) {
        const msg = {
            type: ClientMessageType.ClientCursorPosition,
            CursorPosition: userCursorPosition
        };
        this.send(msg);
    }
    sendMatrixUpdate(updatedPosition) {
        const msg = {
            type: ClientMessageType.ClientGameMatrixUpdate,
            UpdatedPosition: updatedPosition
        };
        this.send(msg);
    }
    handleMessage(e) {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
            case ServerMessageType.CursorPosition:
                this.serverMessagesHandler.handleCursorOnServer(msg);
                break;
            case ServerMessageType.GameMaxtrix:
                this.serverMessagesHandler.handleGameMatrix(msg);
                break;
            case ServerMessageType.ServerGameMatrixUpdate:
                this.serverMessagesHandler.handleUpdateGameMatrix(msg);
                break;
            case ServerMessageType.ServerBalanceNotify:
                this.serverMessagesHandler.handleBalanceUpdate(msg);
        }
    }
}
