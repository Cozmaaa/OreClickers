export class Player {
    constructor() {
        this.money = 0;
        this.hitPower = 1;
        this.upgrades = this.initializeUpgrades();
    }
    initializeUpgrades() {
        const upgradeConfig = [
            { price: 50, name: "Better Pickaxe", image: "./images/upgrade1.webp", damage: 3 },
            { price: 150, name: "Diamond Pickaxe", image: "./images/upgrade2.webp", damage: 5 },
        ];
        return upgradeConfig.map((config) => {
            const upgrade = new Upgrade(config.price, config.name, config.damage);
            upgrade.image.src = config.image;
            return upgrade;
        });
    }
}
export class Upgrade {
    constructor(price, name, damage) {
        this.image = new Image();
        this.price = price;
        this.name = name;
        this.damage = damage;
    }
}
