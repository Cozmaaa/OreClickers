export class Block {

    id: number;
    name: string;
    health: number;
    image: HTMLImageElement;
    posX: number;
    posY: number;

    constructor(id: number, name: string, health: number, posX: number, posY: number) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.image = new Image()
        this.posX = posX;
        this.posY = posY;


    }

    setImageSrc(src: string) {
        this.image.src = src
    }
}
