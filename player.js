import * as Constants from "./constants.js"

export class Player {
    constructor() {
        this.row_num = 0;
        this.index = Math.ceil(Constants.ROW_WIDTH);
    }
}