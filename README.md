# MineSweeper Game

A web version of the classic MineSweeper game in a new style with adjustable dimensions and difficulty levels. Minesweeper is a logic-based game where the goal is to unveil all the squares in the grid without clicking on any mines. The numbers represent how many mines are in the adjacent 8 squares which act as clues to help you determine where the mines are. 

Check out the demo here 👉 [minesweeper.marc.dev](https://minesweeper.marc.dev)

## Table of Contents

1. [Installation](#installation)
2. [How to Run the Project](#how-to-run-the-project)
3. [How to Play](#how-to-play)
4. [Preview](#preview)
5. [Features](#features)
6. [Licenses](#licenses)

### Installation

Node.js is required to run this project. 
If you do not have Node.js installed you can visit this link to download it:
https://nodejs.org/en/download/

Navigate to your terminal or powershell.
cd into the location where you would like to download the repository 
Run the following command to clone the repository onto your local machine
```
git clone https://github.com/themarcba/minesweeper.git
```
Alternatively, you can download a zipfile of the code on the github website. 

### How to Run the Project
cd into the location where you stored the repository
then do the following commands:
```
npm install
```

#### Start Dev Server

```
npm start
```

#### Build Prod Version

```
npm run build
```

### How to Play
Start off my choosing the dimensions a.k.a the number of square on each side of the grid in the upper left corner.

Choose your level of difficulty using the emojis which determine the number of mines in the grid.

It ranges from easiest (baby emoji) to hardest (purple devil emoji) from left to right. 

Then click New Game to load the grid with your specifications.

Note: Anytime you change the settings of the game you will have to click new game for the new grid to generate.

Right click on squares you think might be the mine to display a flag.

Good luck! 

### Preview

Start screen

<img width="1440" alt="Screen Shot 2023-02-15 at 11 18 19 PM" src="https://user-images.githubusercontent.com/80373758/219268102-df75b0c8-2baf-4422-99a2-91541f72ee09.png">

Gameplay

<img width="1438" alt="Screen Shot 2023-02-15 at 11 23 35 PM" src="https://user-images.githubusercontent.com/80373758/219268131-2c2d3b6e-3900-4c37-8cb6-f1befa134813.png">

Game over

<img width="1440" alt="Screen Shot 2023-02-15 at 11 19 31 PM" src="https://user-images.githubusercontent.com/80373758/219268144-64ba6dca-1abb-4907-9627-134fe52bbf0f.png">

### Features:

* Flag suspected mine
* Recursively free up free space
* Reveal a field
* 5 levels
* Customizable field size

### Licenses
