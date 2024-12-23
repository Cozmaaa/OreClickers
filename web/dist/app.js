import { BlockSimpleFactory } from "./blockSimpleFactory.js";
import { Drawer } from "./drawer.js";
import { WsDriver } from "./ws-conns.js";
const canvas = document.getElementById("game");
const canvasParent = canvas.parentElement.getBoundingClientRect();
const ctx = canvas.getContext("2d");
canvas.width = canvasParent === null || canvasParent === void 0 ? void 0 : canvasParent.width;
canvas.height = canvasParent === null || canvasParent === void 0 ? void 0 : canvasParent.height;
ctx.fillStyle = "white";
ctx.fillRect(10, 10, canvas.width - 10, canvas.height - 10);
export class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.image = new Image(10, 10);
        this.image.onload = this.draw;
        this.image.src = "./images/block.jpg";
        this.cursorImage = new Image(25, 25);
        this.cursorImage.src = "./images/cursor.png";
        this.cursors = {};
        this.sendCursorTimeout = false;
        this.gameMatrix = [[]];
        this.gameObject = [[]];
        this.isMatrixReady = false;
        this.blockSimpleFactory = new BlockSimpleFactory();
        this.drawer = new Drawer(this);
        this.WsHandler = new WsDriver(this);
        window.addEventListener("resize", () => {
            this.resize();
        });
        window.addEventListener("mousemove", (event) => {
            this.sendCursorPosition(event);
        });
        requestAnimationFrame(() => {
            this.draw();
        });
        this.resize();
    }
    draw() {
        if (!this.isMatrixReady) {
            console.log("Matrix not ready yet");
            return;
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#87ceeb"; //cyan 
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);
        this.drawer.drawBlocks();
        this.drawCursors();
        requestAnimationFrame(() => {
            this.draw();
        });
    }
    resize() {
        const boundingElement = canvas.parentElement.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;
        this.ctx.canvas.width = boundingElement.width * pixelRatio;
        this.ctx.canvas.height = boundingElement.height * pixelRatio;
        this.ctx.canvas.style.width = `${boundingElement.width}px`;
        this.ctx.canvas.style.height = `${boundingElement.height}px`;
    }
    sendCursorPosition(event) {
        if (this.sendCursorTimeout)
            return;
        this.WsHandler.conn.send(`${event.clientX} ${event.clientY}`);
        this.sendCursorTimeout = true;
        setTimeout(() => {
            this.sendCursorTimeout = false;
        }, 10);
    }
    drawCursors() {
        this.ctx.fillStyle = "black";
        for (const [cursor, position] of Object.entries(this.cursors)) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(cursor, position[0] - 5, position[1] - 5);
            this.ctx.drawImage(this.cursorImage, position[0], position[1], 30, 30);
        }
    }
}
const game = new Game(ctx);
game.draw();
