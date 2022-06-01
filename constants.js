export const ROW_WIDTH = 25; // the number of tiles in a single row, make it an odd number
export const PLAYABLE_WIDTH = 9; // the number of tiles that are actually usable in a single row, make it an odd number

export const MAX_SEED = 32; // used for random generation

export const CHARACTERS = ["Snowman", "Chicken", "Penguin", "Blob", "Dog"]; // names of characters
export const CHARACTER_SCALING = [.75, 1, .5, .75, .55]; // scaling of character models

// percentages add up to 1
export const ROAD_ROW_PERCENT = .6; // percent of rows that are roads
export const GRASS_ROW_PERCENT = .4; // percent of rows that are grass

export const TREE_LEAVES_BASE_HEIGHT = .85; // defines how far up the leaves are on the tree
export const TREE_HEIGHT_MULTIPLIER = .7; // a multiplier that affects tree height
export const TREE_TRUNK_WIDTH = .2; // defines how wide the tree trunk is
export const TREE_LEAVES_WIDTH = .35; // defines how wide the tree leaves are
export const TREE_BOUND_PERCENT = .65; // defines the sparsity of tree generation out of bounds

export const ROCK_WIDTH = .35; // defines how wide a rock is
export const ROCK_HEIGHT = .25; // defines how tall a rock is

export const ROWS_AHEAD = 14; // the number of rows to render ahead of the player, including the current row
export const ROWS_BEHIND = 8; // the number of rows to render behind the player
export const BACKWARDS_LIMIT = 4; // the number of rows backwards the player can move before losing the game

// the obstacles here refer to cars
export const OBSTACLE_WIDTH = 2; // the length of an obstacle on the road
export const MIN_OBSTACLE_SPACING = 3; // the minimum distance between obstacles
export const MIN_OBSTACLE_SPEED = .8; // the minimum speed of an obstacle
export const MAX_OBSTACLE_SPEED = 2; // the minimum speed of an obstacle
export const COLLISION_LEEWAY = .2; // amount of leeway allowed before a collision is registered

// blockers are rocks and trees
export const BLOCKER_SPAWN_ALGORITHM_STEEPNESS = 3; // the higher the number, the more likely a row is to have less blockers
export const BLOCKER_MAX_ROW_PERCENTAGE = .5; // the maximum possible percentage of tiles in a row that are occupied by blockers

export const CAR_COLORS = ["#FFFFFF", "#72B01D", "#EB4397", "#60B2E5", "#EE9866", "#FCD581", "#81889A", "#FF6663", "#4F86C6", "#F08A4B"];
export const CAR_PALETTES = [
    ["#AF2BBF","#A14EBF","#6C91BF","#5FB0B7","#5BC8AF"], // orchid to teal
    ["#DDD78D","#DCBF85","#8B635C","#60594D","#93A29B"], // yellow, brown, gray
    ["#181F1C","#274029","#315C2B","#60712F","#9EA93F"], // dark green to olive
    ["#D3F8E2","#E4C1F9","#F694C1","#EDE7B1","#A9DEF9"], // pastels
    ["#98C1D9","#6969B3","#533A7B","#4B244A","#25171A"], // light blue, purple, raisin
    ["#E0E2DB","#D2D4C8","#B8BDB5","#889696","#5F7470"], // alabaster to gray
    ["#DB5461","#686963","#8AA29E","#3D5467","#F1EDEE"], // soft reds and blues
    ["#7B4B94","#7D82B8","#B7E3CC","#C4FFB2","#D6F7A3"], // purple to lime
    ["#F7D1CD","#E8C2CA","#D1B3C4","#B392AC","#735D78"], // peach to lavender
    ["#FABC3C","#FFB238","#F19143","#FF773D","#F55536"], // fire
    ["#114B5F","#456990","#E4FDE1","#F45B69","#6B2737"], // navy, tan, wine
    ["#FFA69E","#FAF3DD","#B8F2E6","#AED9E0","#5E6472"], // salmon to gray
    ["#BBE5ED","#BFBCCB","#B399A2","#986C6A","#784F41"], // copper
    ["#84DCC6","#A5FFD6","#FFFFFF","#FFA69E","#FF686B"], // watermelon
    ["#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"], // all white
    //["#","#","#","#","#"],
]
export const CAR_BODY_WIDTH = .35; // the width of the car
export const CAR_BODY_HEIGHT = .2; // the height of the car's body
export const CAR_TOP_HEIGHT = .15; // the height of the car's top
export const WHEEL_DIAMETER = .15; // the diameter of the wheel
export const WHEEL_WIDTH = .1; // the width of a wheel
export const WHEEL_OFFSET = .6; // the distance the wheel is from the front/back of the car

export const CAMERA_PERSPECTIVE = "crossy" // "crossy": diagonal camera, "flat": straight down view
export const CAMERA_SMOOTHING = .025; // smoothing for camera movement, smaller means more smoothing

export const JUMP_TIME = 0.4;