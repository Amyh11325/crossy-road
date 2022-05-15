export const ROW_WIDTH = 25; // the number of tiles in a single row, make it an odd number
export const PLAYABLE_WIDTH = 9; // the number of tiles that are actually usable in a single row, make it an odd number

// percentages add up to 1
export const ROAD_ROW_PERCENT = .65; // percent of rows that are roads
export const GRASS_ROW_PERCENT = .35; //percent of rows that are grass

export const ROWS_AHEAD = 14; // the number of rows to render ahead of the player, including the current row
export const ROWS_BEHIND = 6; // the number of rows to render behind the player
export const BACKWARDS_LIMIT = 4; // the number of rows backwards the player can move before losing the game

export const CAMERA_PERSPECTIVE = "crossy" // "crossy": diagonal camera, "flat": straight down view