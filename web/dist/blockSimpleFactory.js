import { Block } from "./blocks.js";
export var BlockType;
(function (BlockType) {
    BlockType[BlockType["Grass"] = 0] = "Grass";
    BlockType[BlockType["Diamond"] = 1] = "Diamond";
    BlockType[BlockType["Stone"] = 2] = "Stone";
})(BlockType || (BlockType = {}));
export class BlockSimpleFactory {
    returnBlock(blockType) {
        let block;
        switch (blockType) {
            case 0:
                block = new Block(0, "Grass", 1, 0, 0);
                block.setImageSrc("./images/block.jpg");
                return block;
            case 1:
                block = new Block(1, "Diamond", 5, 0, 0);
                block.setImageSrc('./images/diamond.png');
                return block;
            case 2:
                block = new Block(2, "Stone", 2, 0, 0);
                block.setImageSrc('./images/stone.jpg');
                return block;
            default:
                block = new Block(-1, "NA", 0, 0, 0);
        }
        return block;
    }
}
