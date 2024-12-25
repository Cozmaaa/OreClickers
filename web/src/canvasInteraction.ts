import { Game } from "./app.js";

export class CanvasHandler {
    game: Game


    constructor(game: Game) {
        this.game = game
    }


    handleMouseDown(event: MouseEvent) {
        mainLoop: for (let i = 0; i < this.game.gameObject.length; i++) {
            for (let j = 0; j < this.game.gameObject[i].length; j++) {
                let currentBlock = this.game.gameObject[i][j];
                const rightMargin = currentBlock.posX + this.game.blockSize;
                const downMargin = currentBlock.posY + this.game.blockSize;
                if ((event.clientX >= currentBlock.posX && event.clientX <= rightMargin) &&
                    (event.clientY >= currentBlock.posY && event.clientY <= downMargin)) {
                    if (currentBlock.id === -1) {
                        break mainLoop
                    }
                    this.game.WsHandler.sendMatrixUpdate([i, j]);

                }
            }
        }

    }

}
