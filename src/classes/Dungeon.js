import Room from "./Room.js";
import Cell from "./Cell.js";
import { log } from "three/webgpu";
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
		// for (let i = 0; i < this.roomCount; i++)
		// console.log("generateRooms");

		let roomGenerateAttempts = 10;
		while (this.rooms.length < this.roomCount && roomGenerateAttempts > 0) {
			// console.log("roomGenerateAttempts", roomGenerateAttempts);

			// const loot = this.getRandomLoot();
			// cellSize, roomSize, lootCount, dungeonWidth, dungeonHeight
			const room = new Room(
				this.cellSize,
				this.roomSize,
				this.lootCount,
				this.width,
				this.height
			);
			room.cutRoom();
			let attempts = 10;
			// console.log("room", room);
			// console.log("this.rooms", this.rooms);
			// console.log(this.isCollidedList(room, this.rooms));

			while (this.isCollidedList(room, this.rooms) && attempts > 0) {
				// console.log("room is collided find new position");

				room.findPosition();
				attempts--;
			}
			if (attempts <= 0) {
				roomGenerateAttempts--;
				// console.log("room is not added");
				continue;
			}

			this.rooms.push(room);
		}

		// console.log("this.rooms", this.rooms);
		// this.fixRoomsCollisions();
	}
	isCollidedList(target, list) {
		// for (let i = 0; i < list.length; i++) {
		// 	if (this.isCollided(target, list[i])) {
		// 		return true;
		// 	}
		// }
		for (let item of list) {
			if (this.isCollided(target, item)) {
				return true;
			}
		}
		return false;
	}
	isCollided(target1, target2) {
		// console.log("++");

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
	// fixRoomsCollisions(attempts = 10) {
	// 	if (attempts <= 0) {
	// 		return;
	// 	}
	// 	for (let i = 0; i < this.rooms.length; i++) {
	// 		for (let j = i + 1; j < this.rooms.length; j++) {
	// 			if (this.isCollided(this.rooms[i], this.rooms[j])) {
	// 				this.rooms[j].findPosition();
	// 				this.fixRoomsCollisions(attempts - 1);
	// 			}
	// 		}
	// 	}
	// }

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
	isCoordClose(coord1, coord2, distance = 1) {
		if (
			(coord1.x + distance == coord2.x ||
				coord1.x - distance == coord2.x) &&
			coord1.y == coord2.y
		) {
			return true;
		}
		if (
			(coord1.y + distance == coord2.y ||
				coord1.y - distance == coord2.y) &&
			coord1.x == coord2.x
		) {
			return true;
		}

		return false;
	}
	createDoors() {
		for (let i = 0; i < this.rooms.length; i++) {
			const room1 = this.rooms[i];
			const room1Cells = room1.getRoomCells();

			for (let j = i + 1; j < this.rooms.length; j++) {
				const room2 = this.rooms[j];
				const room2Cells = room2.getRoomCells();
				// let minDistance = Infinity;
				// let closestCell1 = null;
				// let closestCell2 = null;
				const closestCells = [];

				for (let rowCell1 of room1Cells) {
					for (let rowCell2 of room2Cells) {
						if (rowCell1 == undefined || rowCell2 == undefined)
							continue;
						for (let cell1 of rowCell1) {
							for (let cell2 of rowCell2) {
								if (cell1 == undefined || cell2 == undefined)
									continue;
								console.log(`cell1: ${cell1.x}, ${cell1.y}`);
								console.log(`cell2: ${cell2.x}, ${cell2.y}`);
								if (this.isCoordClose(cell1, cell2)) {
									closestCells.push([
										cell1,
										cell2,
										room1,
										room2,
									]);
								}
							}
						}
					}
				}

				if (closestCells.length > 0) {
				}

				// if (closestCell1 && closestCell2) {
				// 	closestCells.push([closestCell1, closestCell2]);
				// }
			}
		}

		console.log("closestCells", closestCells);
	}

	placeRooms() {
		this.generateRooms();
		this.createDoors();
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
