export class CanvasHandler {
    constructor(game) {
        this.game = game;
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    }
    handleMouseDown(event) {
        mainLoop: for (let i = 0; i < this.game.gameObject.length; i++) {
            for (let j = 0; j < this.game.gameObject[i].length; j++) {
                let currentBlock = this.game.gameObject[i][j];
                const rightMargin = currentBlock.posX + this.game.blockSize;
                const downMargin = currentBlock.posY + this.game.blockSize;
                if ((event.clientX >= currentBlock.posX && event.clientX <= rightMargin) &&
                    (event.clientY >= currentBlock.posY && event.clientY <= downMargin)) {
                    if (currentBlock.id === -1) {
                        break mainLoop;
                    }
                    for (const [left, right] of this.directions) {
                        if ((i + left < this.game.gameObject.length && i + left >= 0) &&
                            (j + right < this.game.gameObject[i].length && j + right >= 0)) {
                            if (this.game.gameObject[i + left][j + right].id === -1 || i === 0) {
                                this.game.WsHandler.sendMatrixUpdate([i, j]);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
