import React, { useRef, useEffect, useState } from "react";
import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";
import brick1v1 from "../assets/sprites/dungeon/floor/Brick1V1.png";
import Dungeon from "../classes/Dungeon.js";
import { log } from "three/webgpu";

const WIDTH = 64 * 10; // Ширина Canvas
const HEIGHT = 64 * 10; // Высота Canvas
const defSize = 64;

const CanvasComponent = ({ settings }) => {
	const canvasRef = useRef(null);
	const [devMode, setDevMode] = useState(false);
	const [dungeon, setDungeon] = useState(null);
	const [dungeonFloorTiles, setDungeonFloorTiles] = useState([]);
	const WIDTH = defSize * settings.mapSize.x;
	const HEIGHT = defSize * settings.mapSize.y;

	const toggleGameMode = () => {
		setDevMode(!devMode);
	};

	const loadImagesFrom = () => {
		// Загрузка изображений пола
		// brick1, brick2, brick3, brick4
		const images = [brick1, brick2, brick3, brick4];
		const loadedImages = [];

		images.forEach((src, index) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				loadedImages[index] = img;
				if (loadedImages.length === images.length) {
					setDungeonFloorTiles(loadedImages);
				}
			};
		});
	};
	const drawSheet = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.strokeStyle = "red";
		for (let y = 0; y < HEIGHT / defSize; y++) {
			for (let x = 0; x < WIDTH / defSize; x++) {
				ctx.strokeRect(x * defSize, y * defSize, defSize, defSize);
			}
		}
	};

	const renderDefaultCells = () => {
		if (!dungeon || Object.keys(dungeon).length === 0) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		// Очистка Canvas
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// Рендер подземелья
		// dungeon.render(ctx);
		const dungeonCells = dungeon.render();
		// console.log(dungeonCells);

		dungeonCells.forEach((cellRow) => {
			// console.log(cell);

			cellRow.forEach((cell) => {
				if (cell.type === "floor" || cell.type === "room") {
					const img =
						dungeonFloorTiles[
							Math.floor(Math.random() * dungeonFloorTiles.length)
						];
					ctx.drawImage(
						img,
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize,
						defSize,
						defSize
					);
				}
				const wallSize = 4;
				if (cell.mod.includes("wall-left")) {
					ctx.fillStyle = "gray";
					ctx.fillRect(
						cell.x * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
				}
				if (cell.mod.includes("wall-top")) {
					ctx.fillStyle = "gray";
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
				}
				if (cell.mod.includes("wall-right")) {
					ctx.fillStyle = "gray";
					ctx.fillRect(
						(cell.x + 1) * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
				}
				if (cell.mod.includes("wall-bottom")) {
					ctx.fillStyle = "gray";
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						(cell.y + 1) * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
				}
			});
		});
		// dungeonCells.forEach((cellRow) => {
		// 	for (let i = 0; i < cellRow.length; i++) {
		// 		if (cellRow[i].type === "room") {
		// 			if (i == 0) {
		// 				console.log(i);
		// 				ctx.fillStyle = "white";
		// 				ctx.fillRect(
		// 					cellRow[i].x * dungeon.cellSize,
		// 					cellRow[i].y * dungeon.cellSize,
		// 					defSize,
		// 					defSize
		// 				);
		// 			}
		// 		}
		// 	}
		// });
	};

	const getMap = () => {
		// Создание подземелья как эмуляция запроса на сервер
		const { mapSize, mapType, mapTypeSettings } = settings;
		// cellSize, width, height, roomSize, roomCount, lootCoun
		// console.log(mapSize, mapType, mapTypeSettings);

		let newDungeon = {};
		if (mapType === "dungeon") {
			// console.log(mapTypeSettings[mapType])	;

			newDungeon = new Dungeon(
				defSize,
				mapSize.x,
				mapSize.y,
				mapTypeSettings[mapType].roomSize,
				mapTypeSettings[mapType].roomCount,
				mapTypeSettings[mapType].lootCount
			);

			newDungeon.placeRooms();
		}
		setDungeon(newDungeon);
	};

	const renderDungeon = () => {
		getMap();
	};
	useEffect(() => {
		loadImagesFrom();
		// getMap();
		// Загружаем карту при монтировании компонента
	}, []);

	useEffect(() => {
		// Ререндер подземелья при обновлении dungeon
		renderDefaultCells();
	}, [dungeon]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
			}}
		>
			<canvas
				ref={canvasRef}
				width={WIDTH}
				height={HEIGHT}
				style={{ margin: "50px auto", border: "1px solid white" }}
			/>

			<button onClick={renderDungeon}>Rerender</button>

			<button onClick={drawSheet}>Draw Sheet</button>

			<button onClick={toggleGameMode}>Toggle Game Mode</button>
			<button onClick={() => dungeon.rooms[0].findPosition()}>
				test
			</button>
		</div>
	);
};

export default CanvasComponent;
