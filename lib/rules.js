/* 
Original rules:

1. Any live cell with fewer than two live neighbors dies, as if by under population.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

We take the rules of Conway's Game of Life and treat them as proportional.  Since a cell in a 2D Conway's game has up to 8 neighbors, we treat the n-dimensional rules proportional to the orginal 2-dimensional grid properties.
*/

'use strict';

const getRatio = (num) => num / (Math.pow(3, global.DIMENSIONS) - 1);

const stayAlive = (ratio) => ratio >= 3 / 16 && ratio < 7 / 16;

const becomeAlive = (ratio) => ratio >= 5 / 16 && ratio < 7 / 16;

module.exports = {
  stayAlive: (num) => stayAlive(getRatio(num)),
  becomeAlive: (num) => becomeAlive(getRatio(num))
};

