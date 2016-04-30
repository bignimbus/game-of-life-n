'use strict';

const {region} = require('./grid'),
  rules = require('./rules'),
  {stayAlive} = rules,
  {becomeAlive} = rules;

const setGlobals = (obj = {}) => {
  global.SIZE = obj.size || 4;
  global.DIMENSIONS = obj.dimensions || 2;
  global.PLANE_SIZE = Math.pow(global.SIZE, global.DIMENSIONS);
};

const populate = (points = []) => {
  let plane = new Array(global.PLANE_SIZE).fill(0);
  points.forEach((point) => {
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

const gameLoop = function * (globals, arr) {
  setGlobals(globals);
  let plane = populate(arr);
  while (true) {
    plane = increment(plane);
    yield plane;
  }
};

module.exports = {
  setGlobals,
  populate,
  compareNeighbors,
  increment,
  gameLoop
};

