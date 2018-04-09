import Tile from 'tile';

export default class Map {
    constructor({ width, height, type }) {
        this.width = width;
        this.height = height;
        this.baseTileType = type;

        this.tiles = [];

        for (let i = 0; i < width * height; i++) {
            const x = i % width;
            const y = Math.floor(i / width);

            const tileOptions = {
                position: { x, y, z: 0 },
                type: this.baseTileType,
                onTileClick: this.onTileClick,
                onTileOver: this.onTileOver,
                onTileOut: this.onTileOut
            };

            this.tiles.push(new Tile(tileOptions));
        }
    }
}
