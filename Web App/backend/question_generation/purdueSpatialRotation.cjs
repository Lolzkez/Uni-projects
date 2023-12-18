const { ProceduralQuestionAbstract } = require('./pqa.cjs');
const fs = require('fs');
const path = require('path');

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const arrCopy = [];
        for (const item of obj) {
            arrCopy.push(deepCopy(item));
        }
        return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
        objCopy[key] = deepCopy(obj[key]);
    }

    return objCopy;
}

function multiplyMatrixVector(matrix, vector) {
    const result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        result[i] = matrix[i][0] * vector[0] + matrix[i][1] * vector[1] + matrix[i][2] * vector[2];
    }
    return result;
}

const CONFIG = {
    pathToDifficultyShapes: "static_images_for_procedural_use/purdue_spatial_visualisation_rotation",
    pathToPromptShape: "img_default.json"
};


class PurdueSpatialVisualisationRotationQuestionLogic extends ProceduralQuestionAbstract {
    static ROTATIONS_AMOUNT = [1, 3];

    constructor(difficulty) {
        super(difficulty);
        this.pathToDifficultyShapes = CONFIG.pathToDifficultyShapes;
        this.pathToPromptShape = CONFIG.pathToPromptShape;
    }

    generateQuestionData() {
        let rotationInfo = this.getRotationInfo();
        let horizontalDirection = rotationInfo["horizontalDirection"];
        let verticalDirection = rotationInfo["verticalDirection"];
        let rotationSequence = rotationInfo["rotationSequence"];
        
        let initialInfoShape = this.loadShapeData(this.pathToPromptShape);
        let initialPromptShape = this.getPromptShape();
        
        let rotatedInfoShape = this.rotateShapeBySequence(
            deepCopy(initialInfoShape), 
            rotationSequence,
            horizontalDirection, 
            verticalDirection
        );

        let rotatedPromptShape = this.rotateShapeBySequence(
            deepCopy(initialPromptShape), 
            rotationSequence,
            horizontalDirection, 
            verticalDirection
        );
    
        let falseOptions = this.generateFalseOptions(3, initialPromptShape, rotatedPromptShape);
    
        return {
            "initialInfoShape": initialInfoShape,
            "rotatedInfoShape": rotatedInfoShape,
            "initialPromptShape": initialPromptShape,
            "rotatedPromptShape": rotatedPromptShape,
            "falseOptions": falseOptions
        };
    }

    getRotationInfo(getRandomSequence=false) {
        return {
            "horizontalDirection": this.getRandomItem(["left", "right"]),
            "verticalDirection": this.getRandomItem(["up", "down"]),
            "rotationSequence": this.determineRotationSequence(getRandomSequence)
        };
    }

    determineRotationSequence(getRandomSequence=false) {
        const availableRotationTypes = ["horizontal", "vertical"];
        const rotationCombinations = this.generateRotationCombinations(availableRotationTypes);
        
        if (getRandomSequence) {
            return this.getRandomItem(rotationCombinations);
        }
        
        const rotationsEntropyPairs = this.calculateSequenceEntropies(rotationCombinations);
        const rotationsEntropyPairsNorm = this.normalizeEntropies(rotationsEntropyPairs);
        rotationsEntropyPairsNorm.sort((a, b) => 
            Math.abs(a[1] - this.difficultyNorm) - Math.abs(b[1] - this.difficultyNorm)
        );
        
        const minDiff = Math.abs(rotationsEntropyPairsNorm[0][1] - this.difficultyNorm);
        const viableRotationSequences = rotationsEntropyPairsNorm.filter(
            t => Math.abs(t[1] - this.difficultyNorm) === minDiff
        );

        return this.getRandomItem(viableRotationSequences)[0];
    }

    generateRotationCombinations(rotationTypes) {
        const rotationCombinations = [];
        for (let rotationsCount = PurdueSpatialVisualisationRotationQuestionLogic.ROTATIONS_AMOUNT[0]; rotationsCount <= PurdueSpatialVisualisationRotationQuestionLogic.ROTATIONS_AMOUNT[1]; rotationsCount++) {
            const combinations = this.cartesianProduct(rotationTypes, rotationsCount);
            rotationCombinations.push(...combinations);
        }
        return rotationCombinations;
    }

    calculateSequenceEntropies(sequences) {
        return sequences.map(seq => [seq, this.calculateEntropy(seq)]);
    }

    calculateEntropy(elements, biasFactor=2) {
        const elementCounts = elements.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
        const probabilities = Array.from(elementCounts.values()).map(count => count / elements.length);
        const lengthBias = biasFactor * Math.log2(elements.length + 1);
        return -probabilities.reduce((acc, p) => acc + p * Math.log2(p), 0) + lengthBias;
    }

    normalizeEntropies(entropiesList) {
        const minEntropy = Math.min(...entropiesList.map(e => e[1]));
        const maxEntropy = Math.max(...entropiesList.map(e => e[1]));

        if (minEntropy === maxEntropy) {
            return entropiesList;
        }
        return entropiesList.map(entropy => [entropy[0], (entropy[1] - minEntropy) / (maxEntropy - minEntropy)]);
    }

