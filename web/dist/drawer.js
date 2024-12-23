export class Drawer {
    constructor(game) {
        this.game = game;
    }
    drawBlocks() {
        let i = -1;
        for (let y = 500; y < this.game.ctx.canvas.height - 10; y += 100) {
            let j = 0;
            i++;
            for (let x = 10; x < this.game.ctx.canvas.width - 10; x += 100) {
                this.drawGameMatrix(i, j, x, y);
                j++;
            }
        }
    }
    drawGameMatrix(i, j, x, y) {
        this.game.ctx.drawImage(this.game.gameObject[i][j].image, x, y, 100, 100);
    }
}
