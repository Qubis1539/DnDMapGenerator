import React, { useRef, useEffect, useState } from "react";
import brick1 from "../assets/sprites/dungeon/floor/Bricks1.png";
import brick2 from "../assets/sprites/dungeon/floor/Bricks2.png";
import brick3 from "../assets/sprites/dungeon/floor/Bricks3.png";
import brick4 from "../assets/sprites/dungeon/floor/Bricks4.png";
import Dungeon from "../classes/Dungeon.js"; // Предполагаем, что у вас есть класс Dungeon

const WIDTH = 800; // Ширина Canvas
const HEIGHT = 600; // Высота Canvas

const CanvasComponent = () => {
    const canvasRef = useRef(null);
    const [devMode, setDevMode] = useState(false);
    const [dungeon, setDungeon] = useState(null);
    const [dungeonFloorTiles, setDungeonFloorTiles] = useState([]);

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

    const renderDefaultCells = () => {
        if (!dungeon) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Очистка Canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Рендер подземелья
        dungeon.render(ctx);
    };

    const getMap = () => {
        // Создание подземелья как эмуляция запроса на сервер
        const newDungeon = new Dungeon(32, 25, 25, 8, 15);
        newDungeon.placeRooms();
        setDungeon(newDungeon);
    };

    useEffect(() => {
        loadImagesFrom();
        getMap(); // Загружаем карту при монтировании компонента
    }, []);

    useEffect(() => {
        // Ререндер подземелья при обновлении dungeon
        renderDefaultCells();
    }, [dungeon]);

    return (
        <div>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ margin: "50px" }} />

            <button onClick={renderDefaultCells}>Render</button>

            <button onClick={toggleGameMode}>Toggle Game Mode</button>
        </div>
    );
};

export default CanvasComponent;
