'use strict';

// jumps {unit} units across {dimension} axis from point {coord}
const transform = (coord, dimension, unit) => {
  let shift = dimension === 0 && !unit ? 0 : Math.pow(global.SIZE, dimension);
  return coord + (unit || 0) * shift;
};

const inBounds = (num) => {
  return num < Math.pow(global.SIZE, global.DIMENSIONS) && num >= 0;
};

// iterates across all existing points on the
// {dimension}-axis in the line intersecting point {coord}
const axis = function * (coord, dimension) {
  for (let n = global.SIZE * -1; n < global.SIZE; n++) {
    let c = transform(coord, dimension, n);
    if (inBounds(c)) yield c;
  }
};


// iterates over all existing points
// within {bound} units of point {coord} across
// {dimension}-axis
const segmentIterator = function * (dimension, bound, coord) {
  for (let n = 0 - bound; n <= bound; n++) {
    yield transform(coord, dimension, n);
  }
};

const segment = function * (dimension, bound, coord) {
  let a = [...axis(coord, dimension)],
    s = [...segmentIterator(dimension, bound, coord)];
  for (let n of s.filter((num) => a.indexOf(num) !== -1)) {
    yield n;
  }
};

// returns all the points within {bound} points
// of {coord} on all axes
const region = function * (bound, coord, dimension) {
  if (dimension === global.DIMENSIONS) {
    if (inBounds(coord)) yield coord;
    return;
  }
  for (let n of segment(dimension, bound, coord)) {
    yield * region(bound, n, dimension + 1);
  }
};

// do not return the same coordinate as the origin
const gate = function * (iterator, bounds, coord) {
  for (let n of iterator(bounds, coord, 0)) {
    if (n !== coord) yield n;
  }
};

// for each point in the grid, return an iterator for its neighbors
const grid = function * (plane) {
  let iterator = gate.bind(null, region, 1);
  for (let n of plane) {
    yield iterator(n);
  }
};

module.exports = {
  grid: grid,
  gate: gate,
  region: gate.bind(null, region, 1),
  segment: segment,
  segmentIterator: segmentIterator,
  axis: axis,
  inBounds: inBounds,
  transform: transform
};

