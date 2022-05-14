import * as Constants from "./constants.js"

export class Field {
    constructor() {
        this.rows= Array(Constants.ROWS_AHEAD + Constants.ROWS_BEHIND);
        this.populate_field();
    }

    populate_field() {
        let starting_row_number = 0 - Constants.ROWS_BEHIND; // we need to keep track of a few rows behind us so we can move back
        for (let row_num = starting_row_number; row_num < Constants.ROWS_AHEAD; row_num++) {
            this.rows[row_num + Constants.ROWS_BEHIND] = new Row(row_num);
        }
    }
}

export class Row {
    constructor(row_num) {
        this.row_num = row_num;
        this.row = Array(Constants.ROW_WIDTH);
        this.row_type = this.get_row_type();
        this.populate_row();
    }

    populate_row() {
        for (let index = 0; index < this.row.length; index++) {
            this.row[index] = new Tile(index, this.row_num, this.row_type);
        }
    }

    get_row_type() {
        // 0: road
        // 1: grass
        // maybe add more later on

        // possible TODO: generate these pseudorandomly (based on previous row)
        if (this.row_num <= 1) {
            return 1;
        }
        let random_value = Math.random();
        if (random_value < Constants.ROAD_ROW_PERCENT) {
            return 0;
        }
        else if (random_value < Constants.ROAD_ROW_PERCENT + Constants.GRASS_ROW_PERCENT) {
            return 1;
        }
    }
}

export class Tile {
    constructor(index, row_num, type) {
        this.index = index;
        this.row_num = row_num;
        this.type = type;
    }
}