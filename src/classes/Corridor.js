import Cell from "./Cell.js";
class Corridor {
	constructor(startX, startY, maxSteps, dungeonWidth, dungeonHeight, room1ID, room2ID) {
		this.cells = [];
		this.startX = startX;
		this.startY = startY;
		this.endX = startX;
		this.endY = startY;
		this.maxSteps = maxSteps;
		this.dungeonWidth = dungeonWidth;
		this.dungeonHeight = dungeonHeight;
		this.room1ID = room1ID;
		this.room2ID = room2ID;
	}
	isInBounds(x, y) {
		return x >= 0 && x < this.dungeonWidth && y >= 0 && y < this.dungeonHeight;
	}
	moveTo2(coords, rooms) {
		let attempts = 50;
		this.endX = coords.x;
		this.endY = coords.y;
		let sX = this.startX;
		let sY = this.startY;
		let eX = coords.x;
		let eY = coords.y;
		while (attempts > 0) {
			this.cells = [];

			let lastAction = {
				x: 0,
				y: 0,
			};
			attempts--;
			while (sX !== eX || sY !== eY) {
				const newCell = new Cell(sX, sY, "floor");
				let action = {
					x: 0,
					y: 0,
				};
				let cellMod = [];
				let dirVert = Math.random() < 0.5;
				if (dirVert) {
					if (newCell.y < eY) {
						newCell.y++;
						action.y++;
					} else if (newCell.y > eY) {
						newCell.y--;
						action.y--;
					}
					if (newCell.isCollidedList(rooms)) {
						newCell.y = newCell.y - action.y;
						continue;
					}
				} else {
					if (newCell.x < eX) {
						newCell.x++;
						action.x++;
					} else if (newCell.x > eX) {
						newCell.x--;
						action.x--;
					}
					if (newCell.isCollidedList(rooms)) {
						newCell.x = newCell.x - action.x;
						continue;
					}
				}

				lastAction.x = action.x;
				lastAction.y = action.y;
			}
		}
	}
	moveTo(coords, rooms) {
		this.endX = coords.x;
		this.endY = coords.y;
		this.cells = [];
		let sX = this.startX;
		let sY = this.startY;

		let eX = coords.x;
		let eY = coords.y;

		let lastAction = {
			x: 0,
			y: 0,
		};
		let attempts = 50;
		while ((sX !== eX || sY !== eY) && attempts > 0) {
			attempts--;
			// this.cells.push(new Cell(sX, sY, "floor"));
			let action = {
				x: 0,
				y: 0,
			};
			let cellMod = [];

			if (sX < eX) {
				sX++;
				cellMod.push("wall-top", "wall-bottom", "r");
				action.x = 1;
			} else if (sX > eX) {
				sX--;
				cellMod.push("wall-top", "wall-bottom", "l");
				action.x = -1;
			} else if (sY < eY) {
				sY++;
				cellMod.push("wall-left", "wall-right", "d");
				action.y = 1;
			} else if (sY > eY) {
				sY--;
				cellMod.push("wall-left", "wall-right", "u");
				action.y = -1;
			}
			if (this.cells.length > 0) {
				if (this.cells.at(-1).mod.includes("wall-top")) {
					if (action.x === 0 && action.y === 1) {
						if (lastAction.x === 1 && lastAction.y === 0) {
							this.cells.at(-1).addMod("wall-right");
							this.cells.at(-1).removeMod("wall-bottom");
						} else if (lastAction.x === -1 && lastAction.y === 0) {
							this.cells.at(-1).addMod("wall-left");
							this.cells.at(-1).removeMod("wall-bottom");
						}
					}
					if (action.x === 0 && action.y === -1) {
						if (lastAction.x === 1 && lastAction.y === 0) {
							this.cells.at(-1).addMod("wall-right");
							this.cells.at(-1).removeMod("wall-top");
						} else if (lastAction.x === -1 && lastAction.y === 0) {
							this.cells.at(-1).addMod("wall-left");
							this.cells.at(-1).removeMod("wall-top");
						}
					}
				} else if (this.cells.at(-1).mod.includes("wall-left")) {
					if (action.x === 1 && action.y === 0) {
						if (lastAction.x === 0 && lastAction.y === 1) {
							this.cells.at(-1).addMod("wall-bottom");
							this.cells.at(-1).removeMod("wall-left");
						} else if (lastAction.x === 0 && lastAction.y === -1) {
							this.cells.at(-1).addMod("wall-top");
							this.cells.at(-1).removeMod("wall-left");
						}
					}
					if (action.x === -1 && action.y === 0) {
						if (lastAction.x === 0 && lastAction.y === 1) {
							this.cells.at(-1).addMod("wall-top");
							this.cells.at(-1).removeMod("wall-right");
						} else if (lastAction.x === 0 && lastAction.y === -1) {
							this.cells.at(-1).addMod("wall-bottom");
							this.cells.at(-1).removeMod("wall-right");
						}
					}
				}
			}
			const newCell = new Cell(sX, sY, "corridor", cellMod);
			this.cells.push(newCell);

			lastAction.x = action.x;
			lastAction.y = action.y;
		}
	}
	rundomWalk() {
		this.cells = [];
		let x = this.startX;
		let y = this.startY;
		let steps = 0;
		while (steps <= this.maxSteps) {
			let direction = Math.floor(Math.random() * 4);
			this.cells.push(new Cell(x, y, "floor"));

			switch (direction) {
				case 0:
					if (this.isInBounds(x, y - 1)) {
						y--;
					}
					break;
				case 1:
					if (this.isInBounds(x + 1, y)) {
						x++;
					}
					break;
				case 2:
					if (this.isInBounds(x, y + 1)) {
						y++;
					}
					break;
				case 3:
					if (this.isInBounds(x - 1, y)) {
						x--;
					}
					break;
			}
			steps++;
		}

		return this.cells;
	}
}

export default Corridor;
