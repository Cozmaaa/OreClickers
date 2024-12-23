import { ServerMessageType } from "./ws-conns.js";
import { BlockSimpleFactory } from "./blockSimpleFactory.js";
export class MessagesHandler {
    constructor(game) {
        this.game = game;
        this.blockSimpleFactory = new BlockSimpleFactory();
    }
    handleCursorOnServer(serverMessage) {
        if (serverMessage.type === ServerMessageType.CursorPosition)
            this.game.cursors[serverMessage.id] = serverMessage.CursorPosition;
    }
    handleGameMatrix(serverMessage) {
        if (serverMessage.type === ServerMessageType.GameMaxtrix) {
            this.game.gameMatrix = serverMessage.gameMatrix;
            console.log(this.game.gameMatrix);
            this.game.gameObject = Array(this.game.gameMatrix.length)
                .fill(null)
                .map(() => []);
            let y = 400;
            for (let i = 0; i < this.game.gameMatrix.length; i++) {
                y += 100;
                let x = 10;
                for (let j = 0; j < this.game.gameMatrix[i].length; j++) {
                    const blockType = this.game.gameMatrix[i][j];
                    let currBlock = this.blockSimpleFactory.returnBlock(blockType);
                    currBlock.posX = x;
                    currBlock.posY = y;
                    x += 100;
                    console.log(currBlock);
                    this.game.gameObject[i].push(currBlock);
                }
            }
            this.game.isMatrixReady = true;
            this.game.draw();
        }
        console.log("PLACEHOLDER MATRICE");
    }
}
