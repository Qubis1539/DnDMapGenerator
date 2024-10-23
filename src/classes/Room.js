class Room {
    constructor(cellSize, mapWidth, mapHeight) {
        this.cellSize = cellSize;
        this.width = this.randomSize();
        this.height = this.randomSize();
        this.x = Math.floor(Math.random() * (mapWidth - this.width));
        this.y = Math.floor(Math.random() * (mapHeight - this.height));
        this.loot = [];
    }

    randomSize() {
        // Генерация случайного размера комнаты, например, 3x3 клетки, 5x5 клетки и т.д.
        return Math.floor(Math.random() * 3) + 2; // Пример: от 2 до 5 клеток
    }

    addLoot(maxLoot) {
        const lootCount = Math.floor(Math.random() * (maxLoot / 2)) + 1;
        for (let i = 0; i < lootCount; i++) {
            this.loot.push("loot-" + i); // Добавление лута в комнату
        }
    }
}

export default Room;
