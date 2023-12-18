export class CorsiBlockTappingQuestionLogic {
    static SEQUENCE_AMOUNT = [1, 9];

    constructor(canvasWidth, canvasHeight) {
        this.current_sequence_length = CorsiBlockTappingQuestionLogic.SEQUENCE_AMOUNT[0];
        this.total_boxes = CorsiBlockTappingQuestionLogic.SEQUENCE_AMOUNT[1];
        this.box_dimensions = [100, 100];
        this.working_space_dimensions = [canvasWidth,canvasHeight];
        this.box_positions = [];
        this.correct_tapping_sequence = [];
        this.user_tapping_sequence = [];
        this.remaining_lives = 3;
        this.position_boxes_randomly();
    }

    is_valid_position(x_coord, y_coord) {
        if (x_coord + this.box_dimensions[0] > this.working_space_dimensions[0] ||
            y_coord + this.box_dimensions[1] > this.working_space_dimensions[1]) {
            return false;
        }
        for (let box_position of this.box_positions) {
            if (x_coord + this.box_dimensions[0] > box_position[0] &&
                x_coord < box_position[0] + this.box_dimensions[0] &&
                y_coord + this.box_dimensions[1] > box_position[1] &&
                y_coord < box_position[1] + this.box_dimensions[1]) {
                return false;
            }
        }
        return true;
    }

    position_boxes_randomly() {
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        this.box_positions = [];
        const max_placement_attempts = 10000;
        for (let i = 0; i < this.total_boxes; i++) {
            for (let j = 0; j < max_placement_attempts; j++) {
                let x = getRandomInt(0, this.working_space_dimensions[0] - this.box_dimensions[0]);
                let y = getRandomInt(0, this.working_space_dimensions[1] - this.box_dimensions[1]);
                if (this.is_valid_position(x, y)) {
                    this.box_positions.push([x, y]);
                    break;
                }
            }
        }
    }

    generate_sequence_indexes() {
        const sample = (arr, size) => {
            let shuffled = arr.slice();
            let i = arr.length;
            let min = i - size;
            let temp, index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        };

        let sequence_indexes = sample([...Array(this.box_positions.length).keys()], this.current_sequence_length);
        this.correct_tapping_sequence = [...sequence_indexes];
        return this.correct_tapping_sequence;
    }

    reset_after_failed_level() {
        this.position_boxes_randomly();
    }

    advance_to_next_level() {
        this.position_boxes_randomly();
        if (this.current_sequence_length >= this.total_boxes) {
            return;
        }
        this.current_sequence_length++;
    }

    decrement_life() {
        this.remaining_lives--;
    }

    restart_game() {
        this.remaining_lives = 3;
        this.current_sequence_length = CorsiBlockTappingQuestionLogic.SEQUENCE_AMOUNT[0];
    }

    getQuestionData() {
        return {
            current_sequence_length: CorsiBlockTappingQuestionLogic.SEQUENCE_AMOUNT[0],
            total_boxes: CorsiBlockTappingQuestionLogic.SEQUENCE_AMOUNT[1],
            box_dimensions: [100, 100],
            working_space_dimensions: this.working_space_dimensions,
            box_positions: this.box_positions,
            correct_tapping_sequence: this.correct_tapping_sequence,
            user_tapping_sequence: this.user_tapping_sequence,
            lives: this.remaining_lives,
        }
    }
}
