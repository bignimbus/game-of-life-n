'use strict';

const grid = require('../lib/grid');

const stubGrid = (obj) => {
  obj = obj || {};
  global.SIZE = obj.size || 4;
  global.DIMENSIONS = obj.dimensions || 4;
  global.PLANE_SIZE = Math.pow(global.SIZE, global.DIMENSIONS);
};

describe('grid functions', () => {
  it('should be imported as an object', () => {
    expect(typeof grid).toBe('object');
  });

  describe('transform', () => {
    let {transform} = grid;
    it('given a point, axis, and multiple, returns the array index that represents a transformation across {axis} {multiple} points away from {point}', () => {
      stubGrid();
      expect(transform(0, 0, 0)).toBe(0);
      expect(transform(0, 1, 0)).toBe(0);
      expect(transform(0, 1, 1)).toBe(4);
      expect(transform(0, 2, 1)).toBe(16);
      expect(transform(0, 3, 1)).toBe(64);
      expect(transform(0, 3, -1)).toBe(-64);
      expect(transform(1, 3, -1)).toBe(-63);
    });
  });

  describe('inBounds', () => {
    let {inBounds} = grid;
    it('given a point, returns a boolean indicating whether that point exists on the plane', () => {
      stubGrid();
      expect(inBounds(0)).toBe(true);
      expect(inBounds(-1)).toBe(false);
      expect(inBounds(255)).toBe(true);
      expect(inBounds(256)).toBe(false);
    });
  });

  describe('getAxisOrigin', () => {
    let {getAxisOrigin} = grid;
    it('finds the point that forms a line segment with {point} that intersects with the origin of {ax} axis', () => {
      stubGrid();
    });
  });

  describe('axis', () => {
    let {axis} = grid;
    it('given an axis and point, iterates over all points on that axis that could exist and intersect with {point}', () => {
      stubGrid();
      expect([...axis(0, 0)]).toEqual([0, 1, 2, 3]);
      expect([...axis(0, 1)]).toEqual([0, 4, 8, 12]);
      expect([...axis(0, 2)]).toEqual([0, 16, 32, 48]);
      expect([...axis(0, 3)]).toEqual([0, 64, 128, 192]);
      expect([...axis(1, 3)]).toEqual([1, 65, 129, 193]);
      expect([...axis(3, 0)]).toEqual([0, 1, 2, 3]);
      expect([...axis(192, 0)]).toEqual([192, 193, 194, 195]);
      expect([...axis(192, 1)]).toEqual([192, 196, 200, 204]);
      expect([...axis(255, 0)]).toEqual([252, 253, 254, 255]);
    });
  });

  describe('possibleSegment', () => {
    let {possibleSegment} = grid;
    it('given an axis, point and bound, iterates over all existing or non-existant points on that axis within {bound} units of {point}', () => {
      stubGrid();
      expect(possibleSegment(0, 1, 1, -1)).toEqual([0, 1, 2]);
      expect(possibleSegment(0, 3, 1, -1)).toEqual([2, 3, 4]);
      expect(possibleSegment(0, 3, 2, -2)).toEqual([1, 2, 3, 4, 5]);
      expect(possibleSegment(1, 0, 1, -1)).toEqual([-4, 0, 4]);
      expect(possibleSegment(0, 255, 1, -1)).toEqual([254, 255, 256]);
      expect(possibleSegment(0, 4, 1, -1)).toEqual([3, 4, 5]);
    });
  });

  describe('segment', () => {
    let {segment} = grid;
    it('given an axis, point and bound, returns all existing points on that axis within {bound} units of {point} and the corresponding index of the line segment', () => {
      stubGrid();
      expect(segment(0, 0, 1, -1)).toEqual([[0, 0], [1, 1]]);
      expect(segment(0, 1, 1, -1)).toEqual([[0, -1], [1, 0], [2, 1]]);
      expect(segment(0, 3, 1, -1)).toEqual([[2, -1], [3, 0]]);
      expect(segment(0, 3, 2, -2)).toEqual([[1, -1], [2, 0], [3, 1]]);
      expect(segment(1, 0, 1, -1)).toEqual([[0, 0], [4, 1]]);
      expect(segment(0, 255, 1, -1)).toEqual([[254, -1], [255, 0]]);
      expect(segment(0, 4, 1, -1)).toEqual([[4, 0], [5, 1]]);
    });
  });

  describe('gate', () => {
    let {gate} = grid;
    function * testIterator () {
      for (let n = 0; n < 4; n++) {
        yield n;
      }
    }
    it('given an iterator and a point, returns an iterator without that point', () => {
      expect([...testIterator()]).toEqual([0, 1, 2, 3]);
      expect([...gate(testIterator, 1)]).toEqual([0, 2, 3]);
    });
  });

  describe('region', () => {
    let {region} = grid;
    it('given a bound and a point, iterates over all points {bound} or fewer units away', () => {
      stubGrid({size: 4, dimensions: 2});
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 4, 5]);
      expect([...region(1)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 2, 4, 5, 6]);
      expect([...region(2)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 3, 5, 6, 7]);
      expect([...region(3)].sort((a, b) => a > b ? 1 : -1)).toEqual([2, 6, 7]);
      expect([...region(5)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 1, 2, 4, 6, 8, 9, 10]);

      stubGrid({size: 3, dimensions: 3});
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 3, 4, 9, 10, 12, 13]);
      expect([...region(13)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
      expect([...region(26)].sort((a, b) => a > b ? 1 : -1)).toEqual([13, 14, 16, 17, 22, 23, 25]);

      stubGrid({size: 4, dimensions: 4});
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 4, 5, 16, 17, 20, 21, 64, 65, 68, 69, 80, 81, 84, 85]);
      expect([...region(149)].sort((a, b) => a > b ? 1 : -1)).toEqual([
        64, 65, 66, 68, 69, 70, 72, 73, 74,
        80, 81, 82, 84, 85, 86, 88, 89, 90,
        96, 97, 98, 100, 101, 102, 104, 105, 106,
        128, 129, 130, 132, 133, 134, 136, 137, 138,
        144, 145, 146, 148, 150, 152, 153, 154,
        160, 161, 162, 164, 165, 166, 168, 169, 170,
        192, 193, 194, 196, 197, 198, 200, 201, 202,
        208, 209, 210, 212, 213, 214, 216, 217, 218,
        224, 225, 226, 228, 229, 230, 232, 233, 234
      ]);
    });
  });
});
