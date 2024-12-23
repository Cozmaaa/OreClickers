export class Block {
    constructor(id, name, health, posX, posY) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.image = new Image();
        this.posX = posX;
        this.posY = posY;
    }
    setImageSrc(src) {
        this.image.src = src;
    }
}
