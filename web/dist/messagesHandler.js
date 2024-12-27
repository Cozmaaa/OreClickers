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
            console.log("Am primit mesaj sa updatez matricea");
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
                    let currBlock = this.blockSimpleFactory.returnBlock(blockType);
                    currBlock.posX = x;
                    currBlock.posY = y;
                    x += this.game.blockSize;
                    this.game.gameObject[i].push(currBlock);
                }
            }
            this.game.isMatrixReady = true;
            this.game.drawer.draw();
        }
    }
    handleUpdateGameMatrix(serverMessage) {
        if (serverMessage.type === ServerMessageType.ServerGameMatrixUpdate) {
            console.log(serverMessage.updatedMatrixPosition);
            const [i, j] = serverMessage.updatedMatrixPosition;
            this.game.gameObject[i][j].id = -1;
            this.game.gameObject[i][j].health = -1;
            this.game.gameObject[i][j].name = "Empty";
            this.game.gameObject[i][j].setImageSrc('');
            this.game.gameMatrix[i][j] = -1;
        }
        this.game.drawer.draw();
    }
}
