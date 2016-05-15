# Game of Life<sup>n</sup>

## About
This is a framework for expressing Conway's Game of Life in an n-cube of arbitrary size.  Game of Life<sup>n</sup> started as an exercise in functional programming using ES2015 inspired by Reginald Braithwaite's _JavaScript Allongé_.  The exercise was more engaging than I expected, and it led to some interesting questions about how to best express certain data structures in JavaScript.

## New Game
The Game of Life<sup>n</sup> module exports a generator function.  The function accepts two optional arguments.  The first argument is an object indicating the size and dimensions of the game field.  The second argument is a comma-separated list of points that represent which cells are "alive" at the start of the game.

```js
const {gameFactory} = require('game-of-life-n');
let game = gameFactory({
  size: 4, // length of each side of the square, cube or hypercube
  dimensions: 2 // number of spatial dimensions; 2 = square, 3 = cube, 4+ = hypercube
}, 0, 1, 2, 3);
```

## Game State
JavaScript does not support true multidimensional arrays, so Game of Life<sup>n</sup> uses a single array to represent the game state.  This array is one-dimensional and contains `0`s and `1`s.  `1` represents a live cell, and `0` represents a dead cell.

The actual game object is a generator, to be used like so:

```js
let game = gameFactory({
  size: 4,
  dimensions: 2
}, 0, 1, 2, 5, 6, 7, 8, 9, 14);

/* 
The first value represents the initial game state.  Note that the cells
that are alive match the indices specified in the arguments.
*/
game.next().value;
/*
[
  1, 1, 1, 0,
  0, 1, 1, 1,
  1, 1, 0, 0,
  0, 0, 1, 0
]
*/

game.next().value;
/*
[
  1, 0, 0, 1,
  0, 0, 0, 1,
  1, 0, 0, 1,
  0, 1, 0, 0
]
*/

game.next().value;
/*
[
  0, 0, 0, 0,
  0, 0, 1, 1,
  0, 0, 1, 0,
  0, 0, 0, 0
]
*/

// etc.
```

## Grid Conventions
A single array can effectively represent multidimensional space in Game of Life<sup>n</sup> by using arithmetic to look up coordinates.  In a game of 3 dimensions with length 3, the point at coordinates (0, 0, 0) is stored at Array[0].  Point (0, 0, 1) is stored at Array[18].  See `./lib/grid.js` for a more detailed look at the arithmetic that powers the grid system.

## toCoord Function
In order to translate any array index into an array of cartesian coordinates, use the `toCoord` function.  This may assist you if you are interfacing with graphing libraries.

```js
const gameOfLifeN = require('game-of-life-n'),
  {gameFactory} = gameOfLifeN,
  {toCoord} = gameOfLifeN;

let game = gameFactory({
  size: 3,
  dimensions: 3
}, 0, 1, 2, 3);

toCoord(11);
// returns [2, 0, 1]
// where x = 2, y = 0, z = 1
```
