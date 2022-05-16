import * as Constants from "./constants.js"

export class Player {
    constructor() {
        this.row_num = 0;
        this.index = Math.ceil(Constants.ROW_WIDTH / 2);
        this.forward = [1, 0, 0];
        this.jump = false;
        this.jump_start_time = -1;
        this.player_transform = [0, 0, this.index];
        this.player_rotation = 0;
    }
}