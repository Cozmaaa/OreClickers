import { Game } from "./app.js"

export class Drawer {
    game: Game

    constructor(game: Game) {
        this.game = game
    }

    drawBlocks() {

        let i = -1;
        for (let y = 500; y < this.game.ctx.canvas.height - 10; y += 100) {
            let j = 0
            i++;
            for (let x = 10; x < this.game.ctx.canvas.width - 10; x += 100) {
                this.drawGameMatrix(i, j, x, y);
                j++;
            }
        }
    }
    private drawGameMatrix(i: number, j: number, x: number, y: number) {
        this.game.ctx.drawImage(this.game.gameObject[i][j].image, x, y, 100, 100)
    }
}
