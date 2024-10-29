import Room from "./Room.js";
import Cell from "./Cell.js";
import Corridor from "./Corridor.js";
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
		this.corridors = [];
	}

	generateRooms() {
		let roomGenerateAttempts = 10;
		while (this.rooms.length < this.roomCount && roomGenerateAttempts > 0) {
			const room = new Room(this.cellSize, this.roomSize, this.lootCount, this.width, this.height);
			room.cutRoom();
			let attempts = 10;

			while (this.isCollidedList(room, this.rooms) && attempts > 0) {
				room.findPosition();
				attempts--;
			}
			if (attempts <= 0) {
				roomGenerateAttempts--;
				continue;
			}

			this.rooms.push(room);
		}
	}
	isCollidedList(target, list) {
		for (let item of list) {
			if (this.isCollided(target, item)) {
				return true;
			}
		}
		return false;
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
	getRandomRoomSize() {
		// Случайный размер комнаты в пределах допустимых значений.
		return Math.floor();
	}

	getRandomLoot() {
		// Случайное количество лута для комнаты, колеблется вокруг основного параметра.
		const fluctuation = Math.floor(this.lootCount * 0.2); // +/- 20% от общего
		return this.lootCount / this.roomCount + (Math.random() * fluctuation - fluctuation / 2);
	}
	isCoordClose(coord1, coord2, distance = 1) {
		// console.log("isCoordClose", coord1, coord2, distance);
		if ((coord1.x + distance == coord2.x || coord1.x - distance == coord2.x) && coord1.y == coord2.y) {
			return true;
		}
		if ((coord1.y + distance == coord2.y || coord1.y - distance == coord2.y) && coord1.x == coord2.x) {
			return true;
		}

		return false;
	}
	createDoors() {
		const closestRooms = [];
		for (let r1Indx = 0; r1Indx < this.rooms.length; r1Indx++) {
			const room1 = this.rooms[r1Indx];
			const room1Cells = room1.getRoomCells();

			for (let r2Indx = r1Indx + 1; r2Indx < this.rooms.length; r2Indx++) {
				const room2 = this.rooms[r2Indx];
				const room2Cells = room2.getRoomCells();
				// console.log(room1Cells);
				let closestCells = [];
				for (let r1cY = 0; r1cY < room1Cells.length; r1cY++) {
					if (room1Cells[r1cY] == undefined) {
						continue;
					}
					for (let r1cX = 0; r1cX < room1Cells[r1cY].length; r1cX++) {
						for (let r2cY = 0; r2cY < room2Cells.length; r2cY++) {
							if (room2Cells[r2cY] == undefined) {
								continue;
							}
							for (let r2cX = 0; r2cX < room2Cells[r2cY].length; r2cX++) {
								if (
									room1Cells[r1cY][r1cX] !== undefined &&
									room2Cells[r2cY][r2cX] !== undefined &&
									this.isCoordClose(room1Cells[r1cY][r1cX], room2Cells[r2cY][r2cX])
								) {
									closestCells.push([room1Cells[r1cY][r1cX], room2Cells[r2cY][r2cX]]);
								}
							}
						}
					}
				}
				if (closestCells.length > 0) {
					closestRooms.push({
						room1: r1Indx,
						room2: r2Indx,
						closestCells: closestCells,
					});
				}
			}
		}
		// console.log(this.rooms);
		for (let item of closestRooms) {
			// console.log(item);

			let sliceMod = Math.floor(Math.random() * 10) + 1;
			if (sliceMod === 1) {
				for (let i = 0; i < item.closestCells.length; i++) {
					const newMods = this.removeModsForClosestCells(item.closestCells[i][0], item.closestCells[i][1]);
					this.rooms[item.room1].cells[item.closestCells[i][0].y][item.closestCells[i][0].x].mod = newMods[0];
					this.rooms[item.room2].cells[item.closestCells[i][1].y][item.closestCells[i][1].x].mod = newMods[1];
				}
			} else if (sliceMod === 10) {
				continue;
			} else if (sliceMod >= 2) {
				let rndGroup = Math.floor(Math.random() * item.closestCells.length);
				const newMods = this.removeModsForClosestCells(
					item.closestCells[rndGroup][0],
					item.closestCells[rndGroup][1],
					true
				);
				this.rooms[item.room1].cells[item.closestCells[rndGroup][0].y][item.closestCells[rndGroup][0].x].mod =
					newMods[0];
				this.rooms[item.room2].cells[item.closestCells[rndGroup][1].y][item.closestCells[rndGroup][1].x].mod =
					newMods[1];
			}
		}
		// console.log("closestCells", closestCells);
	}
	removeModsForClosestCells(cell1, cell2, addDoors = false) {
		// console.log(cell1.mod, cell2.mod);
		let removedMods = [];

		if (cell1.mod.includes("wall-top") && cell2.mod.includes("wall-bottom") && cell1.x === cell2.x) {
			removedMods[0] = cell1.removeMod("wall-top");
			removedMods[1] = cell2.removeMod("wall-bottom");
		}

		if (cell1.mod.includes("wall-bottom") && cell2.mod.includes("wall-top") && cell1.x === cell2.x) {
			removedMods[0] = cell1.removeMod("wall-bottom");
			removedMods[1] = cell2.removeMod("wall-top");
		}

		if (cell1.mod.includes("wall-left") && cell2.mod.includes("wall-right") && cell1.y === cell2.y) {
			removedMods[0] = cell1.removeMod("wall-left");
			removedMods[1] = cell2.removeMod("wall-right");
		}

		if (cell1.mod.includes("wall-right") && cell2.mod.includes("wall-left") && cell1.y === cell2.y) {
			removedMods[0] = cell1.removeMod("wall-right");
			removedMods[1] = cell2.removeMod("wall-left");
		}
		// console.log(cell1.mod, cell2.mod);
		if (addDoors) {
			return this.addDoors(cell1, removedMods[0], cell2, removedMods[1]);
		}
		return [cell1.mod, cell2.mod];
	}
	addDoors(cell1, mod1, cell2, mod2) {
		if (mod1.includes("wall-top") && mod2.includes("wall-bottom")) {
			cell1.mod.push("door-top");
			cell2.mod.push("door-bottom");
		}
		if (mod1.includes("wall-bottom") && mod2.includes("wall-top")) {
			cell1.mod.push("door-bottom");
			cell2.mod.push("door-top");
		}
		if (mod1.includes("wall-left") && mod2.includes("wall-right")) {
			cell1.mod.push("door-left");
			cell2.mod.push("door-right");
		}
		if (mod1.includes("wall-right") && mod2.includes("wall-left")) {
			cell1.mod.push("door-right");
			cell2.mod.push("door-left");
		}
		return [cell1.mod, cell2.mod];
	}
	createCorridors() {
		this.rooms.forEach((room) => {
			let startCoord = room.getRandomOutermostCell();
			const newCorridor = new Corridor(startCoord.x, startCoord.y, 10, this.width, this.height);
			newCorridor.moveTo(this.rooms[Math.floor(Math.random() * this.rooms.length)].getRandomOutermostCell());
			this.corridors.push(newCorridor);
		});
	}
	placeRooms() {
		this.generateRooms();
		this.createDoors();
		this.createCorridors();
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
		this.corridors.forEach((corridor) => {
			corridor.cells.forEach((cell) => {
				cells[cell.y][cell.x] = cell;
			});
		});
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
