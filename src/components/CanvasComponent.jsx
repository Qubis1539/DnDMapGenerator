import React, { useRef, useEffect, useState } from "react";
import { log } from "three/webgpu";
import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";
import { render } from "react-dom";

class Cell {
	constructor(x, y, typeOfCell) {
		this.x = x;
		this.y = y;
		this.type = typeOfCell;
	}

	toString() {
		return `(${this.x}, ${this.y})`;
	}
}

// class MapGenerator {
// 	constructor(xSize, ySize, defaultCellSize) {
// 		this.cells = [];
// 		this.xSize = xSize;
// 		this.ySize = ySize;
// 		this.defaultCellSize = defaultCellSize;
// 	}
// 	setSize(
// 		xSize = this.xSize,
// 		ySize = this.ySize,
// 		defaultCellSize = this.defaultCellSize
// 	) {
// 		this.xSize = xSize;
// 		this.ySize = ySize;
// 		this.defaultCellSize = defaultCellSize;
// 	}
// 	clearCells() {
// 		this.cells = [];
// 	}
// 	generateDefaultCells() {
// 		for (let y = 0; y < this.xSize; y++) {
// 			this.cells.push([]);
// 			for (let x = 0; x < this.ySize; x++) {
// 				this.cells[y].push(new Cell(y, x, "empty"));
// 			}
// 		}
// 	}
// 	generateFloor() {
// 		const randCentralPoint = {
// 			x: Math.floor(
// 				WIDTH / defaultCellSize / 4 +
// 					(Math.random() * WIDTH) / 2 / defaultCellSize
// 			),
// 			y: Math.floor(
// 				HEIGHT / defaultCellSize / 4 +
// 					(Math.random() * HEIGHT) / 2 / defaultCellSize
// 			),
// 		};
// 		for (let y = 0; y < this.xSize; y++) {
// 			for (let x = 0; x < this.ySize; x++) {
// 				this.cells[y][x].typeOfCell = "wall";
// 			}
// 		}
// 	}
// }

