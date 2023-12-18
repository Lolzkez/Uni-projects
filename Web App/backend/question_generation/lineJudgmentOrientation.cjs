const { ProceduralQuestionAbstract } = require('./pqa.cjs');

class LineJudgementOrientationQuestionLogic extends ProceduralQuestionAbstract {
    constructor(difficulty, totalLinesInSemicircle = 11) {
        super(difficulty);
        this.DIFFICULTY_RANGE = [0, 999];
        this.totalLinesInSemicircle = totalLinesInSemicircle;
    }

    generateQuestionData() {
        let lineAngleToDifficulty = this._calculateDifficulty(this.totalLinesInSemicircle);
        let normalizedDifficulties = this._normalizeDifficulties(lineAngleToDifficulty);
        let closestDifficultyPairs = this._getClosestDifficulties(normalizedDifficulties);
        return closestDifficultyPairs[Math.floor(Math.random() * closestDifficultyPairs.length)];
    }

    _calculateDifficulty(totalLines) {
        const referenceAngles = [0, 45, 90, 135, 180];
        const angleInterval = 180 / (totalLines - 1);

        let results = [];

        for (let line = 0; line < totalLines; line++) {
            let currentAngle = line * angleInterval;
            let angularDifferences = referenceAngles.map(refAngle => Math.abs(currentAngle - refAngle));
            let closestAngularDifference = Math.min(...angularDifferences);
            results.push({
                line: line + 1,
                angle: currentAngle,
                difficulty: closestAngularDifference
            });
        }

        return results;
    }

    _normalizeDifficulties(lineAngleToDifficulty) {
        let allDifficulties = lineAngleToDifficulty.map(item => item.difficulty);
        let minDifficulty = Math.min(...allDifficulties);
        let maxDifficulty = Math.max(...allDifficulties);
        let normalize = x => (x - minDifficulty) / (maxDifficulty - minDifficulty);

        lineAngleToDifficulty.forEach(item => {
            item.normalizedDifficulty = normalize(item.difficulty);
        });

        return lineAngleToDifficulty;
    }

    _getClosestDifficulties(normalizedDifficulties) {
        let closestDifficultyDistance = Math.min(...normalizedDifficulties.map(item => Math.abs(item.normalizedDifficulty - this.difficultyNorm)));

        return normalizedDifficulties.filter(item => Math.abs(item.normalizedDifficulty - this.difficultyNorm) === closestDifficultyDistance);
    }
}

// const a = new LineJudgementOrientationQuestionLogic(200);
// for (const thing of a.generateQuestionData()) {
//     console.log(thing);
// }
// 

module.exports = { LineJudgementOrientationQuestionLogic }
