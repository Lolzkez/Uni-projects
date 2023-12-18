class ProceduralQuestionAbstract {
    static DIFFICULTY_RANGE = [0, 999];

    constructor(difficulty) {
        this.difficulty = difficulty;
        this.difficultyNorm = this.normalizeDifficulty(difficulty);
    }

    normalizeDifficulty(difficulty) {
        const [minDiff, maxDiff] = this.constructor.DIFFICULTY_RANGE;
        if (!(minDiff <= difficulty && difficulty <= maxDiff)) {
            throw new Error("Difficulty is out of the allowed range");
        }

        return (difficulty - minDiff) / (maxDiff - minDiff);
    }

    generateQuestionData() {
        throw new Error("generateQuestionData() is not implemented");
    }
}

module.exports = {
    ProceduralQuestionAbstract
};