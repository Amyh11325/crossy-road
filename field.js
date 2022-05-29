import * as Constants from "./constants.js"

export class Field {
    constructor(palette) {
        this.rows = Array(Constants.ROWS_AHEAD + Constants.ROWS_BEHIND);
        this.palette = palette
        this.populate_field();
    }

    populate_field() {
        let starting_row_number = 0 - Constants.ROWS_BEHIND; // we need to keep track of a few rows behind us so we can move back
        for (let row_num = starting_row_number; row_num < Constants.ROWS_AHEAD; row_num++) {
            this.rows[row_num + Constants.ROWS_BEHIND] = new Row(row_num, this.palette);
        }
    }
    
    progress() {
        this.rows.shift();
        let max_row_number = this.rows.at(-1).row_num;
        this.rows.push(new Row(max_row_number + 1, this.palette));
    }
}

export class Row {
    constructor(row_num, palette) {
        this.row_num = row_num;
        this.seed = Math.floor(Math.random() * Constants.MAX_SEED);
        this.row = Array(Constants.ROW_WIDTH);
        this.row_type = this.get_row_type();
        this.populate_row();

        this.car_array = new Cars(row_num, this.row_type, palette);
    }

    populate_row() {
        for (let index = 0; index < this.row.length; index++) {
            this.row[index] = new Tile(index, this.row_num, this.row_type);
        }
        if (this.row_type == 1 && this.row_num > 0) { // spawn in trees and rocks in bounds
            let number_of_blockers = this.get_number_of_blockers(this.seed);
            let indexes = Array.apply(null, Array(Constants.PLAYABLE_WIDTH)).map(function (x, index) { return index; })
            let shuffled_indexes = this.shuffle(indexes);
            let blocker_in_bound_locations = shuffled_indexes.slice(0, number_of_blockers);
            blocker_in_bound_locations.forEach(index => {
                this.row[index + Math.ceil(Constants.ROW_WIDTH / 2) - Math.floor(Constants.PLAYABLE_WIDTH / 2)].type = Math.floor(Math.random() * 2 + 12);
            });
        }
    }

