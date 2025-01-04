import { GAME_STATES } from "./app.js";
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
        this.coinImage = new Image();
        this.coinImage.src = "./images/coin.png";
        this.hiddenBlockImage = new Image();
        this.hiddenBlockImage.src = './images/blacked.png';
        this.shopImage = new Image();
        this.shopImage.src = './images/shop.png';
        this.isShopOpen = false;
        this.player = this.game.player; //Maybe we will need to change this later
    }
    handleDrawState(gameState, lobbyName, currentName) {
        console.log(gameState);
        switch (gameState) {
            case GAME_STATES.MAIN_MENU:
                this.drawMainMenu();
                break;
            case GAME_STATES.CREATE_LOBBY:
                this.drawCreateLobby(lobbyName);
                break;
            case GAME_STATES.IN_GAME:
                this.draw();
                break;
            case GAME_STATES.INSERT_USERNAME:
                this.drawInsertUsername(currentName);
                break;
            case GAME_STATES.JOIN_LOBBY:
                this.drawJoinLobby(lobbyName);
                break;
        }
    }
    drawMainMenu() {
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = "50px serif";
        this.game.ctx.fillText("WELCOME TO THE GAME", this.game.ctx.canvas.width / 3, this.game.ctx.canvas.height / 3);
        const buttonWidth = 300;
        const buttonHeight = 50;
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - buttonHeight, buttonWidth, buttonHeight);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillText("Create lobby", this.game.ctx.canvas.width / 2 - buttonWidth / 2 + 10, this.game.ctx.canvas.height / 2 - 10);
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 + 10, buttonWidth, buttonHeight);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillText("Join lobby", this.game.ctx.canvas.width / 2 - buttonWidth / 2 + 10, this.game.ctx.canvas.height / 2 + buttonHeight);
    }
    drawCreateLobby(currentName) {
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = "50px serif";
        this.game.ctx.fillText("PLEASE INSERT A LOBBY NAME", this.game.ctx.canvas.width / 3, this.game.ctx.canvas.height / 3);
        const buttonWidth = 300;
        const buttonHeight = 50;
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2, buttonWidth, buttonHeight);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - buttonHeight - 10, buttonWidth, buttonHeight);
        if (currentName !== undefined) {
            this.game.ctx.fillStyle = "black";
            this.game.ctx.fillText(currentName, this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - 20);
        }
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillText("Create lobby", this.game.ctx.canvas.width / 2 - buttonWidth / 2 + 10, this.game.ctx.canvas.height / 2 + 37);
    }
    drawInsertUsername(currentName) {
        console.log("AM INTRAT IN DRAWUSERNAME");
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = "50px serif";
        this.game.ctx.fillText("PLEASE INSERT A USERNAME", this.game.ctx.canvas.width / 3, this.game.ctx.canvas.height / 3);
        const buttonWidth = 300;
        const buttonHeight = 50;
        // Draw the button for inserting the username
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 + 10, buttonWidth, buttonHeight);
        this.game.ctx.fillStyle = 'white';
        // Draw the input field for the username
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - buttonHeight - 10, buttonWidth, buttonHeight);
        if (currentName !== undefined) {
            this.game.ctx.fillStyle = "black";
            this.game.ctx.fillText(currentName, this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - 20);
        }
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillText("Insert Username", this.game.ctx.canvas.width / 2 - buttonWidth / 2 + 10, this.game.ctx.canvas.height / 2 + 37);
    }
    drawJoinLobby(currentName) {
        console.log("am intrat in draw join");
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.font = "50px serif";
        this.game.ctx.fillText("PLEASE INSERT A LOBBY NAME", this.game.ctx.canvas.width / 3, this.game.ctx.canvas.height / 3);
        const buttonWidth = 300;
        const buttonHeight = 50;
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2, buttonWidth, buttonHeight);
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - buttonHeight - 10, buttonWidth, buttonHeight);
        if (currentName !== undefined) {
            this.game.ctx.fillStyle = "black";
            this.game.ctx.fillText(currentName, this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10, this.game.ctx.canvas.height / 2 - 20);
        }
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillText("Join lobby", this.game.ctx.canvas.width / 2 - buttonWidth / 2 + 10, this.game.ctx.canvas.height / 2 + 37);
    }
    //Might need more optimising 
    drawBlocks() {
        const ctx = this.game.ctx;
        const offsetX = this.game.offset.x;
        const offsetY = this.game.offset.y;
        const blockSize = this.game.blockSize;
        const cWidth = ctx.canvas.width;
        const cHeight = ctx.canvas.height;
        let numberOfRenders = 0;
        for (let row = 0; row < this.game.gameObject.length; row++) {
            const rowBlockY = this.game.gameObject[row][0].posY + offsetY;
            if (rowBlockY > cHeight) {
                break;
            }
            //To make sure the blocks dont render out while still in frame
            if (rowBlockY + blockSize < 0) {
                continue;
            }
            for (let col = 0; col < this.game.gameObject[row].length; col++) {
                const block = this.game.gameObject[row][col];
                numberOfRenders++;
                // Calculate on-screen coords
                const screenX = block.posX + offsetX;
                // (Optional) Cull if offscreen
                if (screenX + blockSize < 0 || screenX > cWidth) {
                    continue;
                }
                const screenY = block.posY + offsetY;
                // Draw
                ctx.drawImage(block.image, screenX, screenY, blockSize, blockSize);
                if (block.id !== -1) {
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX, screenY, blockSize, blockSize);
                }
                //TODO: change this if you want the blocks to be hidden
                // this.drawBlocksLogic(row, col, screenX, screenY)
            }
        }
        console.log(numberOfRenders);
    }
    drawBlocksLogic(row, col, screenX, screenY) {
        const hiddenBlock = this.getHiddenBlockImage(); // Use a preloaded hidden block image
        let isMinedAround = false;
        // Define the directions to check (up, down, left, right)
        const directions = [
            [0, 1], // Right
            [1, 0], // Down
            [-1, 0], // Up
            [0, -1], // Left
        ];
        // Check if there are mined blocks around
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            // Ensure we're within bounds
            if (newRow >= 0 && newRow < this.game.gameObject.length &&
                newCol >= 0 && newCol < this.game.gameObject[0].length) {
                if (this.game.gameObject[newRow][newCol].id === -1) { // Check for mined block
                    isMinedAround = true;
                    break;
                }
            }
        }
        // Draw the appropriate block
        const ctx = this.game.ctx;
        const block = this.game.gameObject[row][col];
        if (row === 0 || isMinedAround) {
            ctx.shadowBlur = 0;
            ctx.drawImage(block.image, screenX, screenY, this.game.blockSize, this.game.blockSize);
            if (block.id !== -1) {
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, this.game.blockSize, this.game.blockSize);
            }
        }
        else {
            ctx.drawImage(hiddenBlock, screenX, screenY, this.game.blockSize, this.game.blockSize);
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, this.game.blockSize, this.game.blockSize);
        }
    }
    // Helper method to preload the hidden block image
    getHiddenBlockImage() {
        return this.hiddenBlockImage;
    }
    draw() {
        if (!this.game.isMatrixReady) {
            console.log("Matrix not ready yet");
            return;
        }
        //background sky
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.game.ctx.fillStyle = "#87ceeb"; //cyan 
        this.game.ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.drawBlocks();
        this.drawCursors();
        this.drawMoney();
        this.drawShop();
        if (this.isShopOpen) {
            this.drawShopMenu();
            this.drawShopMenuItems();
        }
        //Countour
        this.game.ctx.fillStyle = "black";
        this.game.ctx.lineWidth = 20;
        this.game.ctx.strokeRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        requestAnimationFrame(() => {
            this.draw();
        });
    }
    drawCursors() {
        this.game.ctx.fillStyle = "black";
        for (const [cursor, position] of Object.entries(this.game.cursors)) {
            this.game.ctx.fillStyle = "red";
            this.game.ctx.font = "20px Arial";
            this.game.ctx.fillText(cursor, position[0] - 5 + this.game.offset.x, position[1] - 5 + this.game.offset.y);
            this.game.ctx.drawImage(this.cursorImage, position[0] + this.game.offset.x, position[1] + this.game.offset.y, 30, 30);
        }
    }
    drawMoney() {
        this.game.ctx.font = "40px Arial";
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillText(String(this.game.player.money), 50, 50);
        this.game.ctx.drawImage(this.coinImage, 18, 22, 30, 30);
    }
    drawShop() {
        this.game.ctx.drawImage(this.shopImage, 0 + this.game.offset.x, 236 + this.game.offset.y, 400, 214);
    }
    drawShopMenu() {
        this.game.ctx.fillStyle = "cyan";
        this.game.ctx.fillRect(200, 200, this.game.ctx.canvas.width - 400, this.game.ctx.canvas.height - 400);
    }
    drawShopMenuItems() {
        const upgradeSizeX = 200;
        const upgradeSizeY = 200;
        for (let i = 0; i < this.player.upgrades.length; i++) {
            //Drawing the upgrade image
            this.game.ctx.drawImage(this.player.upgrades[i].image, 200 * (i + 1), 200, upgradeSizeX, upgradeSizeY);
            //Drawing the button background
            this.game.ctx.fillStyle = "orange";
            this.game.ctx.fillRect(200 * (i + 1) + 10, upgradeSizeY + 200, upgradeSizeX - 20, 30);
            //Drawing the price
            this.game.ctx.fillStyle = "black";
            this.game.ctx.fillText(String(this.player.upgrades[i].price), 200 * (i + 1) + 75, 200 + upgradeSizeY + 30);
        }
    }
}
