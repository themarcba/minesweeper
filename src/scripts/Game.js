// Fields that are around a specific field, defined by x, y
const neighborFields = (x, y) => {
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
    // Creates the game, but doesn't initialize the mines yet, because they are placed depending on the first click of the user
    constructor(dimensions = 10, difficulty = 1) {
        // In the worst case, there are mines everywhere, except the first clicked field and it's neighbor fields
        const maximumAllowedMines = dimensions * dimensions - 9

        // Calculate mine count depending on the number field dimensions and difficulty
        this.mineCount = Math.floor(
            dimensions * difficulty <= maximumAllowedMines ? dimensions * difficulty : maximumAllowedMines
        )

        this.dimensions = dimensions
        this.gameCreated = true

        // Initialize fields, fill them with empty objects
        this.fields = new Array(dimensions).fill({})
        window.__fields = this.fields
        this.fields.forEach((field, index) => {
            this.fields[index] = new Array(dimensions).fill({})
        })
    }

    // When the user makes their first click, the game starts
    // The positioning of the mines is determined based on this first clicked field position
    startGame(x, y) {
        this.startingPoint = [x, y]
        this.gameStarted = true

        // Set mines within the field
        for (let i = 0; i < this.mineCount; i++) {
            const [randomX, randomY] = this.getRandomFreeField()
            this.fields[randomX][randomY] = { hasMine: true }
        }
    }

    // Determines if a mine can be placed on the given position
    // Reasons for not being able to place a mine
    //  - It's the first clicked field
    //  - It's one of the neigboring fields of the first clicked field
    //  - There is already a mine on that field
    canPlaceMine(x, y) {
        const [startX, startY] = this.startingPoint

        // Is it the first clicked field?
        const isStartingPoint = x === startX && y === startY

        // Is it a neighboring field?
        const isNeighboringField = neighborFields(startX, startY).some(([_x, _y]) => {
            return x == _x && y == _y
        })

        // Does it already have a mine?
        const hasAlreadyMine = this.fields[x][y].hasMine === true

        return !isNeighboringField && !hasAlreadyMine && !isStartingPoint
    }

    // Generate a random field. Generate random field positions until a valid field is found (determined by canPlaceMine)
    getRandomFreeField() {
        let randomX, randomY
        // Repeat until valid field
        do {
            randomX = Math.floor(Math.random() * this.dimensions)
            randomY = Math.floor(Math.random() * this.dimensions)
        } while (!this.canPlaceMine(randomX, randomY))

        return [randomX, randomY]
    }

    // Returns a list of flagged fields
    getFlaggedFields() {
        return this.fields.flat().filter(field => field.isFlagged)
    }

    // Returns a list of revealed fields
    getRevealedFields() {
        return this.fields.flat().filter(field => field.isRevealed)
    }

    // Returns the number of mines placed in the field
    getMineCount() {
        return this.mineCount
    }

    // Returns whether the game is won.
    // A game is won when both is true:
    //  - All non-mined fields are revealed
    //  - All mined fields are flagged
    isGameWon() {
        const nonMinedFields = this.fields.flat().filter(field => !field.hasMine)
        const minedFields = this.fields.flat().filter(field => field.hasMine)

        return nonMinedFields.every(field => field.isRevealed) && minedFields.every(field => field.isFlagged)
    }

    // Returns when the game is list
    // A game is lost when a mine has been revealed
    isGameOver() {
        return this.getRevealedFields().filter(field => field.hasMine).length > 0
    }

    // Returns if the game has been initialized
    isGameCreated() {
        return this.gameCreated
    }

    // Calculates how many neighbor fields have mines
    getHint(x, y) {
        const neighborsWithMine = neighborFields(x, y).reduce(
            (accumulator, [x, y]) => accumulator + (this.getField(x, y) && this.getField(x, y).hasMine ? 1 : 0),
            0
        )
        return neighborsWithMine
    }

    // Reveals a field
    //  - Sets the revealed status to the field (isRevealed)
    //  - If the field is not neighboring a mine, recursively reveal the surrounding fields
    reveal(x, y) {
        // If the game has not already been started, it gets started (first click)
        if (!this.gameStarted) this.startGame(x, y)

        const hint = this.getHint(x, y)
        this.fields[x][y] = { ...this.fields[x][y], isRevealed: true, hint }

        // This is the stop-condition for the recursive call
        if (hint === 0) {
            // Check all neighboring fields
            neighborFields(x, y).forEach(([x, y]) => {
                const field = this.getField(x, y)
                // Reveal if the field exists, is not revealed yet and has no mine
                if (field !== null && !field.isRevealed && !field.hasMine) {
                    this.reveal(x, y)
                }
            })
        }
        return this.fields[x][y]
    }

    // Resolve the entire game. All fields are being revealed
    resolve() {
        this.fields.forEach((rowField, rowFieldIndex) => {
            rowField.forEach((columnField, columnFieldIndex) => {
                const hint = this.getHint(columnFieldIndex, rowFieldIndex)
                this.fields[columnFieldIndex][rowFieldIndex] = {
                    ...this.fields[columnFieldIndex][rowFieldIndex],
                    isRevealed: true,
                    hint
                }
            })
        })
    }

    // Flag a field. (Set the isFlagged property)
    flag(x, y) {
        if (!this.fields[x][y].isRevealed) {
            this.fields[x][y] = { ...this.fields[x][y], isFlagged: true }
        }
        return this.fields[x][y]
    }

    // Unflag a field. Opposite of flag()
    unflag(x, y) {
        this.fields[x][y] = { ...this.fields[x][y], isFlagged: false }
        return this.fields[x][y]
    }

    // Toggle the flagged-status of a field
    toggleFlag(x, y) {
        this.fields[x][y].isFlagged ? this.unflag(x, y) : this.flag(x, y)
    }

    // Return a field with the given position
    getField(x, y) {
        // Only return a field if it's in bounds
        if (x >= 0 && x < this.dimensions && y >= 0 && y < this.dimensions) {
            return this.fields[x][y]
        }
        // Return null if it doesn't exist (out of bounds)
        else {
            return null
        }
    }
}

export { Game }