    // Fisher-Yates shuffle
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    get_number_of_blockers(seed) { // using equation floor((seed)^n / (max seed)^n * floor((playable width - 1) / m)), should always be possible
        return Math.floor(Math.pow(seed, Constants.BLOCKER_SPAWN_ALGORITHM_STEEPNESS) / Math.pow(Constants.MAX_SEED, Constants.BLOCKER_SPAWN_ALGORITHM_STEEPNESS) * Math.floor((Constants.PLAYABLE_WIDTH - 1) * Constants.BLOCKER_MAX_ROW_PERCENTAGE));
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

export class Cars {
    // each road contains a random number of cars and each row has its own speed and direction
    // cars are randomly generated so that each car is at a certain distance apart from another
    // when a car reaches the end of the screen, it loops back to the beginning using the % operator
    constructor(row_num, row_type, palette) {
        this.row_num = row_num
        this.cars = [];
        this.speed = this.get_speed();
        this.direction = this.get_direction();
        if (row_type == 0) {
           this.max_cars_per_row = this.get_max_cars_per_row(); 
        }
        this.populate_cars(palette);
    }

    populate_cars(palette) { // randomize the space between cars instead of the location of the car itself
        let cars_in_row = Math.floor(Math.random() * this.max_cars_per_row) + 1; // generate a random number of cars per row
        let distances_between_cars = this.get_random_spacing(cars_in_row);
        let car_base_locations = this.get_car_locations(cars_in_row, distances_between_cars);
        let random_car_locations = this.get_random_car_locations(car_base_locations);

        for (let location_index = 0; location_index < random_car_locations.length; location_index++) {
            this.cars.push(new Car(random_car_locations[location_index], palette));
        }
    }

    get_random_spacing(cars_in_row) { // randomly generate the space between cars such that the distance is greater than the minimum
        // pure chaos
        let empty_space = Constants.ROW_WIDTH - cars_in_row * Constants.OBSTACLE_WIDTH; // calculate the total non-car width in a row
        let uniform_spacing = empty_space / cars_in_row // calculate the spacing between each car if they were uniformly far apart
        let distances_between_cars = Array.apply(null, {length: cars_in_row}).fill(uniform_spacing);
        
        for (let spacing_index = 0; spacing_index < cars_in_row; spacing_index++) { // adjust the spacing randomly, iterate through each car and adjust the left and right margins
            let left_margin = distances_between_cars[spacing_index] - Constants.MIN_OBSTACLE_SPACING; // left margin is how far we can expand the left side of a car
            let right_margin = spacing_index + 1 < cars_in_row ?  // right margin is how far we can expand the right side of a car
                distances_between_cars[spacing_index + 1] - Constants.MIN_OBSTACLE_SPACING
                :
                distances_between_cars[0] - Constants.MIN_OBSTACLE_SPACING; // rollover
            let random_shift = Math.random() * (right_margin + left_margin) - left_margin; // randomly shift the car to the left or right
            distances_between_cars[spacing_index] = distances_between_cars[spacing_index] + random_shift; // adjust the left spacing wrt the shift
            if (spacing_index + 1 < cars_in_row) { // adjust the right spacing wrt the shift
                distances_between_cars[spacing_index + 1] = distances_between_cars[spacing_index + 1] - random_shift;
            }
            else {
                distances_between_cars[0] = distances_between_cars[0] - random_shift; // rollover
            } 
        }
        return distances_between_cars;
    }

    get_car_locations(cars_in_row, distances_between_cars) { // generate the location of the cars based on the spacing between them
        let car_base_locations = Array.apply(null, {length: cars_in_row})
        for (let car_num = 0; car_num < cars_in_row; car_num++) {
            car_base_locations[car_num] = distances_between_cars.slice(0, car_num + 1)
            .reduce((partial, a) => partial + a + Constants.OBSTACLE_WIDTH, 0) - Constants.OBSTACLE_WIDTH / 2;
        }
        return car_base_locations;
    }

    get_random_car_locations(car_base_locations) { // randomize the starting position of a row of cars
        let random_shift = Math.random() * Constants.ROW_WIDTH;
        let car_random_locations = car_base_locations
        for (let location_index = 0; location_index < car_random_locations.length; location_index++) {
            car_random_locations[location_index] = (car_random_locations[location_index] + random_shift) % Constants.ROW_WIDTH;
        }
        return car_random_locations;
    }

    get_max_cars_per_row() { // find max number of cars in a row that fits contraints
        return Math.floor(Constants.ROW_WIDTH / (Constants.OBSTACLE_WIDTH + Constants.MIN_OBSTACLE_SPACING));
    }

    get_speed() {
        return Math.random() * (Constants.MAX_OBSTACLE_SPEED - Constants.MIN_OBSTACLE_SPEED) + Constants.MIN_OBSTACLE_SPEED
    }

    get_direction() {
        return Math.floor(Math.random() * 2) * 2 - 1;
    }
}

export class Car {
    constructor(position, palette) {
        this.position = position;
        if (palette) {
            this.color = palette[Math.floor(Math.random() * palette.length)];
        }
    }
}

export class Tile {
    constructor(index, row_num, row_type) {
        this.index = index;
        this.row_num = row_num;
        this.type = this.get_tile_type(index, row_type);
        this.seed = Math.floor(Math.random() * Constants.MAX_SEED);
    }

    get_tile_type(index, row_type) {
        // 0: road
        // 1: road bound
        // 10: grass
        // 11: grass bound
        // 12: tree
        // 13: rock
        if (index < Math.floor(Constants.ROW_WIDTH / 2) - Math.floor(Constants.PLAYABLE_WIDTH / 2) + 1|| index > Math.floor(Constants.ROW_WIDTH / 2) + Math.floor(Constants.PLAYABLE_WIDTH / 2) + 1) {
            if (row_type == 0) {
                return 1;
            }
            else if (row_type == 1) {
                return 11;
            }
        }
        else {
            if (row_type == 0) {
                return 0;
            }
            else if (row_type == 1) {
                return 10;
            }
        }
    }
}