

export type SpreadSheetTileCoord = {x:number; y:number};

export const TileMap: Record<string, SpreadSheetTileCoord> = {
    dirt: {x:0, y:0}
};

const sprites = import.meta.glob("src\assets\textures\Spritesheet\Sprite-Sheet.png")