const CanvasComponent = () => {
	const canvasRef = useRef(null);
	const [color, setColor] = useState("black");
	const [cellsData, setCellsData] = useState([]);
	const cellsFill = {
		floor: "#222",
		wall: "#fff",
		empty: "#000",
	};
	const devMode = false;
	const [dungeonFloorTiles, setDungeonFloorTiles] = useState([]);
	const loadImagesFrom = (url = "") => {
		// let img = new Image();
		// img.src = url;
		// return img
		if (dungeonFloorTiles.length != 0) return dungeonFloorTiles;
		// for (let i = 1; i <= 4; i++) {
		// 	let img = new Image();
		// 	img.src = brick1;

		// 	dungeonFloorTiles.push(img);
		// }

		let img1 = new Image();
		img1.src = brick1;

		let img2 = new Image();
		img2.src = brick2;

		let img3 = new Image();
		img3.src = brick3;

		let img4 = new Image();
		img4.src = brick4;

		setDungeonFloorTiles([img1, img2, img3, img4]);
		// console.log(dungeonFloorTiles);
	};

	const WIDTH = 32 * 40;
	const HEIGHT = 32 * 40;

	const defaultCellSize = 32;

	const renderDefaultCells = () => {
		const cells = [];
		for (let y = 0; y < WIDTH / defaultCellSize; y++) {
			cells.push([]);
			for (let x = 0; x < HEIGHT / defaultCellSize; x++) {
				cells[y].push(new Cell(x, y, "empty"));
			}
		}
		// console.log(cells);

		setCellsData(cells);
	};

	const clearCanvas = () => {
		const ctx = canvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	const draw = (ctx) => {
		// Очищаем канвас
		clearCanvas(ctx);

		// Рисуем что-то на канвасе

		drawSheet();
	};
	const generateFloor = () => {
		console.log("generateFloor start");
		const step = 1;
		const endPoint = {
			x: Math.floor(WIDTH / defaultCellSize / 2),
			y: Math.floor(HEIGHT / defaultCellSize / 2),
		};

		const dir = {
			0: "top",
			1: "right",
			2: "bottom",
			3: "left",
		};
		let newCells = [...cellsData];
		for (let i = 0; i < Math.floor((HEIGHT + WIDTH) / 10); i++) {
			// console.log(endPoint);
			// console.log(cellsData);
			// console.log(WIDTH / defaultCellSize);
			// console.log(endPoint);
			const curDir = dir[Math.floor(Math.random() * 4)];

			for (let i = 0; i < 3; i++) {
				newCells[endPoint.y][endPoint.x].type = "floor";
				if (curDir === "top") {
					endPoint.y -= step;
				}
				if (curDir === "bottom") {
					endPoint.y += step;
				}
				if (curDir === "left") {
					endPoint.x -= step;
				}
				if (curDir === "right") {
					endPoint.x += step;
				}

				if (endPoint.x < 0) {
					endPoint.x = 0;
				}
				if (endPoint.y < 0) {
					endPoint.y = 0;
				}
				if (endPoint.x >= WIDTH / defaultCellSize) {
					endPoint.x = WIDTH / defaultCellSize - 1;
					break;
				}
				if (endPoint.y >= HEIGHT / defaultCellSize) {
					endPoint.y = HEIGHT / defaultCellSize - 1;
					break;
				}
			}
		}
		newCells = deleteCrossFloor(newCells);

		newCells = clearSingleFloorTitle(newCells);
		setCellsData(newCells);
		// console.log(newCells);

		console.log("generateFloor end");
	};
	const clearSingleFloorTitle = (cells) => {
		const newCells = [...cells];
		for (let y = 0; y < newCells.length; y++) {
			for (let x = 0; x < newCells[y].length; x++) {
				if (newCells[y][x].type === "floor") {
					try {
						if (
							(newCells[y - 1][x].type === "empty" ||
								newCells[y - 1][x].type === "crossDel") &&
							(newCells[y][x - 1].type === "empty" ||
								newCells[y][x - 1].type === "crossDel") &&
							(newCells[y + 1][x].type === "empty" ||
								newCells[y + 1][x].type === "crossDel") &&
							(newCells[y][x + 1].type === "empty" ||
								newCells[y][x + 1].type === "crossDel")
						) {
							newCells[y][x].type = "singleDel";
						}
					} catch (e) {}
				}
			}
		}

		return newCells;
	};
	const deleteCrossFloor = (cells) => {
		console.log("deleteCrossFloor start");
		const newCells = [...cells];
		for (let y = 0; y < cells.length; y++) {
			for (let x = 0; x < cells[y].length; x++) {
				if (cells[y][x].type === "floor") {
					if (Math.floor(Math.random() * 2) === 0) {
						try {
							if (
								cells[y - 1][x].type === "floor" &&
								cells[y][x - 1].type === "floor" &&
								cells[y + 1][x].type === "floor" &&
								cells[y][x + 1].type === "floor"
							) {
								cells[y][x].type = "crossDel";
								cells[y - 1][x].type = "crossDel";
								cells[y][x - 1].type = "crossDel";
								cells[y + 1][x].type = "crossDel";
								cells[y][x + 1].type = "crossDel";
							}
						} catch (e) {}
					}
				}
			}
		}
		console.log("deleteCrossFloor end");
		return newCells;
	};
	const drawCells = (cellSize = defaultCellSize) => {
		// Очищаем канвас
		console.log("drawCells start");

		const ctx = canvasRef.current.getContext("2d");
		clearCanvas(ctx);
		// console.log("drawCells", cellSize, ctx);
		// Рисуем что-то на канвасе
		for (let y = 0; y < cellsData.length; y++) {
			for (let x = 0; x < cellsData[y].length; x++) {
				console.log(cellsData[y][x].type);

				// tech types

				if (devMode) {
					if (cellsData[y][x].type === "crossDel") {
						const cell = cellsData[y][x];
						ctx.fillStyle = "orange";
						ctx.fillRect(
							cell.x * cellSize,
							cell.y * cellSize,
							cellSize,
							cellSize
						);
					}
					if (cellsData[y][x].type === "singleDel") {
						const cell = cellsData[y][x];
						ctx.fillStyle = "red";
						ctx.fillRect(
							cell.x * cellSize,
							cell.y * cellSize,
							cellSize,
							cellSize
						);
					}
				}
				// -------------

				if (cellsData[y][x].type === "wall") {
					continue;
				}

				if (cellsData[y][x].type === "empty") {
					continue;
				}
				if (cellsData[y][x].type === "floor") {
					let randomTile =
						dungeonFloorTiles[
							Math.floor(Math.random() * dungeonFloorTiles.length)
						];
					console.log(randomTile, dungeonFloorTiles);

					const cell = cellsData[y][x];
					ctx.drawImage(
						randomTile,
						cell.x * cellSize,
						cell.y * cellSize,
						cellSize,
						cellSize
					);
				}

				//
				// ctx.fillStyle = cellsFill[cell.typeOfCell];
				// ctx.fillRect(
				// 	cell.x * cellSize,
				// 	cell.y * cellSize,
				// 	cellSize,
				// 	cellSize
				// );
				// console.log(2);
			}
		}

		console.log("drawCells end");
	};

	const drawSheet = (sheetSize = defaultCellSize) => {
		console.log("drawSheet start");

		const ctx = canvasRef.current.getContext("2d");
		// clearCanvas(ctx);
		// console.log(ctx.canvas.width, sheetSize);

		for (let x = 0; x < ctx.canvas.width / sheetSize; x++) {
			for (let y = 0; y < ctx.canvas.height / sheetSize; y++) {
				ctx.strokeStyle = "#111";
				ctx.lineWidth = 1;
				ctx.strokeRect(
					x * sheetSize,
					y * sheetSize,
					sheetSize,
					sheetSize
				);
			}
		}
	};
	// const
	// const
	const renderMap = () => {
		console.log("renderMap start");
		renderDefaultCells();
		generateFloor();
		drawCells();
		drawSheet();
		console.log("renderMap end");
	};

	const updateCanvas = () => {
		// const canvas = canvasRef.current;
		// if (canvas) {
		// 	const ctx = canvas.getContext("2d");
		// 	// Изменяем цвет при каждой перерисовке
		// 	// setColor(color === "white" ? "red" : "white");
		// 	// draw(ctx);
		// 	renderDefaultCells();
		// }
		ctx.drawImage(dungeonFloorTiles[0], 40, 40, 132, 132);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		renderDefaultCells();
		loadImagesFrom();
		// draw(ctx); // Изначально рисуем на канвасе
		// console.log(dungeonFloorTiles[0]);
		// document.body.appendChild(dungeonFloorTiles[0]);
		// ctx.drawImage(dungeonFloorTiles[0], 40, 40);
		// console.log(dungeonFloorTiles);
	}, []);

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={WIDTH}
				height={HEIGHT}
				style={{ margin: "50px" }}
			/>
			<button onClick={updateCanvas}>Обновить Canvas</button>
			<button onClick={(e) => drawCells()}>Рисовать Cells</button>
			<button onClick={(e) => drawSheet()}>Рисовать Sheet</button>
			<button onClick={(e) => generateFloor()}>
				Генерировать маршруты
			</button>
			<button onClick={(e) => renderMap()}>Рисовать карту</button>
			<button onClick={(e) => renderDefaultCells()}>render</button>
		</div>
	);
};

export default CanvasComponent;
