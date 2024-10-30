import React, { useRef, useEffect, useState } from "react";
// import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
// import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
// import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
// import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";
import floor1 from "../assets/sprites/dungeon/floor/floor1.png";
import floor2 from "../assets/sprites/dungeon/floor/floor2.png";
import floor3 from "../assets/sprites/dungeon/floor/floor3.png";
import floorTile1 from "../assets/sprites/dungeon/floor/floorTile1.png";
import floorTile2 from "../assets/sprites/dungeon/floor/floorTile2.png";
import floorTile3 from "../assets/sprites/dungeon/floor/floorTile3.png";
import floorTile4 from "../assets/sprites/dungeon/floor/floorTile4.png";
import floorTile5 from "../assets/sprites/dungeon/floor/floorTile5.png";
import floorTile6 from "../assets/sprites/dungeon/floor/floorTile6.png";
import floorTile7 from "../assets/sprites/dungeon/floor/floorTile7.png";
import floorTile8 from "../assets/sprites/dungeon/floor/floorTile8.png";
import floorTile9 from "../assets/sprites/dungeon/floor/floorTile9.png";
import floorTile10 from "../assets/sprites/dungeon/floor/floorTile10.png";
import floorTile11 from "../assets/sprites/dungeon/floor/floorTile11.png";
import floorTile12 from "../assets/sprites/dungeon/floor/floorTile12.png";
import floorTile13 from "../assets/sprites/dungeon/floor/floorTile13.png";
import floorTile14 from "../assets/sprites/dungeon/floor/floorTile14.png";
import floorTile15 from "../assets/sprites/dungeon/floor/floorTile15.png";
import floorTile16 from "../assets/sprites/dungeon/floor/floorTile16.png";
import floorTile17 from "../assets/sprites/dungeon/floor/floorTile17.png";
import floorTile18 from "../assets/sprites/dungeon/floor/floorTile18.png";
// import floorTile19 from "../assets/sprites/dungeon/floor/floorTile19.png";

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
		const images = [
			// floor1,
			// floor2,
			// floor3,
			// floorTile7,
			// floorTile8,
			// floorTile9,
			// ---------------
			floorTile10,
			floorTile11,
			floorTile12,
			floorTile13,
			floorTile14,
			floorTile15,
			floorTile16,
			floorTile17,
			floorTile18,
		];
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
		ctx.lineWidth = 1;
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

		// settings
		const wallSize = 16;
		const cornerScale = 1.5;
		const wallBorderSize = 3;
		const wallColor = "#444444";
		const wallBorderColor = "#111111";
		const cornerBorderSize = 7;
		const doorColor = "#291700";
		// Очистка Canvas
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// Рендер подземелья
		const dungeonCells = dungeon.render();

		// Рендер пола
		dungeonCells.forEach((cellRow) => {
			// console.log(cell);

			cellRow.forEach((cell) => {
				if (cell.type === "floor" || cell.type === "room" || cell.type === "corridor") {
					const img = dungeonFloorTiles[Math.floor(Math.random() * dungeonFloorTiles.length)];
					// let ang = Math.floor(Math.random() * 2);
					// ctx.rotate(ang * (Math.PI / 2));
					// console.log(ang);
					ctx.drawImage(
						img,
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize,
						dungeon.cellSize,
						dungeon.cellSize
					);
				}

				// walls ----------------------------------------------

				// end ------------------------------------------------------
			});
		});
		// Рендер дверей
		dungeonCells.forEach((cellRow) => {
			cellRow.forEach((cell) => {
				// doors -------------------------------------------------
				if (cell.mod.includes("door-top")) {
					ctx.fillStyle = doorColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
				}
				if (cell.mod.includes("door-bottom")) {
					ctx.fillStyle = doorColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						(cell.y + 1) * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
				}
				if (cell.mod.includes("door-left")) {
					ctx.fillStyle = doorColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
				}
				if (cell.mod.includes("door-right")) {
					ctx.fillStyle = doorColor;
					ctx.fillRect(
						(cell.x + 1) * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
				}
			});
		});
		// Рендер стен
		dungeonCells.forEach((cellRow) => {
			cellRow.forEach((cell) => {
				if (cell.mod.includes("wall-left")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
					for (let i = 0; i < 2; i++) {
						ctx.strokeStyle = wallBorderColor;
						ctx.lineWidth = wallBorderSize;
						ctx.strokeRect(
							cell.x * dungeon.cellSize - wallSize / 2,
							cell.y * dungeon.cellSize + (dungeon.cellSize * i) / 2,
							wallSize,
							dungeon.cellSize / 2
						);
					}
				}
				if (cell.mod.includes("wall-top")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
					for (let i = 0; i < 2; i++) {
						ctx.strokeStyle = wallBorderColor;
						ctx.lineWidth = wallBorderSize;
						ctx.strokeRect(
							cell.x * dungeon.cellSize + (dungeon.cellSize * i) / 2,
							cell.y * dungeon.cellSize - wallSize / 2,
							dungeon.cellSize / 2,
							wallSize
						);
					}
				}
				if (cell.mod.includes("wall-right")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						(cell.x + 1) * dungeon.cellSize - wallSize / 2,
						cell.y * dungeon.cellSize,
						wallSize,
						dungeon.cellSize
					);
					for (let i = 0; i < 2; i++) {
						ctx.strokeStyle = wallBorderColor;
						ctx.lineWidth = wallBorderSize;
						ctx.strokeRect(
							(cell.x + 1) * dungeon.cellSize - wallSize / 2,
							cell.y * dungeon.cellSize + (dungeon.cellSize * i) / 2,
							wallSize,
							dungeon.cellSize / 2
						);
					}
				}
				if (cell.mod.includes("wall-bottom")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize,
						(cell.y + 1) * dungeon.cellSize - wallSize / 2,
						dungeon.cellSize,
						wallSize
					);
					for (let i = 0; i < 2; i++) {
						ctx.strokeStyle = wallBorderColor;
						ctx.lineWidth = wallBorderSize;
						ctx.strokeRect(
							cell.x * dungeon.cellSize + (dungeon.cellSize * i) / 2,
							(cell.y + 1) * dungeon.cellSize - wallSize / 2,
							dungeon.cellSize / 2,
							wallSize
						);
					}
				}
			});
		});
		// Рендер углов
		dungeonCells.forEach((cellRow) => {
			cellRow.forEach((cell) => {
				if (cell.mod.includes("wall-top") && cell.mod.includes("wall-left")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize - (wallSize * cornerScale) / 2,
						cell.y * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
					ctx.strokeStyle = wallBorderColor;
					ctx.lineWidth = cornerBorderSize;
					ctx.strokeRect(
						cell.x * dungeon.cellSize - (wallSize * cornerScale) / 2,
						cell.y * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
				}

				if (cell.mod.includes("wall-top") && cell.mod.includes("wall-right")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						(cell.x + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						cell.y * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
					ctx.strokeStyle = wallBorderColor;
					ctx.lineWidth = cornerBorderSize;
					ctx.strokeRect(
						(cell.x + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						cell.y * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
				}

				if (cell.mod.includes("wall-bottom") && cell.mod.includes("wall-left")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						cell.x * dungeon.cellSize - (wallSize * cornerScale) / 2,
						(cell.y + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
					ctx.strokeStyle = wallBorderColor;
					ctx.lineWidth = cornerBorderSize;
					ctx.strokeRect(
						cell.x * dungeon.cellSize - (wallSize * cornerScale) / 2,
						(cell.y + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
				}

				if (cell.mod.includes("wall-bottom") && cell.mod.includes("wall-right")) {
					ctx.fillStyle = wallColor;
					ctx.fillRect(
						(cell.x + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						(cell.y + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
					ctx.strokeStyle = wallBorderColor;
					ctx.lineWidth = cornerBorderSize;
					ctx.strokeRect(
						(cell.x + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						(cell.y + 1) * dungeon.cellSize - (wallSize * cornerScale) / 2,
						wallSize * cornerScale,
						wallSize * cornerScale
					);
				}
			});
		});
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
			<button onClick={() => dungeon.rooms[0].findPosition()}>test</button>
		</div>
	);
};

export default CanvasComponent;
