import { BlockSimpleFactory } from "./blockSimpleFactory.js";
import { CanvasHandler } from "./canvasInteraction.js";
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
        this.cursors = {};
        this.sendCursorTimeout = false;
        this.gameMatrix = [[]];
        this.gameObject = [[]];
        this.isMatrixReady = false;
        this.blockSimpleFactory = new BlockSimpleFactory();
        this.drawer = new Drawer(this);
        this.blockSize = 100;
        this.WsHandler = new WsDriver(this);
        this.canvasHandler = new CanvasHandler(this);
        window.addEventListener("resize", () => {
            this.resize();
        });
        window.addEventListener("mousemove", (event) => {
            const currentCursorPosition = [event.clientX, event.clientY];
            this.WsHandler.sendCursorPosition(currentCursorPosition);
        });
        window.addEventListener("mousedown", (event) => {
            this.canvasHandler.handleMouseDown(event);
        });
        requestAnimationFrame(() => {
            this.drawer.draw();
        });
        this.resize();
    }
    resize() {
        const boundingElement = canvas.parentElement.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio;
        this.ctx.canvas.width = boundingElement.width * pixelRatio;
        this.ctx.canvas.height = boundingElement.height * pixelRatio;
        this.ctx.canvas.style.width = `${boundingElement.width}px`;
        this.ctx.canvas.style.height = `${boundingElement.height}px`;
    }
}
const game = new Game(ctx);
game.drawer.draw();
