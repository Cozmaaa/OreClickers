export class CanvasHandler {
    constructor(game, drawer) {
        this.game = game;
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.drawer = drawer;
    }
    handleMouseDownBinarySearch(event) {
        if (this.drawer.isShopOpen) {
            this.drawer.isShopOpen = !this.checkIfCloseShop(event);
            this.checkIfButtonClicked(event);
            return;
        }
        if (this.checkIfShopClicked(event)) {
            this.drawer.isShopOpen = true;
            return;
        }
        let counter = 0;
        let middle = Math.floor(this.game.gameObject.length / 2);
        let left = 0;
        let right = this.game.gameObject.length - 1;
        let solutionX = -1;
        let solutionY = -1;
        //This is in order to read the correct blocks when the game is dragged around
        const offsetedMousePosX = event.clientX - this.game.offset.x;
        const offsetedMousePosY = event.clientY - this.game.offset.y;
        while (left <= right) {
            counter++;
            let mid = left + Math.floor((right - left) / 2);
            if (offsetedMousePosX >= this.game.gameObject[0][mid].posX && offsetedMousePosX <= this.game.gameObject[0][mid].posX + this.game.blockSize) {
                solutionX = mid;
                break;
            }
            else if (offsetedMousePosX > this.game.gameObject[0][mid].posX) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        if (solutionX === -1) {
            return;
        }
        middle = Math.floor(this.game.gameObject[solutionX].length / 2);
        left = 0;
        right = this.game.gameObject[solutionX].length - 1;
        while (left <= right) {
            counter++;
            let mid = left + Math.floor((right - left) / 2);
            if (offsetedMousePosY >= this.game.gameObject[mid][solutionX].posY && offsetedMousePosY <= this.game.gameObject[mid][solutionX].posY + this.game.blockSize) {
                solutionY = mid;
                break;
            }
            else if (offsetedMousePosY > this.game.gameObject[mid][solutionX].posY) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        if (solutionY !== -1 && this.game.gameObject[solutionY][solutionX].id !== -1) {
            this.game.WsHandler.sendMatrixUpdate([solutionY, solutionX]);
            console.log(counter);
        }
    }
    checkIfShopClicked(event) {
        const actualClickX = event.clientX - this.game.offset.x;
        const acutalClickY = event.clientY - this.game.offset.y;
        if (actualClickX > 0 && actualClickX < 400 &&
            acutalClickY > 236 && acutalClickY < 214 + 236) {
            console.log("Shop clicked");
            return true;
        }
        return false;
    }
    checkIfCloseShop(event) {
        if (event.clientX < 200 || event.clientX > this.game.ctx.canvas.width - 200 ||
            event.clientY < 200 || event.clientY > this.game.ctx.canvas.height - 200) {
            return true;
        }
        return false;
    }
    checkIfButtonClicked(event) {
        const upgradeSizeX = 200;
        const upgradeSizeY = 200;
        const buttonHeight = 30;
        const buttonPadding = 10;
        for (let i = 0; i < this.game.player.upgrades.length; i++) {
            // Calculate button boundaries
            const buttonX = 200 * (i + 1) + buttonPadding;
            const buttonY = upgradeSizeY + 200;
            const buttonWidth = upgradeSizeX - buttonPadding * 2;
            // Check if the click is within the button's bounds
            if (event.clientX >= buttonX &&
                event.clientX <= buttonX + buttonWidth &&
                event.clientY >= buttonY &&
                event.clientY <= buttonY + buttonHeight) {
                console.log(`Button for upgrade ${this.game.player.upgrades[i].name} clicked!`);
                // Handle button click, e.g., purchase logic
                if (this.game.player.money < this.game.player.upgrades[i].price) {
                    console.log("NU AI BANII NECESARI");
                    console.log(this.game.player.money + "    price   " + this.game.player.upgrades[i].price);
                }
                else {
                    this.game.player.money -= this.game.player.upgrades[i].price;
                    this.game.WsHandler.sendUserUpgradeBought(this.game.player.upgrades[i].damage, this.game.player.upgrades[i].price);
                }
            }
        }
    }
}
