const canvas = document.getElementById("game") as HTMLCanvasElement;
const canvasParent = canvas.parentElement!.getBoundingClientRect();
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = canvasParent?.width;
canvas.height = canvasParent?.height;
ctx.fillStyle = "white"

ctx.fillRect(10, 10, canvas.width - 10, canvas.height - 10);


class Game {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    cursorImage: HTMLImageElement;
    websocket: WebSocket;
    cursors: Record<string, number[]>;
    sendCursorTimeout: boolean
    constructor(ctx: CanvasRenderingContext2D) {

        this.ctx = ctx;
        this.image = new Image(10, 10)
        this.image.onload = this.draw;
        this.image.src = "./block.jpg"
        this.cursorImage = new Image(25, 25)
        this.cursorImage.src = "./cursor.png"
        this.cursors = {};
        this.sendCursorTimeout = false;

        this.websocket = new WebSocket("ws://localhost:8080/ws")

        this.websocket.onmessage = (event: MessageEvent<string>) => {
            let data = JSON.parse(event.data);
            this.cursors[data.Id] = data.CursorPosition;

        }

        window.addEventListener("resize", () => {
            this.resize();
        })

        window.addEventListener("mousemove", (event) => {
            this.sendCursorPosition(event);
        });
        requestAnimationFrame(() => {
            this.draw();
        })
        this.resize();
    }

    draw() {

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#87ceeb"; //cyan 
        this.ctx.fillRect(10, 10, this.ctx.canvas.width - 20, this.ctx.canvas.height - 20);
        for (let y = 500; y < this.ctx.canvas.height; y += 100) {
            for (let x = 10; x < this.ctx.canvas.width; x += 100) {
                this.ctx.drawImage(this.image, x, y, 100, 100);
            }
        }

        this.drawCursors()



        requestAnimationFrame(() => {
            this.draw()
        })
    }


    resize() {
        const boundingElement = canvas.parentElement!.getBoundingClientRect()
        const pixelRatio = window.devicePixelRatio;

        this.ctx.canvas.width = boundingElement.width * pixelRatio;
        this.ctx.canvas.height = boundingElement.height * pixelRatio;
        this.ctx.canvas.style.width = `${boundingElement.width}px`
        this.ctx.canvas.style.height = `${boundingElement.height}px`
    }

    sendCursorPosition(event: MouseEvent) {
        if (this.sendCursorTimeout) return;

        this.websocket.send(`${event.clientX} ${event.clientY}`);
        this.sendCursorTimeout = true;
        setTimeout(() => {
            this.sendCursorTimeout = false;
        }, 10);
    }


    drawCursors() {

        this.ctx.fillStyle = "black"
        for (const [cursor, position] of Object.entries(this.cursors)) {
            this.ctx.fillStyle = "red"
            this.ctx.font = "20px Arial"
            this.ctx.fillText(cursor, position[0] - 5, position[1] - 5)
            this.ctx.drawImage(this.cursorImage, position[0], position[1], 30, 30)
        }
    }
}

const game = new Game(ctx);
game.draw()
