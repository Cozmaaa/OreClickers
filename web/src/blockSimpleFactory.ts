import { Block } from "./blocks.js";

export enum BlockType {
    Empty = -1,
    Grass,
    Diamond,
    Stone,
    Coal,
    Block,
    Gold,
    Iron,
}
export class BlockSimpleFactory {
    public returnBlock(blockType: BlockType): Block {
        let block: Block

        switch (blockType) {
            case -1:
                block = new Block(-1, "Empty", -1, 0, 0);
                block.setImageSrc("./images/emptyBlock.png");
                return block;
            case 0:
                block = new Block(0, "Grass", 1, 0, 0);
                block.setImageSrc("./images/grass.webp")
                return block;

            case 1:
                block = new Block(1, "Diamond", 30, 0, 0);
                block.setImageSrc('./images/diamond.png')
                return block;

            case 2:
                block = new Block(2, "Stone", 3, 0, 0);
                block.setImageSrc('./images/stone.jpg')
                return block
            case 3:
                block = new Block(3,"Coal",10,0,0);
                block.setImageSrc('./images/coal.webp')
      return block
            case 4:
                block = new Block(4,"Dirt",1,0,0);
                block.setImageSrc('./images/block.jpg')
      return block
            case 5:
                block = new Block(5,"Gold",20,0,0);
                block.setImageSrc('./images/gold.webp')
      return block
            case 6:
                block = new Block(6,"Iron",15,0,0);
                block.setImageSrc('./images/iron.webp')
      return block
            default:
                block = new Block(-1, "NA", 0, 0, 0)

        }
        return block;
    }
}

