class Cell {
	constructor(x, y, type = "empty", mod = []) {
		this.x = x; // координаты клетки
		this.y = y;
		this.type = type; // тип клетки ('floor', 'wall', 'door', и т.д.)
		this.mod = mod; // модификатор клетки
	}
	addMod(mod) {
		if (this.mod.includes(mod)) return;
		this.mod.push(mod);
	}
	isCollide(target) {
		return this.x === target.x && this.y === target.y;
	}
	isCollidedList(list) {
		for (let item of list) {
			for (let row of list) {
				for (let cell of row) {
					if (this.x === cell.x && this.y === cell.y) {
						return true;
					}
				}
			}
			return false;
		}
	}

	removeMod(mod) {
		if (!this.mod.includes(mod)) return;
		return this.mod.splice(this.mod.indexOf(mod), 1);
	}
	setType(type) {
		this.type = type;
	}

	getType() {
		return this.type;
	}

	getPosition() {
		return { x: this.x, y: this.y };
	}

	render(ctx) {
		// Устанавливаем цвет в зависимости от типа клетки
		switch (this.type) {
			case "floor":
				ctx.fillStyle = "#CCCCCC"; // светло-серый цвет для пола
				break;
			case "wall":
				ctx.fillStyle = "#333333"; // темно-серый цвет для стены
				break;
			case "door":
				ctx.fillStyle = "#8B4513"; // коричневый цвет для двери
				break;
			default:
				ctx.fillStyle = "#000000"; // черный цвет для неизвестных типов
				break;
		}
		// Отрисовываем квадрат в Canvas
		ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
	}
}
export default Cell;
