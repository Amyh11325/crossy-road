import { Field } from "./field.js"
import { Player } from "./player.js";
import * as Constants from "./constants.js"

export class Game {
    constructor() {
        this.row_num = 0;
        this.score = 0
        this.palette = Constants.CAR_PALETTES[Math.floor(Math.random() * Constants.CAR_PALETTES.length)];
        this.field = new Field(this.palette);
        this.player = new Player();
    }
}