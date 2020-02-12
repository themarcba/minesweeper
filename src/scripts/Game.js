const getFieldsToCheck = (x, y) => {
    return [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1]
    ]
}

class Game {
    constructor(dimensions = 10, difficulty = 1) {
        const maximumAllowedMines = dimensions * dimensions - 9
        window.__game = this
        this.dimensions = dimensions

        this.mineCount = Math.floor(
            dimensions * difficulty <= maximumAllowedMines ? dimensions * difficulty : maximumAllowedMines
        )

        this.gameCreated = true
        this.gameStarted = false

        // Fill with empty objects
        this.fields = new Array(dimensions).fill({})
        window.__fields = this.fields
        this.fields.forEach((field, index) => {
            this.fields[index] = new Array(dimensions).fill({})
        })
    }

    startGame(x, y) {
        this.startingPoint = [x, y]
        // Fill field with mines
        for (let i = 0; i < this.mineCount; i++) {
            const [randomX, randomY] = this.getRandomFreeField()
            this.fields[randomX][randomY] = { hasMine: true }
        }

        this.gameStarted = true
    }

    sleep() {
        return new Promise(resolve => setTimeout(resolve, 2000))
    }

    canPlaceMine(x, y) {
        const [startX, startY] = this.startingPoint
        const isStartingPoint = x === startX && y === startY
        const isAroundStartingPoint = getFieldsToCheck(startX, startY).some(([_x, _y]) => {
            return x == _x && y == _y
        })
        const hasMine = this.fields[x][y].hasMine === true

        return !isAroundStartingPoint && !hasMine && !isStartingPoint
    }

    getRandomFreeField() {
        let randomX, randomY
        do {
            randomX = Math.floor(Math.random() * this.dimensions)
            randomY = Math.floor(Math.random() * this.dimensions)
        } while (!this.canPlaceMine(randomX, randomY))

        return [randomX, randomY]
    }

    getFlaggedFields() {
        return this.fields.flat().filter(field => field.isFlagged)
    }

    getReveiledFields() {
        return this.fields.flat().filter(field => field.isReveiled)
    }

    getMineCount() {
        return this.mineCount
    }

    isGameWon() {
        return (
            this.getReveiledFields().length + this.getFlaggedFields().length === this.dimensions * this.dimensions &&
            this.getMineCount() - this.getFlaggedFields().length === 0
        )
    }

    isGameOver() {
        return this.getReveiledFields().filter(field => field.hasMine).length > 0
    }

    isGameStarted() {
        return this.gameStarted
    }

    isGameCreated() {
        return this.gameCreated
    }

    // Calculate how many neighbor fields have mines
    getHint(x, y) {
        const fieldsToCheck = getFieldsToCheck(x, y)

        const neighborsWithMine = fieldsToCheck.reduce(
            (accumulator, [x, y]) => accumulator + (this.getField(x, y) && this.getField(x, y).hasMine ? 1 : 0),
            0
        )

        return neighborsWithMine
    }

    reveal(x, y) {
        if (!this.gameStarted) this.startGame(x, y)

        const hint = this.getHint(x, y)
        this.fields[x][y] = { ...this.fields[x][y], isReveiled: true, hint }
        const fieldsToCheck = getFieldsToCheck(x, y)

        if (hint === 0) {
            fieldsToCheck.forEach(([x, y]) => {
                const field = this.getField(x, y)
                if (field !== null && !field.isReveiled && !field.hasMine) {
                    this.reveal(x, y)
                }
            })
        }
        return this.fields[x][y]
    }

    resolve() {
        this.fields.forEach((rowField, rowFieldIndex) => {
            rowField.forEach((columnField, columnFieldIndex) => {
                const hint = this.getHint(columnFieldIndex, rowFieldIndex)
                this.fields[columnFieldIndex][rowFieldIndex] = {
                    ...this.fields[columnFieldIndex][rowFieldIndex],
                    isReveiled: true,
                    hint
                }
            })
        })
    }

    flag(x, y) {
        if (!this.fields[x][y].isReveiled) {
            this.fields[x][y] = { ...this.fields[x][y], isFlagged: true }
        }
        return this.fields[x][y]
    }

    unflag(x, y) {
        this.fields[x][y] = { ...this.fields[x][y], isFlagged: false }
        return this.fields[x][y]
    }

    toggleFlag(x, y) {
        this.fields[x][y].isFlagged ? this.unflag(x, y) : this.flag(x, y)
    }

    getField(x, y) {
        if (x >= 0 && x < this.dimensions && y >= 0 && y < this.dimensions) {
            return this.fields[x][y]
        } else {
            return null
        }
    }
}

export { Game }
