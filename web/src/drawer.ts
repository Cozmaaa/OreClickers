import { Game } from "./app.js"

export class Drawer {
    game: Game
    image: HTMLImageElement
    cursorImage: HTMLImageElement
    backgroundImage: HTMLImageElement
    coinImage: HTMLImageElement

    constructor(game: Game) {
        this.game = game
        this.image = new Image(10, 10)
        this.image.src = "./images/block.jpg"
        this.cursorImage = new Image(25, 25)
        this.cursorImage.src = "./images/cursor.png"
        this.backgroundImage = new Image()
        this.backgroundImage.src = "./images/background.webp"
        this.image.onload = this.draw;
        this.coinImage = new Image();
        this.coinImage.src = "./images/coin.png"
    }


    //Might need more optimising 
    drawBlocks() {
        const ctx = this.game.ctx;
        const offsetX = this.game.offset.x;
        const offsetY = this.game.offset.y;
        const blockSize = this.game.blockSize;

        const cWidth = ctx.canvas.width;
        const cHeight = ctx.canvas.height;

        mainLoop: for (let row = 0; row < this.game.gameObject.length; row++) {
            for (let col = 0; col < this.game.gameObject[row].length; col++) {
                const block = this.game.gameObject[row][col];

                // Calculate on-screen coords
                const screenX = block.posX + offsetX;
                const screenY = block.posY + offsetY;

                // (Optional) Cull if offscreen
                if (
                    screenX + blockSize < 0 || screenX > cWidth ||
                    screenY + blockSize < 0 || screenY > cHeight
                ) {
                    continue;
                }
                if (screenY > cHeight) break mainLoop;
                if (screenX > cWidth) break;

                // Draw
                ctx.drawImage(block.image, screenX, screenY, blockSize, blockSize);
                if (block.id !== -1) {
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX, screenY, blockSize, blockSize);
                }
            }
        }
    }

    draw() {

        if (!this.game.isMatrixReady) {
            console.log("Matrix not ready yet")
            return
        }
        //background sky
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = "#87ceeb"; //cyan 
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

        this.drawBlocks()
        this.drawCursors()
        this.drawMoney()

        //Countour
        this.game.ctx.fillStyle = "black";
        this.game.ctx.lineWidth = 20;
        this.game.ctx.strokeRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height)



        requestAnimationFrame(() => {
            this.draw()
        })
    }
    drawCursors() {

        this.game.ctx.fillStyle = "black"
        for (const [cursor, position] of Object.entries(this.game.cursors)) {
            this.game.ctx.fillStyle = "red"
            this.game.ctx.font = "20px Arial"
            this.game.ctx.fillText(cursor, position[0] - 5 + this.game.offset.x, position[1] - 5 + this.game.offset.y)
            this.game.ctx.drawImage(this.cursorImage, position[0] + this.game.offset.x, position[1] + this.game.offset.y, 30, 30)
        }
    }

    drawMoney() {
        this.game.ctx.font = "40px Arial"
        this.game.ctx.fillStyle = "black"
        this.game.ctx.fillText(String(this.game.player.money), 50, 50)
        this.game.ctx.drawImage(this.coinImage, 18, 22, 30, 30)
    }
}
