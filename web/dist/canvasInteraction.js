import { GAME_STATES } from "./app.js";
export class CanvasHandler {
    constructor(game, drawer) {
        this.game = game;
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.drawer = drawer;
        this.lobbyName = "";
        this.username = "";
    }
    handleUserState(gameState, event) {
        switch (gameState) {
            case GAME_STATES.MAIN_MENU:
                console.log("MAIN MENU");
                if (event instanceof MouseEvent) {
                    this.handleMainMenuClicks(event);
                }
                break;
            case GAME_STATES.CREATE_LOBBY:
                this.createLobby = true;
                console.log("CREATE_LOBBY MENU");
                if (event instanceof KeyboardEvent) {
                    this.handleCreateLobbyKeyboardEvents(event);
                }
                else if (event instanceof MouseEvent) {
                    this.handleCreateLobbyMouseEvents(event);
                }
                break;
            case GAME_STATES.IN_GAME:
                if (event instanceof MouseEvent) {
                    this.handleMouseDownBinarySearch(event);
                }
                break;
            case GAME_STATES.JOIN_LOBBY:
                this.createLobby = false;
                console.log("JOIN_LOBBY MENU");
                if (event instanceof KeyboardEvent) {
                    this.handleCreateLobbyKeyboardEvents(event);
                }
                else if (event instanceof MouseEvent) {
                    this.handleCreateLobbyMouseEvents(event);
                }
                break;
            case GAME_STATES.INSERT_USERNAME:
                console.log("INSERT_USERNAME MENU");
                if (event instanceof KeyboardEvent) {
                    this.handleInsertUsernameKeyboardEvents(event);
                }
                else if (event instanceof MouseEvent) {
                    this.handleInsertUsernameMouseEvents(event);
                }
                break;
        }
    }
    handleMainMenuClicks(event) {
        const buttonWidth = 300;
        const buttonHeight = 30;
        const createLobbyButton = {
            x: this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10,
            y: this.game.ctx.canvas.height / 2 - buttonHeight,
            width: buttonWidth,
            height: buttonHeight
        };
        const joinLobbyButton = {
            x: this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10,
            y: this.game.ctx.canvas.height / 2 + 10,
            width: buttonWidth,
            height: buttonHeight
        };
        // Check if the click is within the "Create lobby" button
        if (event.clientX >= createLobbyButton.x &&
            event.clientX <= createLobbyButton.x + createLobbyButton.width &&
            event.clientY >= createLobbyButton.y &&
            event.clientY <= createLobbyButton.y + createLobbyButton.height) {
            console.log("Create lobby button clicked");
            this.game.gameState = GAME_STATES.CREATE_LOBBY;
            this.game.drawer.handleDrawState(this.game.gameState);
            return;
        }
        // Check if the click is within the "Join lobby" button
        if (event.clientX >= joinLobbyButton.x &&
            event.clientX <= joinLobbyButton.x + joinLobbyButton.width &&
            event.clientY >= joinLobbyButton.y &&
            event.clientY <= joinLobbyButton.y + joinLobbyButton.height) {
            console.log("Join lobby button clicked");
            this.game.gameState = GAME_STATES.JOIN_LOBBY;
            this.game.drawer.handleDrawState(this.game.gameState);
            return;
        }
        console.log("No button clicked");
    }
    handleCreateLobbyKeyboardEvents(event) {
        this.lobbyName += event.key;
        console.log(this.lobbyName);
        this.drawer.handleDrawState(this.game.gameState, this.lobbyName);
    }
    handleCreateLobbyMouseEvents(event) {
        // Check if the click is within the "Create Lobby" button bounds
        if (event.clientX >= this.game.ctx.canvas.width / 2 - 300 / 2 - 10 &&
            event.clientX <= this.game.ctx.canvas.width / 2 - 300 / 2 - 10 + 300 &&
            event.clientY >= this.game.ctx.canvas.height / 2 &&
            event.clientY <= this.game.ctx.canvas.height / 2 + 50) {
            console.log("Create Lobby button clicked!");
            // Handle create lobby button click
            this.game.gameState = GAME_STATES.INSERT_USERNAME;
            this.drawer.handleDrawState(this.game.gameState);
        }
    }
    handleInsertUsernameKeyboardEvents(event) {
        // Append the pressed key to the username string
        if (event.key === 'Backspace') {
            // Handle backspace to delete last character
            this.username = this.username.slice(0, -1);
        }
        else if (event.key.length === 1) {
            // Only append a single character if it's a printable key
            this.username += event.key;
        }
        console.log(this.username);
        // Update the screen with the current username
        this.drawer.handleDrawState(this.game.gameState, undefined, this.username);
    }
    handleInsertUsernameMouseEvents(event) {
        const buttonWidth = 300;
        const buttonHeight = 50;
        // Define the area for the "Submit Username" button
        const submitButton = {
            x: this.game.ctx.canvas.width / 2 - buttonWidth / 2 - 10,
            y: this.game.ctx.canvas.height / 2 + 10,
            width: buttonWidth,
            height: buttonHeight
        };
        // Check if the click is within the "Submit Username" button
        if (event.clientX >= submitButton.x &&
            event.clientX <= submitButton.x + submitButton.width &&
            event.clientY >= submitButton.y &&
            event.clientY <= submitButton.y + submitButton.height) {
            console.log("Submit Username button clicked");
            // Transition to the IN_GAME state
            this.game.gameState = GAME_STATES.IN_GAME;
            this.drawer.handleDrawState(this.game.gameState);
        }
        else {
            console.log("Click not in Submit button bounds.");
        }
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
