const { ProceduralQuestionAbstract } = require('./pqa.cjs');

class MazePath {
    constructor(startingPosition, startingOrientation, instructions = []) {
        this.startingPosition = startingPosition;
        this.startingOrientation = startingOrientation;
        this.instructions = instructions;
    }

    getInstructionsAmount() {
        return this.instructions.length;
    }

    addInstruction(item) {
        this.instructions.push(item);
    }

    popInstruction() {
        this.instructions.pop();
    }
}


class HamsterMazeQuestionLogic extends ProceduralQuestionAbstract {
    static DIFFICULTY_RANGE = [0, 999];
    static INSTRUCTIONS_AMOUNT_BOUNDS = [2, 10];
    static FALSE_ENDINGS_AMOUNT_BOUNDS = [1, 4];
    static SINGLE_PATH_STEP_SIZE = 5;
    static PATH_SIZE_MULTIPLIERS = [1, 2, 3];
    static DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // down, right, up, left

    constructor(difficulty) {
        super(difficulty);
        this.trueInstructionsAmount = this.getCorrectInstructionsAmount();
        this.falseEndingsAmount = this.getFalseEndingsAmount();
        this.mazeDimensions = this.getMazeDimensions();
        this.paths = null;
    }

    lerp(t, value1, value2) {
        return value1 + (value2 - value1) * t;
    }

    getCorrectInstructionsAmount() {
        const instructionAmount = this.lerp(this.difficultyNorm, HamsterMazeQuestionLogic.INSTRUCTIONS_AMOUNT_BOUNDS[0], HamsterMazeQuestionLogic.INSTRUCTIONS_AMOUNT_BOUNDS[1]);
        return Math.round(instructionAmount);
    }

    getFalseEndingsAmount() {
        const falseEndingsAmount = this.lerp(this.difficultyNorm, HamsterMazeQuestionLogic.FALSE_ENDINGS_AMOUNT_BOUNDS[0], HamsterMazeQuestionLogic.FALSE_ENDINGS_AMOUNT_BOUNDS[1]);
        return Math.round(falseEndingsAmount);
    }

    getMazeDimensions() {
        const maximumSinglePathStep = HamsterMazeQuestionLogic.SINGLE_PATH_STEP_SIZE * Math.max(...HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS);
        const correctPathTotalSteps = this.trueInstructionsAmount * maximumSinglePathStep;
        const falseEndingTotalSteps = this.falseEndingsAmount * maximumSinglePathStep;

        let totalSteps = correctPathTotalSteps + falseEndingTotalSteps;
        if (totalSteps % 2 === 0) totalSteps += 1;

        return [totalSteps, totalSteps];
    }

    generateQuestionData() {
        const startPosition = this.mazeDimensions.map(x => Math.floor(x / 2));

        const trueInstructions = [[
            "forward",
            HamsterMazeQuestionLogic.SINGLE_PATH_STEP_SIZE * HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS[
                Math.floor(Math.random() * HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS.length)
                ]
        ]];

        this.paths = {
            truePath: new MazePath(startPosition, "up", trueInstructions),
            falsePaths: []
        };
        
        this.generateTruePath();
        this.generateFalsePaths();
        let maze = HamsterMazeQuestionLogic.trimMaze(this.buildMaze().maze);

        // Rotate the maze if it's taller than wide
        let startingOrientation = "up";
        if (maze.length > maze[0].length) {
            maze = HamsterMazeQuestionLogic.rotateMaze90Degrees(maze);
            startingOrientation = "right";
        }

        const letterAtAPosition = HamsterMazeQuestionLogic.getNewCharacterAtAPosition(maze);
        let correctInstructions = this.paths.truePath.instructions.map(([x, _]) => x);

        return {
            maze: maze,
            instructions: correctInstructions,
            correctLetter: letterAtAPosition,
            startingOrientation: startingOrientation,
        };
    }

