class Cell {
	constructor(x, y, type = "empty") {
		this.x = x; // координаты клетки
		this.y = y;
		this.type = type; // тип клетки ('floor', 'wall', 'door', и т.д.)
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
		ctx.fillRect(
			this.x * this.size,
			this.y * this.size,
			this.size,
			this.size
		);
	}
}
export default Cell;
