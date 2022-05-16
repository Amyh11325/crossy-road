import { Field } from "./field.js"
import { Player } from "./player.js";

export class Game {
    constructor() {
        this.row_num = 0;
        this.score = 0
        this.field = new Field();
        this.player = new Player();
    }
}