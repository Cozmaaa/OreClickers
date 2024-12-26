import { Game } from "./app.js";
import { ServerMessage, ServerMessageType } from "./ws-conns.js";
import { BlockSimpleFactory } from "./blockSimpleFactory.js";

export class MessagesHandler {
    game: Game
    blockSimpleFactory: BlockSimpleFactory
    constructor(game: Game) {
        this.game = game;
        this.blockSimpleFactory = new BlockSimpleFactory()
    }
    handleCursorOnServer(serverMessage: ServerMessage) {
        if (serverMessage.type === ServerMessageType.CursorPosition)
            this.game.cursors[serverMessage.id] = serverMessage.CursorPosition
    }

    handleGameMatrix(serverMessage: ServerMessage) {
        if (serverMessage.type === ServerMessageType.GameMaxtrix) {
            console.log("Am primit mesaj sa updatez matricea")
            this.game.gameMatrix = serverMessage.gameMatrix;
            //console.log(this.game.gameObject)
            this.game.gameObject = Array(this.game.gameMatrix.length)
                .fill(null)
                .map(() => []);

            let y = 400;
            for (let i = 0; i < this.game.gameMatrix.length; i++) {
                y += this.game.blockSize;
                let x = 10;
                for (let j = 0; j < this.game.gameMatrix[i].length; j++) {


                    const blockType = this.game.gameMatrix[i][j];
                    let currBlock = this.blockSimpleFactory.returnBlock(blockType)
                    currBlock.posX = x;
                    currBlock.posY = y;
                    x += this.game.blockSize
                    this.game.gameObject[i].push(currBlock)
                }
            }
            this.game.isMatrixReady = true;
            this.game.drawer.draw()
        }
    }

    handleUpdateGameMatrix(serverMessage: ServerMessage) {
        if (serverMessage.type === ServerMessageType.ServerGameMatrixUpdate) {
            console.log(serverMessage.updatedMatrixPosition)
            const [i, j] = serverMessage.updatedMatrixPosition;
            this.game.gameObject[i][j] = this.blockSimpleFactory.returnBlock(-1)
            this.game.gameMatrix[i][j] = -1
        }
        this.game.drawer.draw()
    }
}
