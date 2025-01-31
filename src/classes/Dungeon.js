import Room from "./Room.js";
import Cell from "./Cell.js";
import Corridor from "./Corridor.js";
import { log, log2 } from "three/webgpu";
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

		this.clickEvent = false;
	}
	getCell(x, y) {
		return this.cells[y][x];
	}
	findValidPosition(room, maxAttempts = 10) {
		let attempts = maxAttempts;
		while (attempts > 0) {
			room.findPosition();
			if (!this.isCollideList(room, this.rooms)) {
				return true;
			}
			attempts--;
		}
		return false;
	}
	generateRooms() {
		let roomGenerateAttempts = 10;
		while (this.rooms.length < this.roomCount && roomGenerateAttempts > 0) {
			const room = new Room(this.cellSize, this.roomSize, this.lootCount, this.width, this.height);
			room.cutRoom();

			if (!this.findValidPosition(room, 10)) {
				roomGenerateAttempts--;
				continue;
			}

			this.rooms.push(room);
		}
	}
	isCollideList(target, list) {
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
		const closestRooms = this.findClosestRooms();

		closestRooms.forEach((item) => {
			const sliceMod = Math.floor(Math.random() * 10) + 1;

			if (sliceMod === 1) {
				// Создать двери для всех пар ближайших ячеек
				item.closestCells.forEach(([cell1, cell2]) => {
					const newMods = this.removeModsForClosestCells(cell1, cell2);
					this.updateCellMods(item.room1, cell1, newMods[0]);
					this.updateCellMods(item.room2, cell2, newMods[1]);
				});
			} else if (sliceMod >= 2 && sliceMod < 10) {
				// Создать дверь для случайной пары ближайших ячеек
				const rndGroup = Math.floor(Math.random() * item.closestCells.length);
				const [cell1, cell2] = item.closestCells[rndGroup];
				const newMods = this.removeModsForClosestCells(cell1, cell2, true); // true - добавить двери
				this.updateCellMods(item.room1, cell1, newMods[0]);
				this.updateCellMods(item.room2, cell2, newMods[1]);
			}
		});
	}

	// Находит ближайшие комнаты и сохраняет их ячейки
	findClosestRooms() {
		const closestRooms = [];

		for (let r1Indx = 0; r1Indx < this.rooms.length; r1Indx++) {
			const room1 = this.rooms[r1Indx];
			const room1Cells = room1.getRoomCells();

			for (let r2Indx = r1Indx + 1; r2Indx < this.rooms.length; r2Indx++) {
				const room2 = this.rooms[r2Indx];
				const room2Cells = room2.getRoomCells();

				const closestCells = this.findClosestCells(room1Cells, room2Cells);
				if (closestCells.length > 0) {
					closestRooms.push({
						room1: r1Indx,
						room2: r2Indx,
						closestCells,
					});
				}
			}
		}

		return closestRooms;
	}

	// Находит ближайшие пары ячеек между двумя комнатами
	findClosestCells(room1Cells, room2Cells) {
		const closestCells = [];

		room1Cells.forEach((row1) => {
			if (!row1) return;
			row1.forEach((cell1) => {
				room2Cells.forEach((row2) => {
					if (!row2) return;
					row2.forEach((cell2) => {
						if (cell1 && cell2 && this.isCoordClose(cell1, cell2)) {
							closestCells.push([cell1, cell2]);
						}
					});
				});
			});
		});

		return closestCells;
	}

	// Обновляет модификатор ячейки в комнате
	updateCellMods(roomIndex, cell, newMod) {
		this.rooms[roomIndex].cells[cell.y][cell.x].mod = newMod;
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
			return this.addDoors(cell1, removedMods[0], cell2, removedMods[1]); // разобрать почему он перестаёт ставить двери
		}
		return [cell1.mod, cell2.mod];
	}

	addDoors(cell1, mod1, cell2, mod2) {
		if (mod1.includes("wall-top") || mod2.includes("wall-bottom")) {
			cell1.addMod("door-top");
			cell2.addMod("door-bottom");
		}
		if (mod1.includes("wall-bottom") || mod2.includes("wall-top")) {
			cell1.addMod("door-bottom");
			cell2.addMod("door-top");
		}
		if (mod1.includes("wall-left") || mod2.includes("wall-right")) {
			cell1.addMod("door-left");
			cell2.addMod("door-right");
		}
		if (mod1.includes("wall-right") || mod2.includes("wall-left")) {
			cell1.addMod("door-right");
			cell2.addMod("door-left");
		}
		return [cell1.mod, cell2.mod];
	}
	createCorridors() {
		// this.rooms.forEach((room) => {
		const room = this.rooms[0];
		let startCoord = room.getRandomOutermostCell();
		// let endCoord = this.rooms[1];
		let endCoord = rooms[1].getRandomOutermostCell();
		// const newCorridor = new Corridor(startCoord.x, startCoord.y, 40, this.width, this.height, room.id, endCoord.id);
		// newCorridor.moveTo(endCoord.getRandomOutermostCell(), this.rooms);
		// // newCorridor.moveTo(this.rooms[1]);
		// this.corridors.push(newCorridor);
		this.pathFinder(startCoord, endCoord);
		// console.log(room, this.rooms[1]);
		// });
	}
	pathFinder(start, end) {
		const openSet = [];
		const closedSet = new Set();
		const cameFrom = {};
		const gScore = new Map();
		const fScore = new Map();

		openSet.push(start);
		gScore.set(JSON.stringify(start), 0);
		fScore.set(JSON.stringify(start), this.heuristic(start, end));

		while (openSet.length > 0) {
			openSet.sort((a, b) => fScore.get(JSON.stringify(a)) - fScore.get(JSON.stringify(b)));
			const current = openSet.shift();

			if (current.x === end.x && current.y === end.y) {
				return this.reconstructPath(cameFrom, current);
			}

			closedSet.add(JSON.stringify(current));

			const neighbors = this.getNeighbors(current);
			for (const neighbor of neighbors) {
				if (closedSet.has(JSON.stringify(neighbor))) continue;

				const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;

				if (!gScore.has(JSON.stringify(neighbor)) || tentativeGScore < gScore.get(JSON.stringify(neighbor))) {
					cameFrom[JSON.stringify(neighbor)] = current;
					gScore.set(JSON.stringify(neighbor), tentativeGScore);
					fScore.set(JSON.stringify(neighbor), tentativeGScore + this.heuristic(neighbor, end));

					if (!openSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)) {
						openSet.push(neighbor);
					}
				}
			}
		}

		return null; // Путь не найден
	}

	heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	reconstructPath(cameFrom, current) {
		const totalPath = [current];
		while (cameFrom[JSON.stringify(current)]) {
			current = cameFrom[JSON.stringify(current)];
			totalPath.unshift(current);
		}
		return totalPath;
	}

	getNeighbors(node) {
		const directions = [
			{ x: 0, y: -1 }, // Up
			{ x: 0, y: 1 }, // Down
			{ x: -1, y: 0 }, // Left
			{ x: 1, y: 0 }, // Right
		];

		const neighbors = [];
		for (const direction of directions) {
			const neighbor = {
				x: node.x + direction.x,
				y: node.y + direction.y,
			};
			if (
				neighbor.x >= 0 &&
				neighbor.x < this.width &&
				neighbor.y >= 0 &&
				neighbor.y < this.height &&
				this.grid[neighbor.y][neighbor.x] === 0
			) {
				neighbors.push(neighbor);
			}
		}
		return neighbors;
	}
	placeRooms() {
		this.generateRooms();
		this.pathFinder();
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
		this.cells = cells;
		return this.cells;
	}
}

export default Dungeon;
