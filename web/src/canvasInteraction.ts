import { Game } from "./app.js";
import { Drawer } from "./drawer.js";

export class CanvasHandler {
    game: Game
    directions: number[][]
    drawer: Drawer;


    constructor(game: Game, drawer: Drawer) {
        this.game = game
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
        this.drawer = drawer;

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
        if (this.drawer.isShopOpen) {
            this.drawer.isShopOpen = !this.checkIfCloseShop(event)
            return;
        }
        if (this.checkIfShopClicked(event)) {
            this.drawer.setIsShopClicked()
        }

        let counter = 0;
        let middle = Math.floor(this.game.gameObject.length / 2)
        let left = 0;
        let right = this.game.gameObject.length - 1;
        let solutionX = -1
        let solutionY = -1

        //This is in order to read the correct blocks when the game is dragged around
        const offsetedMousePosX = event.clientX - this.game.offset.x;
        const offsetedMousePosY = event.clientY - this.game.offset.y;
        while (left <= right) {
            counter++
            let mid = left + Math.floor((right - left) / 2);
            if (offsetedMousePosX >= this.game.gameObject[0][mid].posX && offsetedMousePosX <= this.game.gameObject[0][mid].posX + this.game.blockSize) {
                solutionX = mid
                break;
            }
            else if (offsetedMousePosX > this.game.gameObject[0][mid].posX) {
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
            if (offsetedMousePosY >= this.game.gameObject[mid][solutionX].posY && offsetedMousePosY <= this.game.gameObject[mid][solutionX].posY + this.game.blockSize) {
                solutionY = mid
                break;
            }
            else if (offsetedMousePosY > this.game.gameObject[mid][solutionX].posY) {
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

    private checkIfShopClicked(event: MouseEvent): boolean {

        const actualClickX = event.clientX - this.game.offset.x;
        const acutalClickY = event.clientY - this.game.offset.y;
        if (actualClickX > 0 && actualClickX < 400 &&
            acutalClickY > 236 && acutalClickY < 214 + 236) {
            console.log("Shop clicked")
            return true;
        }
        return false;
    }

    private checkIfCloseShop(event: MouseEvent): boolean {

        if (event.clientX < 200 || event.clientX > 200 + this.drawer.shopMenuWidth ||
            event.clientY < 200 || event.clientY > 200 + this.drawer.shopMenuHeight) {
            return true;
        }

        return false;
    }

}
