import '../styles/index.scss'
import '@fortawesome/fontawesome-free/js/all'

import { Game } from './Game'

const gameElement = document.getElementById('game')
const boardElement = document.getElementById('board')
const boardStatus = document.getElementById('boardStatus')
const newGameButton = document.getElementById('newGameButton')
const dimensionInput = document.getElementById('dimensionInput')
const minesLeftHeader = document.getElementById('minesLeftHeader')
const minesLeftText = document.getElementById('minesLeft')
const gameStartHeader = document.getElementById('game-start')

let game

console.log('🔥 Build with love by Marc Backes 🔥')
console.log('   👉 Website: https://marc.dev')
console.log('   👉 Twitter: https://twitter.com/_marcba')
console.log('   👉 Codepen: https://codepen.io/_marcba')
console.log('   👉 Github: https://github.com/themarcba')

const revealField = (x, y) => {
    game.reveal(x, y)
    if (game.isGameOver()) {
        gameOver()
    }
}

const toggleFlagField = (x, y) => {
    game.toggleFlag(x, y)
    updateUI()
}

const gameOver = () => {
    gameElement.classList.add('over')
    game.resolve()
}

const gameWon = () => {
    gameElement.classList.add('won')
}

const newGame = () => {
    if (dimensionInput.value < 5) return alert('There must be at least a field dimension of 5')

    const level = document.querySelector('input[name="level"]:checked').value

    gameElement.classList.remove('over')
    gameElement.classList.remove('won')

    const dimensions = parseInt(dimensionInput.value)
    game = new Game(dimensions, level)
    boardElement.style.gridTemplateColumns = `repeat(${dimensions}, 1fr)`

    boardElement.innerHTML = ''

    // Create initial fields
    game.fields.forEach((rowField, rowFieldIndex) => {
        rowField.forEach((columnField, columnFieldIndex) => {
            // Create field
            let newField = document.createElement('div')
            newField.id = `field_${rowFieldIndex}_${columnFieldIndex}`
            newField.className = 'field'

            // Left click on field
            newField.addEventListener('click', ev => {
                revealField(rowFieldIndex, columnFieldIndex)
                updateUI()
            })

            // Right click on field
            newField.addEventListener('contextmenu', ev => {
                ev.preventDefault()
                toggleFlagField(rowFieldIndex, columnFieldIndex)
                updateUI()
            })

            boardElement.appendChild(newField)
        })
    })

    updateUI()
}
const updateUI = () => {
    minesLeftText.innerText = game.getMineCount() - game.getFlaggedFields().length
    game.fields.forEach((rowField, rowFieldIndex) => {
        rowField.forEach((columnField, columnFieldIndex) => {
            const fieldElement = document.getElementById(`field_${rowFieldIndex}_${columnFieldIndex}`)
            const field = game.getField(rowFieldIndex, columnFieldIndex)

            if (field.isReveiled) {
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

const attachEvents = () => {
    newGameButton.addEventListener('click', newGame)
}

attachEvents()
