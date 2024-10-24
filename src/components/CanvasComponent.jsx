import React, { useRef, useEffect, useState } from "react";
import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";
import Dungeon from "../classes/Dungeon.js";
import { log } from "three/webgpu";

const WIDTH = 800; // Ширина Canvas
const HEIGHT = 600; // Высота Canvas

const CanvasComponent = ({ settings }) => {
	const canvasRef = useRef(null);
	const [devMode, setDevMode] = useState(false);
	const [dungeon, setDungeon] = useState(null);
	const [dungeonFloorTiles, setDungeonFloorTiles] = useState([]);
	const [WIDTH, setWIDTH] = useState(32 * 32);
	const [HEIGHT, setHEIGHT] = useState(32 * 32);

	const toggleGameMode = () => {
		setDevMode(!devMode);
	};

	const loadImagesFrom = () => {
		// Загрузка изображений пола
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
		for (let y = 0; y < HEIGHT / 32; y++) {
			for (let x = 0; x < WIDTH / 32; x++) {
				ctx.strokeRect(x * 32, y * 32, 32, 32);
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
				if (cell.type === "floor") {
					const img =
						dungeonFloorTiles[Math.floor(Math.random() * 4)];
					ctx.drawImage(
						img,
						cell.x * dungeon.cellSize,
						cell.y * dungeon.cellSize,
						32,
						32
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
				32,
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
		<div>
			<canvas
				ref={canvasRef}
				width={WIDTH}
				height={HEIGHT}
				style={{ margin: "50px" }}
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
