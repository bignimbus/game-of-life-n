/*
 * The grid we use is a 1-dimensional array.  Using arithmetic via the transform function,
 * this array can represent an n-cubic plane of arbitrary size.
 * Ex: a 3-cube (l = 3) would be represented by an array of length 27 (3 ^ 3).
 * Array[9] would represent the coordinate (0, 0, 1)
 */

'use strict';

// jumps {multiple} units across {ax} axis from {point}
// ex: in a representation of a cube (l = 3): transform(0, 1, 1) means to return the point
// from (0, 0, 0) that is 1 unit away across the second (y) axis.  transform(0, 1, 1) === 3,
// which can be expressed as coordinate (0, 1, 0)
const transform = (point, ax, multiple) => {
  let shift = ax === 0 && !multiple ? 0 : Math.pow(global.SIZE, ax);
  return point + (multiple || 0) * shift;
};

// translates index {point} into cartesian coordinates
// to facilitate interfacting with graphing libraries
const toCoord = (point, arr = []) => {
  if (arr.length === global.DIMENSIONS) return arr;
  let num,
    exponent = Math.abs(arr.length - global.DIMENSIONS + 1),
    floor = Math.pow(global.SIZE, exponent);
  if (point < floor) {
    num = 0;
  } else {
    num = Math.floor(point / floor);
  }
  return toCoord(point - num * floor, [num].concat(arr));
};

const inBounds = (num) => {
  return num < global.PLANE_SIZE && num >= 0;
};

// returns the endpoint of a line segment from {point}
// that intersects with the origin of {ax} axis
const getAxisOrigin = (point, ax) => {
  for (let n = -global.SIZE + 1; n < global.SIZE; n++) {
    let c = transform(point, ax, n);
    if (c % Math.pow(global.SIZE, ax + 1) < Math.pow(global.SIZE, ax)) return n;
  }
};

// returns an array of all points that may exist on the
// {ax} axis in the line intersecting {point}
const axis = (point, ax) => {
  let arr = [];
  for (let n = getAxisOrigin(point, ax); n < global.SIZE; n++) {
    let c = transform(point, ax, n);
    if (inBounds(c)) arr.push(c);
    if (arr.length === global.SIZE) break;
  }
  return arr;
};

const possibleSegment = function (ax, point, upperBound, lowerBound) {
  let arr = [];
  for (let n = lowerBound; n <= upperBound; n++) {
    arr.push(transform(point, ax, n));
  }
  return arr;
};

// slices all common elements between segmentIterator and axis
// to return a segment of points that definitely exist
// within {bound} of {point} along {ax} axis
const finiteSegment = function (ax, point, upperBound, lowerBound) {
  lowerBound = lowerBound || -upperBound;
  let a = axis(point, ax),
    s = possibleSegment(ax, point, upperBound, lowerBound),
    arr = [];
  s.forEach((num, i) => {if (a.indexOf(num) !== -1) arr.push([num, i - 1])});
  return arr;
};

// returns all the points within {bound} points
// of {coord} on all axes
const region = function * (coord, dimension) {
  if (dimension === global.DIMENSIONS) {
    yield coord;
    return;
  }
  for (let n of finiteSegment(dimension, coord, 1, -1)) {
    yield * region(n[0], dimension + 1);
  }
};

// do not return the same coordinate as the origin
const gate = function * (iterator, coord) {
  for (let n of iterator(coord, 0)) {
    if (n !== coord) yield n;
  }
};

module.exports = {
  gate,
  toCoord,
  finiteSegment,
  possibleSegment,
  getAxisOrigin,
  axis,
  inBounds,
  transform,
  region: gate.bind(null, region)
};

