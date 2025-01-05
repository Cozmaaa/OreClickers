import { BlockSimpleFactory } from "./blockSimpleFactory.js";
import { CanvasHandler } from "./canvasInteraction.js";
import { Drawer } from "./drawer.js";
import { Player } from "./player.js";
import { WsDriver } from "./ws-conns.js";
const canvas = document.getElementById("game");
const canvasParent = canvas.parentElement.getBoundingClientRect();
const ctx = canvas.getContext("2d");
canvas.width = canvasParent === null || canvasParent === void 0 ? void 0 : canvasParent.width;
canvas.height = canvasParent === null || canvasParent === void 0 ? void 0 : canvasParent.height;
ctx.fillStyle = "white";
ctx.fillRect(10, 10, canvas.width - 10, canvas.height - 10);
export const GAME_STATES = {
    MAIN_MENU: "MAIN_MENU",
    CREATE_LOBBY: "CREATE_LOBBY",
    JOIN_LOBBY: "JOIN_LOBBY",
    INSERT_USERNAME: "INSERT_USERNAME",
    IN_GAME: "IN_GAME",
};
export class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.cursors = {};
        this.sendCursorTimeout = false;
        this.gameMatrix = [[]];
        this.gameObject = [[]];
        this.isMatrixReady = false;
        this.player = new Player();
        this.blockSimpleFactory = new BlockSimpleFactory();
        this.drawer = new Drawer(this);
        this.blockSize = 50;
        this.WsHandler = new WsDriver(this);
        this.canvasHandler = new CanvasHandler(this, this.drawer);
        this.isDragging = false;
        this.dragTimeout = 0;
        this.lastMousePosition = [];
        this.offset = { x: 0, y: 0 };
        this.gameState = GAME_STATES.MAIN_MENU;
        window.addEventListener("resize", () => {
            this.resize();
        });
        window.addEventListener("mousemove", (event) => {
            const currentCursorPosition = [event.clientX - this.offset.x, event.clientY - this.offset.y];
            if (this.gameState === GAME_STATES.IN_GAME) {
                this.WsHandler.sendCursorPosition(currentCursorPosition);
            }
            if (this.isDragging) {
                const dx = event.clientX - this.lastMousePosition[0];
                const dy = event.clientY - this.lastMousePosition[1];
                this.offset.x += dx;
                this.offset.y += dy;
                //We find out how many can be per row/column in order to know how much to let the user move
                const maxPerCol = Math.ceil(canvas.width / this.blockSize);
                //Here we have to do extra calculations because the camera starts from y=400 so we need to add 400 pixels of size from the blocks to render 
                //Also we to substraction  because under we compare with -(this.gameobject) so we basically - - => +
                const maxPerRow = Math.ceil(canvas.height / this.blockSize) - Math.floor(400 / this.blockSize);
                this.offset.x = Math.min(this.offset.x, 0);
                this.offset.x = Math.max(this.offset.x, -(this.gameObject[0].length - maxPerCol) * this.blockSize);
                this.offset.y = Math.min(this.offset.y, 0);
                this.offset.y = Math.max(this.offset.y, -(this.gameObject.length - maxPerRow) * this.blockSize);
                this.lastMousePosition[0] = event.clientX;
                this.lastMousePosition[1] = event.clientY;
            }
        });
        window.addEventListener("mousedown", (event) => {
            //this.canvasHandler.handleMouseDownBinarySearch(event)
            this.canvasHandler.handleUserState(this.gameState, event);
            console.log(this.gameState);
            //Timeout to not instantly drag
            this.dragTimeout = setTimeout(() => {
                this.isDragging = true;
                this.lastMousePosition[0] = event.clientX;
                this.lastMousePosition[1] = event.clientY;
            }, 100);
        });
        window.addEventListener("keydown", (event) => {
            this.canvasHandler.handleUserState(this.gameState, event);
        });
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            clearTimeout(this.dragTimeout);
        });
        requestAnimationFrame(() => {
            this.drawer.handleDrawState(this.gameState);
            console.log(this.gameState);
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
game.drawer.handleDrawState(game.gameState);
game.drawer.draw();
