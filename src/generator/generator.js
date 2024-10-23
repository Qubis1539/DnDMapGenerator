const mapSizeX = 10;
const mapSizeY = 30;
const renderedMap = [];

const generateMap = () => {
    for (let i = 0; i < mapSizeX; i++) {
        renderedMap.push([]);
        for (let j = 0; j < mapSizeY; j++) {
            renderedMap[i].push(0);
        }
    }
    return renderedMap;
};

const generateProceduralMap = (xSize, ySize) => {
    const map = [];
    for (let x = 0; x < xSize; x++) {
        map.push([]);
        for (let y = 0; y < ySize; y++) {
            const random = Math.random();
            if (random < 0.3) {
                map[x][y] = 1; // wall
            } else if (random < 0.6) {
                map[x][y] = 2; // floor
            } else {
                map[x][y] = 0; // empty
            }
        }
    }
    return map;
};

const printMap = (map) => {
    const symbols = {
        0: "_", // empty
        1: "#", // wall
        2: "O", // floor
    };
    for (let i = 0; i < map.length; i++) {
        let row = "";
        for (let j = 0; j < map[i].length; j++) {
            row += symbols[map[i][j]];
        }
        console.log(row);
    }
};
printMap(generateProceduralMap(mapSizeX, mapSizeY));
