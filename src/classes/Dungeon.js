import Room from "./Room.js";
class Dungeon {
    constructor(cellSize, width, height, roomCount, lootCount) {
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
        this.roomCount = roomCount;
        this.lootCount = lootCount;
        this.rooms = [];
        this.loot = [];
    }

    generateRooms() {
        for (let i = 0; i < this.roomCount; i++) {
            const roomWidth = this.getRandomRoomSize();
            const roomHeight = this.getRandomRoomSize();
            const x = Math.floor(Math.random() * (this.width - roomWidth));
            const y = Math.floor(Math.random() * (this.height - roomHeight));

            const loot = this.getRandomLoot();
            const room = new Room(x, y, roomWidth, roomHeight, loot);
            this.rooms.push(room);
        }
    }

    getRandomRoomSize() {
        // Случайный размер комнаты в пределах допустимых значений.
        return Math.floor(Math.random() * (this.cellSize * 2)) + this.cellSize;
    }

    getRandomLoot() {
        // Случайное количество лута для комнаты, колеблется вокруг основного параметра.
        const fluctuation = Math.floor(this.lootCount * 0.2); // +/- 20% от общего
        return this.lootCount / this.roomCount + (Math.random() * fluctuation - fluctuation / 2);
    }

    placeRooms() {
        this.generateRooms();
        // Логика размещения комнат, с учетом размещения друг относительно друга и стен.
    }

    render(ctx) {
        ctx.clearRect(0, 0, this.width * this.cellSize, this.height * this.cellSize);
        this.rooms.forEach((room) => room.render(ctx, this.cellSize));
    }
}

export default Dungeon;
