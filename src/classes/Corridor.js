import Cell from "./Cell.js";
class Corridor {
	constructor(startX, startY, maxSteps, dungeonWidth, dungeonHeight) {
		this.cells = [];
		this.startX = startX;
		this.startY = startY;
		this.maxSteps = maxSteps;
		this.dungeonWidth = dungeonWidth;
		this.dungeonHeight = dungeonHeight;
	}
	isInBounds(x, y) {
		return x >= 0 && x < this.dungeonWidth && y >= 0 && y < this.dungeonHeight;
	}
	moveTo(coords) {
		this.cells = [];
		let sX = this.startX;
		let sY = this.startY;
		let eX = coords.x;
		let eY = coords.y;

		while (sX !== eX || sY !== eY) {
			this.cells.push(new Cell(sX, sY, "floor"));

			if (sX < eX) {
				sX++;
			} else if (sX > eX) {
				sX--;
			} else if (sY < eY) {
				sY++;
			} else if (sY > eY) {
				sY--;
			}
		}
		this.cells.push(new Cell(sX, sY, "floor"));
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