    cartesianProduct(arr, repeat) {
        const f = (arr, repeat) => {
            if (repeat === 1) {
                return arr.map(e => [e]);
            } else {
                let arr2 = [];
                const subCombinations = f(arr, repeat - 1);
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < subCombinations.length; j++) {
                        arr2.push([arr[i], ...subCombinations[j]]);
                    }
                }
                return arr2;
            }
        };

        return f(arr, repeat);
    }

    getRandomItem(arr) {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    loadShapeData(filePath) {
        const data = fs.readFileSync(path.join(__dirname, this.pathToDifficultyShapes, filePath), 'utf8');
        return JSON.parse(data);
    }

    getPromptShape() {
        let proceduralFiles = [];
        const files = fs.readdirSync(path.join(__dirname, this.pathToDifficultyShapes));

        files.forEach(file => {
            if(file.endsWith('.json') && file.includes('procedural')) {
                const elements = file.split('_');
                const idx = elements.indexOf('diff') + 1;
                const difficulty = this.normalizeDifficulty(parseInt(elements[idx]));
                proceduralFiles.push({filename: file, difficulty: difficulty});
            }
        });

        proceduralFiles.sort((a, b) => a.difficulty - b.difficulty);

        const closestFile = proceduralFiles.reduce((prev, curr) =>
            (Math.abs(curr.difficulty - this.difficultyNorm) <
            Math.abs(prev.difficulty - this.difficultyNorm) ? curr : prev),
            proceduralFiles[0]
        );

        return this.loadShapeData(closestFile.filename);
    }

    rotateShapeBySequence(shape, rotationSequence, horizontalRotationDirection, verticalRotationDirection) {
        for (let rotationType of rotationSequence) {
            shape.vertices = this.rotateShape(
                shape.vertices,
                rotationType,
                horizontalRotationDirection,
                verticalRotationDirection
            );
        }

        return shape;
    }

    rotateShape(vertices, rotationType, horizontalDirection, verticalDirection, offset = [-0.5, -0.5, -0.5]) {
        function rotate(v, translation, theta, ax = "x") {
            v = v.map((val, idx) => val + translation[idx]);
            theta = theta * Math.PI / 180;

            let rotationMatrix;
            switch (ax.toLowerCase()) {
                case "x":
                    rotationMatrix = [
                        [1, 0, 0],
                        [0, Math.cos(theta), -Math.sin(theta)],
                        [0, Math.sin(theta), Math.cos(theta)]
                    ];
                    break;
                case "y":
                    rotationMatrix = [
                        [Math.cos(theta), 0, Math.sin(theta)],
                        [0, 1, 0],
                        [-Math.sin(theta), 0, Math.cos(theta)]
                    ];
                    break;
                case "z":
                    rotationMatrix = [
                        [Math.cos(theta), -Math.sin(theta), 0],
                        [Math.sin(theta), Math.cos(theta), 0],
                        [0, 0, 1]
                    ];
                    break;
                default:
                    throw new Error("Invalid axis; choose from 'x', 'y', or 'z'");
            }

            const rotatedVertex = multiplyMatrixVector(rotationMatrix, v);
            const transformedVertex = rotatedVertex.map((val, idx) => val - translation[idx]);
            return transformedVertex;
        }

        for (let i = 0; i < vertices.length; i++) {
            let vertex = vertices[i];
            let axis, angle;

            if (rotationType === "horizontal") {
                axis = "z";
                angle = horizontalDirection === "left" ? 90 : -90;
            } else if (rotationType === "vertical") {
                axis = "y";
                angle = verticalDirection === "down" ? 90 : -90;
            } else {
                throw new Error("Invalid input");
            }

            let [x, y, z] = rotate([vertex.x, vertex.y, vertex.z], offset, angle, axis);
            vertices[i] = {x, y, z};
        }

        return vertices;
    }

    generateFalseOptions(amount, initialPromptShape, rotatedPromptShape) {
        let falseOptions = [];

        while (falseOptions.length < amount) {
            let rotationInfo = this.getRotationInfo(true);
            let horizontalDirection = rotationInfo.horizontalDirection;
            let verticalDirection = rotationInfo.verticalDirection;
            let rotationSequence = rotationInfo.rotationSequence;

            let falseRotatedShape = this.rotateShapeBySequence(
                deepCopy(initialPromptShape),
                rotationSequence,
                horizontalDirection,
                verticalDirection
            );

            if (!this.areShapesEqual(falseRotatedShape, rotatedPromptShape) &&
                falseOptions.every(option => !this.areShapesEqual(option, falseRotatedShape))) {
                falseOptions.push(falseRotatedShape);
            }
        }

        return falseOptions;
    }

    areShapesEqual(shape1, shape2, tolerance = 1e-9) {
        for (let i = 0; i < shape1.vertices.length; i++) {
            let v1 = shape1.vertices[i];
            let v2 = shape2.vertices[i];

            let distance = Math.sqrt(Math.pow(v1.x - v2.x, 2) +
                                     Math.pow(v1.y - v2.y, 2) +
                                     Math.pow(v1.z - v2.z, 2));
            if (distance > tolerance) {
                return false;
            }
        }
        return true;
    }

}

const a = new PurdueSpatialVisualisationRotationQuestionLogic(700);
console.log(a.generateQuestionData());