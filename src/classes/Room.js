import Cell from "./Cell";

class Room {
	constructor(cellSize, roomSize, lootCount, mapWidth, mapHeight) {
		this.cellSize = cellSize;
		this.lootCount = lootCount;
		this.roomSize = roomSize;
		this.x = 0;
		this.y = 0;
		this.width = this.randomSize();
		this.height = this.randomSize();

		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		// this.x = Math.floor(Math.random() * (mapWidth - this.width));
		// this.y = Math.floor(Math.random() * (mapHeight - this.height));
		this.cells = [];
		this.loot = [];

		this.findPosition();
		this.calcRoomCells();
	}

	findPosition() {
		let x = Math.floor(Math.random() * (this.mapWidth - this.width));
		let y = Math.floor(Math.random() * (this.mapHeight - this.height));
		this.setPosition(x, y);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.calcRoomCells();
	}
	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.calcRoomCells();
	}

	randomSize() {
		// Генерация случайного размера комнаты, например, 3x3 клетки, 5x5 клетки и т.д.
		return Math.floor(Math.random() * this.roomSize - 1) + 3; // Пример: от 2 до 5 клеток
	}

	calcRoomCells() {
		// console.log(this.x, this.y, this.width, this.height);

		for (let y = this.y; y < this.height + this.y; y++) {
			this.cells[y] = [];
			for (let x = this.x; x < this.width + this.x; x++) {
				this.cells[y][x] = new Cell(x, y, "floor");
			}
		}
		// console.log(this.cells);

		return this.cells;
	}

	getRoomCells() {
		return this.cells;
	}

	addLoot() {
		const lootCount = Math.floor(Math.random() * (this.lootCount / 2)) + 1;
		for (let i = 0; i < lootCount; i++) {
			this.loot.push("loot-" + i); // Добавление лута в комнату
		}
	}
	render(ctx) {
		// Отрисовка комнаты
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(
			this.x * this.cellSize,
			this.y * this.cellSize,
			this.width * this.cellSize,
			this.height * this.cellSize
		);
	}
}

export default Room;
