const { ProceduralQuestionAbstract } = require('./pqa.cjs');

class DesignOrganisationTestQuestionLogic extends ProceduralQuestionAbstract {
    static DIFFICULTY_RANGE = [0, 999];
    static GRID_SIZE_LIMITS = [2, 3];
    static MIN_RANDOM_WALKS = 2;
    static MIN_RANDOM_WALK_LENGTH = 1;

    constructor(difficulty) {
        super(difficulty);
        this.gridDimensions = this.getGridDimensions();
        this.randomWalkData = this.getRandomWalkData();
        this.options = {
            2: ["right", "down"],
            3: ["up", "left"],
            4: ["up", "right"],
            5: ["down", "left"],
            6: ["up", "right", "down", "left"],
        };
    }

    getGridDimensions() {
        const [a, b] = DesignOrganisationTestQuestionLogic.GRID_SIZE_LIMITS;
        const n = a + (b - a) * this.difficultyNorm;
        return [Math.round(n), Math.round(n)];
    }

    getRandomWalkData() {
        const [n, m] = this.gridDimensions;
        const randomWalks = DesignOrganisationTestQuestionLogic.MIN_RANDOM_WALKS + (1 - this.difficultyNorm) * (n * m - DesignOrganisationTestQuestionLogic.MIN_RANDOM_WALKS);
        const length = DesignOrganisationTestQuestionLogic.MIN_RANDOM_WALK_LENGTH + this.difficultyNorm * (n - DesignOrganisationTestQuestionLogic.MIN_RANDOM_WALK_LENGTH);
        return [Math.round(randomWalks), Math.round(length)];
    }

    generateQuestionData() {
        const grid = this.generateGrid();
        const [randomWalks, length] = this.randomWalkData;
        for (let i = 0; i < randomWalks; i++) {
            this.takeRandomWalk(grid, length);
        }
        return grid;
    }

    generateGrid() {
        const [rows, cols] = this.gridDimensions;
        return Array(rows).fill().map(() => Array(cols).fill(1));
    }

    takeRandomWalk(grid, length) {
        const saveGrid = JSON.parse(JSON.stringify(grid));
        const positionsOfOnes = [];
        grid.forEach((row, i) => {
            row.forEach((val, j) => {
                if (val === 1) positionsOfOnes.push([i, j]);
            });
        });

        if (positionsOfOnes.length === 0) return;

        const [row, col] = positionsOfOnes[Math.floor(Math.random() * positionsOfOnes.length)];
        const path = [[row, col]];
        const incomingDirection = ["up", "right", "down", "left"][Math.floor(Math.random() * 4)];
        this._backtrack(grid, path, length, incomingDirection);
        if (path.length < length) {
            this.takeRandomWalk(saveGrid, length - 1);
            grid.length = 0;
            grid.push(...saveGrid);
        }
    }

    _backtrack(grid, path, length, incomingDirection) {
        if (path.length >= Math.min(length + 1, grid.length * grid.length)) {
            return true;
        }

        const customShuffle = (lst, num = 6, probability = 50) => {
            if (Math.floor(Math.random() * 100) <= probability) {
                const index = lst.indexOf(num);
                if (index !== -1) {
                    lst.splice(index, 1);
                }
                lst.sort(() => 0.5 - Math.random());
                lst.unshift(num);
            } else {
                lst.sort(() => 0.5 - Math.random());
                if (lst[0] === 6) {
                    lst.push(lst.shift());
                }
            }
        };

        const x = 20;
        const potentialOptions = this.getPotentialOptions(incomingDirection);
        customShuffle(potentialOptions, 6, x);

        const [i, j] = path[path.length - 1];

        for (let option of potentialOptions) {
            if (grid[i][j] !== 1) continue;
            grid[i][j] = option;
            for (let [nx, ny, newDirection] of this.getNeighbours(i, j, option)) {
                if (this.isValid(nx, ny, grid)) {
                    path.push([nx, ny]);
                    if (this._backtrack(grid, path, length, newDirection)) {
                        return true;
                    }
                    path.pop();
                }
            }
            grid[i][j] = 1;
        }

        return false;
    }

    getPotentialOptions(incomingDirection) {
        const options = [];
        switch (incomingDirection) {
            case "up":
                options.push(2, 5, 6);
                break;
            case "right":
                options.push(3, 5, 6);
                break;
            case "down":
                options.push(3, 4, 6);
                break;
            case "left":
                options.push(2, 4, 6);
                break;
        }
        return options;
    }

    getNeighbours(i, j, option) {
        const neighbours = [];
        const directions = this.options[option];
        for (let direction of directions) {
            switch (direction) {
                case "up":
                    neighbours.push([i - 1, j, direction]);
                    break;
                case "right":
                    neighbours.push([i, j + 1, direction]);
                    break;
                case "down":
                    neighbours.push([i + 1, j, direction]);
                    break;
                case "left":
                    neighbours.push([i, j - 1, direction]);
                    break;
            }
        }
        return neighbours;
    }

    isValid(row, col, grid) {
        return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && grid[row][col] === 1;
    }


}

// function printGrid(grid) {
//     for (let i = 0; i < grid.length; i++) {
//         console.log(grid[i].join(' '));
//     }
// }
//
// function testGenerateQuestionData() {
//     console.log("Test Case 1: Difficulty 150");
//     const test1 = new DesignOrganisationTestQuestionLogic(150);
//     const grid1 = test1.generateQuestionData();
//     printGrid(grid1);
//
//     console.log("\nTest Case 2: Difficulty 300");
//     const test2 = new DesignOrganisationTestQuestionLogic(300);
//     const grid2 = test2.generateQuestionData();
//     printGrid(grid2);
//
//     console.log("\nTest Case 3: Difficulty 335");
//     const test3 = new DesignOrganisationTestQuestionLogic(400);
//     const grid3 = test3.generateQuestionData();
//     printGrid(grid3);
//
//     console.log("\nTest Case 4: Difficulty 500");
//     const test4 = new DesignOrganisationTestQuestionLogic(500);
//     const grid4 = test4.generateQuestionData();
//     printGrid(grid4);
// }
//
// testGenerateQuestionData();

module.exports = { DesignOrganisationTestQuestionLogic }