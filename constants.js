export const ROW_WIDTH = 25; // the number of tiles in a single row, make it an odd number
export const PLAYABLE_WIDTH = 9; // the number of tiles that are actually usable in a single row, make it an odd number

// percentages add up to 1
export const ROAD_ROW_PERCENT = .6; // percent of rows that are roads
export const GRASS_ROW_PERCENT = .4; // percent of rows that are grass

export const ROWS_AHEAD = 14; // the number of rows to render ahead of the player, including the current row
export const ROWS_BEHIND = 8; // the number of rows to render behind the player
export const BACKWARDS_LIMIT = 4; // the number of rows backwards the player can move before losing the game

export const OBSTACLE_WIDTH = 2; // the length of an obstacle on the road
export const MIN_OBSTACLE_SPACING = 3; // the minimum distance between obstacles
export const MIN_OBSTACLE_SPEED = .6; // the minimum speed of an obstacle
export const MAX_OBSTACLE_SPEED = 1.8; // the minimum speed of an obstacle
export const COLLISION_LEEWAY = .2; // amount of leeway allowed before a collision is registered

export const CAMERA_PERSPECTIVE = "crossy" // "crossy": diagonal camera, "flat": straight down view
export const CAMERA_SMOOTHING = .025; // smoothing for camera movement, smaller means more smoothing