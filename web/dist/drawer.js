export class Drawer {
    constructor(game) {
        this.game = game;
        this.image = new Image(10, 10);
        this.image.src = "./images/block.jpg";
        this.cursorImage = new Image(25, 25);
        this.cursorImage.src = "./images/cursor.png";
        this.backgroundImage = new Image();
        this.backgroundImage.src = "./images/background.webp";
        this.image.onload = this.draw;
    }
    drawBlocks() {
        let i = -1;
        for (let y = 500; y < this.game.ctx.canvas.height - 10; y += this.game.blockSize) {
            let j = 0;
            i++;
            for (let x = 10; x < this.game.ctx.canvas.width - 10; x += this.game.blockSize) {
                this.drawGameMatrix(i, j, x, y);
                j++;
            }
        }
    }
    drawGameMatrix(i, j, x, y) {
        this.game.ctx.drawImage(this.game.gameObject[i][j].image, x, y, this.game.blockSize, this.game.blockSize);
    }
    draw() {
        if (!this.game.isMatrixReady) {
            console.log("Matrix not ready yet");
            return;
        }
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = "#87ceeb"; //cyan 
        this.game.ctx.fillRect(10, 10, this.game.ctx.canvas.width - 20, this.game.ctx.canvas.height - 20);
        this.game.ctx.drawImage(this.backgroundImage, 10, 500);
        this.drawBlocks();
        this.drawCursors();
        requestAnimationFrame(() => {
            this.draw();
        });
    }
    drawCursors() {
        this.game.ctx.fillStyle = "black";
        for (const [cursor, position] of Object.entries(this.game.cursors)) {
            this.game.ctx.fillStyle = "red";
            this.game.ctx.font = "20px Arial";
            this.game.ctx.fillText(cursor, position[0] - 5, position[1] - 5);
            this.game.ctx.drawImage(this.cursorImage, position[0], position[1], 30, 30);
        }
    }
}
