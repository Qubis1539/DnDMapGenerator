import Room from "./Room.js";
import Cell from "./Cell.js";
class Dungeon {
	constructor(cellSize, width, height, roomSize, roomCount, lootCount) {
		this.cellSize = cellSize;
		this.width = width; //size in cells
		this.height = height; //size in cells
		this.roomCount = roomCount;
		this.roomSize = roomSize;
		this.lootCount = lootCount;
		this.cells = [];
		this.rooms = [];
		this.loot = [];
	}

	generateRooms() {
		for (let i = 0; i < this.roomCount; i++) {
			const x = Math.floor(Math.random() * (this.width - this.roomSize));
			const y = Math.floor(Math.random() * (this.height - this.roomSize));

			const loot = this.getRandomLoot();
			// cellSize, roomSize, lootCount, dungeonWidth, dungeonHeight
			const room = new Room(
				this.cellSize,
				this.roomSize,
				this.lootCount,
				this.width,
				this.height
			);
			this.rooms.push(room);
		}
		this.fixRoomsCollisions();
	}
	isCollided(target1, target2) {
		if (
			target1.x < target2.x + target2.width &&
			target1.x + target1.width > target2.x &&
			target1.y < target2.y + target2.height &&
			target1.height + target1.y > target2.y
		) {
			return true;
		}
		return false;
	}
	fixRoomsCollisions(attempts = 10) {
		if (attempts <= 0) {
			return;
		}
		for (let i = 0; i < this.rooms.length; i++) {
			for (let j = i + 1; j < this.rooms.length; j++) {
				if (this.isCollided(this.rooms[i], this.rooms[j])) {
					this.rooms[j].findPosition();
					this.fixRoomsCollisions(attempts - 1);
				}
			}
		}
	}

	getRandomRoomSize() {
		// Случайный размер комнаты в пределах допустимых значений.
		return Math.floor();
	}

	getRandomLoot() {
		// Случайное количество лута для комнаты, колеблется вокруг основного параметра.
		const fluctuation = Math.floor(this.lootCount * 0.2); // +/- 20% от общего
		return (
			this.lootCount / this.roomCount +
			(Math.random() * fluctuation - fluctuation / 2)
		);
	}

	placeRooms() {
		this.generateRooms();
		// Логика размещения комнат, с учетом размещения друг относительно друга и стен.
	}

	createEmtyCells() {
		let cells = [];

		for (let y = 0; y < this.width; y++) {
			cells[y] = [];
			for (let x = 0; x < this.height; x++) {
				cells[y][x] = new Cell(x, y);
			}
		}

		// this.cells = cells;
		return cells;
	}

	render(ctx) {
		// this.rooms.forEach((room) => room.render(ctx, this.cellSize));
		// return this.rooms;
		const cells = this.createEmtyCells();
		this.rooms.forEach((room) => {
			// room.calcRoomCells();
			// console.log(room.getRoomCells());
			const roomCells = room.getRoomCells();
			// console.log(roomCells);

			roomCells.forEach((cellRow) => {
				cellRow.forEach((cell) => {
					// console.log(cell);

					cells[cell.y][cell.x] = cell;
				});
			});
		});
		return cells;
	}
}

export default Dungeon;
