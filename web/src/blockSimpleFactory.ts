import { Block } from "./blocks.js";

export enum BlockType {
    Grass,
    Diamond,
    Stone
}
export class BlockSimpleFactory {
    public returnBlock(blockType: BlockType): Block {
        let block: Block

        switch (blockType) {
            case 0:
                block = new Block(0, "Grass", 1, 0, 0);
                block.setImageSrc("./images/block.jpg")
                return block;

            case 1:
                block = new Block(1, "Diamond", 5, 0, 0);
                block.setImageSrc('./images/diamond.png')
                return block;

            case 2:
                block = new Block(2, "Stone", 2, 0, 0);
                block.setImageSrc('./images/stone.jpg')
                return block

            default:
                block = new Block(-1, "NA", 0, 0, 0)

        }
        return block;
    }
}

