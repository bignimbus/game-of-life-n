/* 
We take the rules of Conway's Game of Life and treat them as proportional.  Since a cell in a 2D Conway's game has up to 8 neighbors, we treat the original rules as a proportion of the orginal grid properties.
*/

'use strict';

const getRatio = (num) => num / (Math.pow(3, global.DIMENSIONS) - 1);

const stayAlive = (ratio) => ratio >= 3 / 16 && ratio < 5 / 16;

const becomeAlive = (ratio) => ratio >= 5 / 16 && ratio < 7 / 16;

module.exports = {
  stayAlive: (num) => stayAlive(getRatio(num)),
  becomeAlive: (num) => becomeAlive(getRatio(num))
};

