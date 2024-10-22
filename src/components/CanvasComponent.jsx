import React, { useRef, useEffect, useState } from "react";
import { log } from "three/webgpu";
import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";

const CanvasComponent = () => {
	const canvasRef = useRef(null);
	const [color, setColor] = useState("black");
	const [cellsData, setCellsData] = useState([]);
	const cellsFill = {
		floor: "#222",
		wall: "#fff",
		empty: "#000",
	};
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
		console.log(dungeonFloorTiles);
	};

	const WIDTH = 640;
	const HEIGHT = 640;

	const defaultCellSize = 64;

	const renderDefaultCells = () => {
		const cells = [];
		for (let i = 0; i < WIDTH / defaultCellSize; i++) {
			cells.push([]);
			for (let j = 0; j < HEIGHT / defaultCellSize; j++) {
				cells[i].push({ x: i, y: j, typeOfCell: "floor" });
			}
		}
		setCellsData(cells);
	};

	const clearCanvas = () => {
		// const ctx = canvasRef.current.getContext("2d");
		// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// ctx.fillStyle = color;
		// ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	const draw = (ctx) => {
		// Очищаем канвас
		clearCanvas(ctx);

		// Рисуем что-то на канвасе

		drawSheet();
	};

	const drawCells = (cellSize = defaultCellSize) => {
		// Очищаем канвас

		const ctx = canvasRef.current.getContext("2d");
		clearCanvas(ctx);
		// console.log("drawCells", cellSize, ctx);
		// Рисуем что-то на канвасе
		for (let i = 0; i < cellsData.length; i++) {
			for (let j = 0; j < cellsData[i].length; j++) {
				let randomTile =
					dungeonFloorTiles[
						Math.floor(Math.random() * dungeonFloorTiles.length)
					];
				console.log(randomTile, dungeonFloorTiles);

				const cell = cellsData[i][j];
				let img = new Image();
				img.src = brick1;
				ctx.drawImage(
					randomTile,
					cell.x * cellSize,
					cell.y * cellSize,
					cellSize,
					cellSize
				);
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
	};

	const drawSheet = (sheetSize = defaultCellSize) => {
		console.log("drawSheet");

		const ctx = canvasRef.current.getContext("2d");
		clearCanvas(ctx);
		console.log(ctx.canvas.width, sheetSize);

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
				console.log(1);
			}
		}
	};
	// const
	// const

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
		console.log(dungeonFloorTiles);
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
			<button onClick={(e) => renderDefaultCells()}>render</button>
		</div>
	);
};

export default CanvasComponent;