    static rotateMaze90Degrees(maze) {
        let height = maze.length;
        let width = (height > 0) ? maze[0].length : 0;

        let rotatedMaze = Array.from({length: width}, () => Array(height));

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let new_row = j;
                let new_col = height - 1 - i;
                rotatedMaze[new_row][new_col] = maze[i][j];
            }
        }

        return rotatedMaze;
    }

    static getNewCharacterAtAPosition(maze) {
        let positionOfA = null;
        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                if (maze[i][j] === "A") {
                    positionOfA = [i, j];
                    break;
                }
            }
            if (positionOfA) break;
        }

        let letters = [];
        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                if (maze[i][j].match(/[a-zA-Z]/)) {
                    letters.push(maze[i][j]);
                }
            }
        }
        letters.sort(() => Math.random() - 0.5);

        let lettersIndex = 0;
        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                if (maze[i][j].match(/[a-zA-Z]/)) {
                    maze[i][j] = letters[lettersIndex];
                    lettersIndex++;
                }
            }
        }

        return maze[positionOfA[0]][positionOfA[1]];
    }
    
    generateTruePath() {
        this.generatePathInstructions(this.paths.truePath, this.trueInstructionsAmount);
    }

    generatePathInstructions(mazePath, instructionsAmount) {

        const backtrack = () => {

            if (!this.mazeIsValid()) return false;
            if (mazePath.getInstructionsAmount() === instructionsAmount) return true;
            if (mazePath.getInstructionsAmount() > instructionsAmount) return false;

            const potentialMovements = [];
            for (let direction of ["left", "right"]) {
                for (let factor of HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS) {
                    potentialMovements.push([direction, HamsterMazeQuestionLogic.SINGLE_PATH_STEP_SIZE * factor]);
                }
            }

            this.shuffleArray(potentialMovements);

            for (let movement of potentialMovements) {
                mazePath.addInstruction(movement);
                if (backtrack()) return true;
                mazePath.popInstruction();
            }

            return false;
        };

        backtrack();

    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    mazeIsValid() {
        const mazeData = this.buildMaze();
        const maze = mazeData.maze;
        const finalExpectedPos = mazeData.end_pos;
        return this.isCorrectEndingReachableByTruePath(maze, finalExpectedPos);
    }

    buildMaze() {
        let maze = Array.from({length: this.mazeDimensions[0]}, () => Array(this.mazeDimensions[1]).fill("."));
        const startPosition = this.paths.truePath.startingPosition;
        maze[startPosition[0]][startPosition[1]] = "*";

        let characterIndex = 65;

        const constructPathOnMaze = (mazePath) => {
            let currPos = mazePath.startingPosition;
            let currOrientation = mazePath.startingOrientation;

            for (let instruction of mazePath.instructions) {
                const direction = instruction[0];
                const steps = instruction[1];

                [maze, currPos, currOrientation] = this.layPath(maze, currPos, currOrientation, direction, steps);
            }

            maze[currPos[0]][currPos[1]] = String.fromCharCode(characterIndex);
            characterIndex++;

            return currPos;
        }

        const endPos = constructPathOnMaze(this.paths.truePath);
        this.paths.falsePaths.forEach(path => constructPathOnMaze(path));

        return {
            maze: maze, end_pos: endPos
        };
    }

    isCorrectEndingReachableByTruePath(maze, final_expected_pos) {

        const instructions = this.paths.truePath.instructions;
        let curr_pos = this.paths.truePath.startingPosition;
        let curr_orientation = this.paths.truePath.startingOrientation;

        for (let instruction of instructions) {
            const direction = instruction[0];
            curr_orientation = this.changeOrientation(curr_orientation, direction);
            let next_position = this.getNextPosition(curr_pos, curr_orientation);

            while (maze[next_position[0]][next_position[1]] !== ".") {
                curr_pos = next_position;
                next_position = this.getNextPosition(curr_pos, curr_orientation);
            }
        }

        return curr_pos[0] === final_expected_pos[0] && curr_pos[1] === final_expected_pos[1];
    }

    layPath(maze, current_position, current_orientation, direction, path_amount) {
        let new_orientation = this.changeOrientation(current_orientation, direction);

        for (let i = 0; i < path_amount; i++) {
            current_position = this.getNextPosition(current_position, new_orientation);
            if (maze[current_position[0]][current_position[1]] === ".") {
                maze[current_position[0]][current_position[1]] = "#";
            }
        }

        return [maze, current_position, new_orientation];
    }

    getNextPosition(currentPosition, orientation) {
        const [row, col] = currentPosition;
        switch (orientation) {
            case "up":
                return [row - 1, col];
            case "left":
                return [row, col - 1];
            case "right":
                return [row, col + 1];
            case "down":
                return [row + 1, col];
            default:
                return currentPosition;  // Default return, adjust as needed
        }
    }

    changeOrientation(currentOrientation, direction) {
        const orientations = {
            up: {left: "left", right: "right", forward: "up"},
            left: {left: "down", right: "up", forward: "left"},
            right: {left: "up", right: "down", forward: "right"},
            down: {left: "right", right: "left", forward: "down"}
        };
        return orientations[currentOrientation][direction];
    }

    generateFalsePaths() {
        const truePathExpansionPoints = this.validExpansionPoints();
        const pointsToExpand = this.determinePointsToExpand(truePathExpansionPoints);
        for (const [pointToExpand, amountOfEndings] of Object.entries(pointsToExpand)) {
            this.addFalseEndings(pointToExpand, amountOfEndings);
        }
    }

    validExpansionPoints() {
        const findExpansionPoints = () => {
            const maze = this.buildMaze().maze;
            const expansionPoints = new Set();
            const visited = new Set();
            const queue = [this.paths.truePath.startingPosition];

            while (queue.length > 0) {
                const [r, c] = queue.shift();
                const pointKey = `${r},${c}`;

                if (!visited.has(pointKey)) {
                    visited.add(pointKey);

                    if (this.isTurnOrIntersection(maze, r, c)) {
                        this.getNonNeighbours(maze, r, c).forEach(pos => expansionPoints.add(pos));
                    }

                    this.getNeighbours(maze, r, c).forEach(position => {
                        const positionKey = `${position[0]},${position[1]}`;
                        if (!visited.has(positionKey)) {
                            queue.push(position);
                        }
                    });
                }
            }

            return [...expansionPoints];
        };

        const refineExpansionPoints = (allExpansionPoints) => {
            const refinedExpansionPoints = [...allExpansionPoints];
            const maze = this.buildMaze().maze;
            const mazePath = this.paths.truePath;
            let currPos = mazePath.startingPosition;
            let currOrientation = mazePath.startingOrientation;

            mazePath.instructions.forEach(([direction]) => {
                currOrientation = this.changeOrientation(currOrientation, direction);
                let nextPosition = this.getNextPosition(currPos, currOrientation);

                while (maze[nextPosition[0]][nextPosition[1]] !== ".") {
                    currPos = nextPosition;
                    nextPosition = this.getNextPosition(currPos, currOrientation);
                }

                const index = refinedExpansionPoints.findIndex(pos => pos[0] === nextPosition[0] && pos[1] === nextPosition[1]);
                if (index !== -1) {
                    refinedExpansionPoints.splice(index, 1);
                }
            });

            return refinedExpansionPoints;
        };

        return refineExpansionPoints(findExpansionPoints());
    }

    isTurnOrIntersection(maze, x, y) {
        const neighbours = this.getNeighbours(maze, x, y);
        if (neighbours.length === 2) {
            return neighbours[0][0] !== neighbours[1][0] && neighbours[0][1] !== neighbours[1][1];
        }
        return neighbours.length > 2;
    }

    getNeighbours(maze, x, y) {
        const rows = maze.length;
        const cols = maze[0].length;
        return HamsterMazeQuestionLogic.DIRECTIONS.filter(([dx, dy]) => {
            return (x + dx >= 0 && x + dx < rows && y + dy >= 0 && y + dy < cols && maze[x + dx][y + dy] !== ".");
        }).map(([dx, dy]) => [x + dx, y + dy]);
    }

    getNonNeighbours(maze, x, y) {
        const neighbours = this.getNeighbours(maze, x, y);
        return HamsterMazeQuestionLogic.DIRECTIONS.filter(([dx, dy]) => {
            const pos = [x + dx, y + dy];
            return !neighbours.some(neighbour => neighbour[0] === pos[0] && neighbour[1] === pos[1]);
        }).map(([dx, dy]) => [x + dx, y + dy]);
    }

    determinePointsToExpand(truePathExpansionPoints) {
        const distances = truePathExpansionPoints.map(ep => [ep, this.falseEndToCorrectEndDistance(ep)]);
        const sortedPoints = distances.sort((a, b) => b[1] - a[1]).map(item => item[0]);

        const falsePathsAtExpansionPoint = {};
        sortedPoints.forEach(point => {
            falsePathsAtExpansionPoint[point] = 0;
        });

        const sampleFromList = (numbers, stdDev = 0.3) => {
            const gaussianSample = this.difficultyNorm + (Math.random() * 2 - 1) * stdDev;
            const clampedSample = Math.max(0, Math.min(1, gaussianSample));
            const index = Math.floor(clampedSample * (numbers.length - 1));
            return numbers[index];
        };

        for (let i = 0; i < this.falseEndingsAmount; i++) {
            const point = sampleFromList(sortedPoints);
            falsePathsAtExpansionPoint[point]++;
        }

        return falsePathsAtExpansionPoint;
    }

    falseEndToCorrectEndDistance(start) {
        const maze = this.buildMaze().maze;
        const rows = maze.length;
        const cols = maze[0].length;
        const visited = Array(rows).fill().map(() => Array(cols).fill(false));
        const queue = [[start, 0]];

        while (queue.length) {
            const [[x, y], dist] = queue.shift();

            if (maze[x][y] === "A") return dist;

            visited[x][y] = true;

            HamsterMazeQuestionLogic.DIRECTIONS.forEach(([dx, dy]) => {
                const new_x = x + dx;
                const new_y = y + dy;

                if (new_x >= 0 && new_x < rows && new_y >= 0 && new_y < cols && !visited[new_x][new_y] && maze[new_x][new_y] !== ".") {
                    queue.push([[new_x, new_y], dist + 1]);
                }
            });
        }

        return -1;
    }

    addFalseEndings(point, endingsAmount) {
        const notToBeExpandedExpansionPoints = new Set([...this.validExpansionPoints()]);
        notToBeExpandedExpansionPoints.delete(point);

        const grabOrientation = cell => {
            const maze = this.buildMaze().maze;
            const neighbourCell = this.getNeighbours(maze, ...cell)[0];  // Dangerously assuming this returns one cell every time

            const dx = cell[1] - neighbourCell[1];
            const dy = cell[0] - neighbourCell[0];

            if (dx === 1) return "left";
            if (dx === -1) return "right";
            if (dy === -1) return "down";
            if (dy === 1) return "up";

            return null;
        };

        const invertOrientation = direction => {
            const inverses = {
                "up": "down", "down": "up", "left": "right", "right": "left"
            };
            return inverses[direction] || null;
        };

        const backtrack = pathsRemaining => {
            const availableExpansionPoints = new Set([...this.validExpansionPoints()]);
            for (let point of notToBeExpandedExpansionPoints) {
                availableExpansionPoints.delete(point);
            }

            if (pathsRemaining <= 0) return true;
            if (!availableExpansionPoints.size) return false;

            const ep = [...availableExpansionPoints][0];
            availableExpansionPoints.delete(ep);
            const startOrientation = grabOrientation(ep);
            const inverseOrientation = invertOrientation(startOrientation);
            const newPos = this.getNextPosition(ep, startOrientation);

            for (let instrAmount = 1; instrAmount <= 3; instrAmount++) {
                const falseInstructions = [[
                    "forward",
                    HamsterMazeQuestionLogic.SINGLE_PATH_STEP_SIZE * HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS[
                        Math.floor(Math.random() * HamsterMazeQuestionLogic.PATH_SIZE_MULTIPLIERS.length)
                        ]
                ]];
                const falsePath = new MazePath(newPos, inverseOrientation, falseInstructions);
                this.generatePathInstructions(falsePath, instrAmount);
                this.paths.falsePaths.push(falsePath);
                if (backtrack(pathsRemaining - 1)) return true;
                this.paths.falsePaths.pop();
            }

            return false;
        };

        backtrack(endingsAmount);
    }

    static trimMaze(maze) {
        let rowsWithContent = [];
        for (let i = 0; i < maze.length; i++) {
            if (maze[i].some(cell => cell !== '.')) {
                rowsWithContent.push(i);
            }
        }

        let transposed = maze[0].map((_, colIndex) => maze.map(row => row[colIndex]));
        let colsWithContent = [];
        for (let i = 0; i < transposed.length; i++) {
            if (transposed[i].some(cell => cell !== '.')) {
                colsWithContent.push(i);
            }
        }

        let trimmedRows = rowsWithContent.map(rowIndex => maze[rowIndex]);
        let trimmed = trimmedRows.map(row => colsWithContent.map(colIndex => row[colIndex]));

        let width = trimmed[0].length;
        let topBottomRow = Array(width + 2).fill('.');
        for (let row of trimmed) {
            row.unshift('.');
            row.push('.');
        }

        trimmed = [topBottomRow].concat(trimmed).concat([topBottomRow]);

        return trimmed;
    }


}

module.exports = { HamsterMazeQuestionLogic, MazePath} 