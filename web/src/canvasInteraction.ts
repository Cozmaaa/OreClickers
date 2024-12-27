import { Game } from "./app.js";

export class CanvasHandler {
    game: Game
    directions: number[][]


    constructor(game: Game) {
        this.game = game
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    }


    handleMouseDown(event: MouseEvent) {
        let counter = 0;
        mainLoop: for (let i = 0; i < this.game.gameObject.length; i++) {
            for (let j = 0; j < this.game.gameObject[i].length; j++) {
                counter++;
                let currentBlock = this.game.gameObject[i][j];
                const rightMargin = currentBlock.posX + this.game.blockSize;
                const downMargin = currentBlock.posY + this.game.blockSize;
                if ((event.clientX >= currentBlock.posX && event.clientX <= rightMargin) &&
                    (event.clientY >= currentBlock.posY && event.clientY <= downMargin)) {
                    if (currentBlock.id === -1) {
                        break mainLoop
                    }
                    for (const [left, right] of this.directions) {
                        if ((i + left < this.game.gameObject.length && i + left >= 0) &&
                            (j + right < this.game.gameObject[i].length && j + right >= 0)) {

                            if (this.game.gameObject[i + left][j + right].id === -1 || i === 0) {
                                //this.game.WsHandler.sendMatrixUpdate([i, j]);
                                console.log(counter)
                                break
                            }
                        }
                    }

                }
            }
        }

    }

    handleMouseDownBinarySearch(event: MouseEvent) {
        let counter = 0;
        let middle = Math.floor(this.game.gameObject.length / 2)
        let left = 0;
        let right = this.game.gameObject.length - 1;
        let solutionX = -1
        let solutionY = -1
        while (left <= right) {
            counter++
            let mid = left + Math.floor((right - left) / 2);
            if (event.clientX >= this.game.gameObject[0][mid].posX && event.clientX <= this.game.gameObject[0][mid].posX + this.game.blockSize) {
                solutionX = mid
                break;
            }
            else if (event.clientX > this.game.gameObject[0][mid].posX) {
                left = mid + 1;
            }
            else {
                right = mid - 1
            }
        }
        if (solutionX === -1) {
            return
        }

        middle = Math.floor(this.game.gameObject[solutionX].length / 2)
        left = 0;
        right = this.game.gameObject[solutionX].length - 1;
        while (left <= right) {
            counter++
            let mid = left + Math.floor((right - left) / 2);
            if (event.clientY >= this.game.gameObject[mid][solutionX].posY && event.clientY <= this.game.gameObject[mid][solutionX].posY + this.game.blockSize) {
                solutionY = mid
                break;
            }
            else if (event.clientY > this.game.gameObject[mid][solutionX].posY) {
                left = mid + 1;
            }
            else {
                right = mid - 1
            }
        }
        if (solutionY !== -1 && this.game.gameObject[solutionY][solutionX].id !== -1) {
            this.game.WsHandler.sendMatrixUpdate([solutionY, solutionX]);
            console.log(counter)
        }

    }

}
