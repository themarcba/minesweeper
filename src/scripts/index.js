import '../styles/index.scss'
import '@fortawesome/fontawesome-free/js/all'

import confetti from 'canvas-confetti'

import { Game } from './Game'

// Elements in the DOM that need to be accessed during the game
const gameElement = document.getElementById('game')
const boardElement = document.getElementById('board')
const boardStatus = document.getElementById('boardStatus')
const newGameButton = document.getElementById('newGameButton')
const dimensionInput = document.getElementById('dimensionInput')
const minesLeftHeader = document.getElementById('minesLeftHeader')
const minesLeftText = document.getElementById('minesLeft')
const gameStartHeader = document.getElementById('game-start')

// The game variable. Here lies all the logic
let game

// Little bit self-promotion never hurt anyone 😉
console.log('🔥 Build with love by Marc Backes 🔥')
console.log('   👉 Website: https://marc.dev')
console.log('   👉 Twitter: https://twitter.com/_marcba')
console.log('   👉 Codepen: https://codepen.io/_marcba')
console.log('   👉 Github: https://github.com/themarcba')

// Reveal a field for the selected position
const revealField = (x, y) => {
    game.reveal(x, y)
    if (game.isGameOver()) {
        gameOver()
    }
}

// Toggle the flag-status on a field for the selected position
const toggleFlagField = (x, y) => {
    game.toggleFlag(x, y)
    updateUI()
}

// When the game is over (lost)
const gameOver = () => {
    gameElement.classList.add('over')
    game.resolve()
}

// When the game has been won
const gameWon = () => {
    gameElement.classList.add('won')
    confetti({
        particleCount: 300,
        spread: 100
    })
}

// Create a new game
const newGame = () => {
    // A 5x5 board is too small for the mine-placing rules in the Game class
    if (dimensionInput.value < 5) return alert('There must be at least a field dimension of 5')

    // Read desired board dimensions from the input field
    const dimensions = parseInt(dimensionInput.value)

    // Get the selected level from the emoji bar (radio buttons) (👶,😎,😐,🥵,😈)
    const level = document.querySelector('input[name="level"]:checked').value

    // Remove winning or losing state of the board
    gameElement.classList.remove('over')
    gameElement.classList.remove('won')

    // Create the Game object which contains all the logic
    game = new Game(dimensions, level)

    // Set CSS size for the board
    boardElement.style.gridTemplateColumns = `repeat(${dimensions}, 1fr)`

    // Empty board, because new elements will be created
    boardElement.innerHTML = ''

    // Create initial field elements
    game.fields.forEach((rowField, rowFieldIndex) => {
        // Rows
        rowField.forEach((columnField, columnFieldIndex) => {
            // Columns

            // Create & initialize a field element
            let newField = document.createElement('div')
            newField.id = `field_${rowFieldIndex}_${columnFieldIndex}`
            newField.className = 'field'

            // Left click event on field (reveal)
            newField.addEventListener('click', ev => {
                revealField(rowFieldIndex, columnFieldIndex)
                updateUI()
            })

            // Right click event on field (flag)
            newField.addEventListener('contextmenu', ev => {
                ev.preventDefault()
                toggleFlagField(rowFieldIndex, columnFieldIndex)
                updateUI()
            })

            // Append created field to board
            boardElement.appendChild(newField)
        })
    })

    // Update the interface!
    updateUI()
}

// Updates the interface
//  - Reads fields and sets CSS classes and content depending on field state
//  - Checks if game is won or lost to display the respective messages
//  - Hides "mines left" indicator when game is over
const updateUI = () => {
    minesLeftText.innerText = game.getMineCount() - game.getFlaggedFields().length
    game.fields.forEach((rowField, rowFieldIndex) => {
        rowField.forEach((columnField, columnFieldIndex) => {
            const fieldElement = document.getElementById(`field_${rowFieldIndex}_${columnFieldIndex}`)
            const field = game.getField(rowFieldIndex, columnFieldIndex)

            if (field.isRevealed) {
                fieldElement.className = 'reveiled field'
                if (field.hasMine) {
                    fieldElement.classList = 'mine field'
                    fieldElement.innerHTML = '<i class="fas fa-bomb"></i>'
                } else if (field.hint) {
                    fieldElement.innerHTML = field.hint
                } else {
                    fieldElement.innerHTML = ''
                }
            } else if (field.isFlagged) {
                fieldElement.classList = 'flagged field'
                fieldElement.innerHTML = '<i class="fas fa-flag"></i>'
            } else {
                fieldElement.innerHTML = ''
            }
        })
    })

    if (game.isGameWon()) {
        gameWon()
    }

    boardStatus.style.display = game.isGameCreated() ? 'block' : 'none'
    minesLeftHeader.style.display = game.isGameCreated() && !game.isGameWon() & !game.isGameOver() ? 'block' : 'none'
    gameStartHeader.style.display = game.isGameCreated() ? 'none' : 'block'
}

// Add event listeners
const attachEvents = () => {
    // "New Game" Button
    newGameButton.addEventListener('click', newGame)
}

attachEvents()
