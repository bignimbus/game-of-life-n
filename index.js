/*
Conway's game of life
Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by over-population.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

'use strict';

const setGlobals = (obj) => {
  global.SIZE = obj.size || 4;
  global.DIMENSIONS = obj.dimensions || 2;
  global.PLANE_SIZE = Math.pow(obj.size, obj.dimensions);
};

const region = require('./grid').region,
  rules = require('./rules'),
  stayAlive = rules.stayAlive,
  becomeAlive = rules.becomeAlive;

const populate = (points) => {
  let plane = new Array(global.PLANE_SIZE).fill(0);
  (points || []).forEach((point) => {
    plane[point] = 1;
  });
  return plane;
};

const compareNeighbors = (localState, point, plane) => {
  let sum = 0,
    method = localState ? stayAlive : becomeAlive;
  for (let n of region(point)) {
    sum += plane[n];
  }
  return Number(method(sum));
};

const increment = (plane) => {
  let state = new Array(global.PLANE_SIZE);
  plane.forEach((localState, point) => {
    let isAlive = compareNeighbors(localState, point, plane);
    state[point] = isAlive;
  });
  return state;
};

const loop = function * (globals, arr) {
  setGlobals(globals);
  let plane = populate(arr);
  for (let n = 0; n < 100; n++) {
    plane = increment(plane);
    yield plane;
  }
};

const gameFactory = (globals, arr) => loop(globals, arr);

module.exports = gameFactory;

