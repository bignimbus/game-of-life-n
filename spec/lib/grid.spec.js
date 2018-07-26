'use strict';

const grid = require('../../lib/grid');

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

  describe('toCoord', () => {
    let {toCoord} = grid;
    it('translates a single point into an array of cartesian coordinates', () => {
      stubGrid({size: 3, dimensions: 3});
      expect(toCoord(0)).toEqual([0, 0, 0]);
      expect(toCoord(3)).toEqual([0, 1, 0]);
      expect(toCoord(9)).toEqual([0, 0, 1]);
      expect(toCoord(10)).toEqual([1, 0, 1]);

      stubGrid({size: 4, dimensions: 4});
      expect(toCoord(0)).toEqual([0, 0, 0, 0]);
      expect(toCoord(1)).toEqual([1, 0, 0, 0]);
      expect(toCoord(4)).toEqual([0, 1, 0, 0]);
      expect(toCoord(16)).toEqual([0, 0, 1, 0]);
      expect(toCoord(64)).toEqual([0, 0, 0, 1]);
      expect(toCoord(68)).toEqual([0, 1, 0, 1]);
      expect(toCoord(69)).toEqual([1, 1, 0, 1]);
      expect(toCoord(70)).toEqual([2, 1, 0, 1]);
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

  describe('finiteSegment', () => {
    let {finiteSegment} = grid;
    it('given an axis, point and bound, returns all existing points on that axis within {bound} units of {point} and the corresponding index of the line segment', () => {
      stubGrid();
      expect(finiteSegment(0, 0, 1, -1)).toEqual([0, 1]);
      expect(finiteSegment(0, 1, 1, -1)).toEqual([0, 1, 2]);
      expect(finiteSegment(0, 3, 1, -1)).toEqual([2, 3]);
      expect(finiteSegment(0, 3, 2, -2)).toEqual([1, 2, 3]);
      expect(finiteSegment(1, 0, 1, -1)).toEqual([0, 4]);
      expect(finiteSegment(0, 255, 1, -1)).toEqual([254, 255]);
      expect(finiteSegment(0, 4, 1, -1)).toEqual([4, 5]);
    });
  });

  describe('infiniteSegment', () => {
    let {infiniteSegment} = grid;
    it('given an axis, point and bound, returns all existing points on that axis within {bound} units of {point} and the corresponding index of the line segment, modulo', () => {
      stubGrid();
      expect(infiniteSegment(0, 0, 1, -1)).toEqual([3, 0, 1]);
      expect(infiniteSegment(0, 1, 1, -1)).toEqual([0, 1, 2]);
      expect(infiniteSegment(0, 3, 1, -1)).toEqual([2, 3, 0]);
      expect(infiniteSegment(0, 3, 2, -2)).toEqual([1, 2, 3, 0]);
      expect(infiniteSegment(1, 0, 1, -1)).toEqual([12, 0, 4]);
      expect(infiniteSegment(0, 255, 1, -1)).toEqual([254, 255, 252]);
      expect(infiniteSegment(0, 4, 1, -1)).toEqual([7, 4, 5]);
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
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 3, 4, 5, 7, 12, 13, 15]);
      expect([...region(1)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 2, 4, 5, 6, 12, 13, 14]);
      expect([...region(2)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 3, 5, 6, 7, 13, 14, 15]);
      expect([...region(3)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 2, 4, 6, 7, 12, 14, 15]);
      expect([...region(5)].sort((a, b) => a > b ? 1 : -1)).toEqual([0, 1, 2, 4, 6, 8, 9, 10]);

      stubGrid({size: 6, dimensions: 3});
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([1, 5, 6, 7, 11, 30, 31, 35, 36, 37, 41, 42, 43, 47, 66, 67, 71, 180, 181, 185, 186, 187, 191, 210, 211, 215]);
      expect([...region(13)].sort((a, b) => a > b ? 1 : -1)).toEqual([6, 7, 8, 12, 14, 18, 19, 20, 42, 43, 44, 48, 49, 50, 54, 55, 56, 186, 187, 188, 192, 193, 194, 198, 199, 200]);
      expect([...region(26)].sort((a, b) => a > b ? 1 : -1)).toEqual([19, 20, 21, 25, 27, 31, 32, 33, 55, 56, 57, 61, 62, 63, 67, 68, 69, 199, 200, 201, 205, 206, 207, 211, 212, 213]);

      stubGrid({size: 8, dimensions: 4});
      expect([...region(0)].sort((a, b) => a > b ? 1 : -1)).toEqual([
        1,
        7,
        8,
        9,
        15,
        56,
        57,
        63,
        64,
        65,
        71,
        72,
        73,
        79,
        120,
        121,
        127,
        448,
        449,
        455,
        456,
        457,
        463,
        504,
        505,
        511,
        512,
        513,
        519,
        520,
        521,
        527,
        568,
        569,
        575,
        576,
        577,
        583,
        584,
        585,
        591,
        632,
        633,
        639,
        960,
        961,
        967,
        968,
        969,
        975,
        1016,
        1017,
        1023,
        3584,
        3585,
        3591,
        3592,
        3593,
        3599,
        3640,
        3641,
        3647,
        3648,
        3649,
        3655,
        3656,
        3657,
        3663,
        3704,
        3705,
        3711,
        4032,
        4033,
        4039,
        4040,
        4041,
        4047,
        4088,
        4089,
        4095,
      ]);
      expect([...region(149)].sort((a, b) => a > b ? 1 : -1)).toEqual([
        76,
        77,
        78,
        84,
        85,
        86,
        92,
        93,
        94,
        140,
        141,
        142,
        148,
        150,
        156,
        157,
        158,
        204,
        205,
        206,
        212,
        213,
        214,
        220,
        221,
        222,
        588,
        589,
        590,
        596,
        597,
        598,
        604,
        605,
        606,
        652,
        653,
        654,
        660,
        661,
        662,
        668,
        669,
        670,
        716,
        717,
        718,
        724,
        725,
        726,
        732,
        733,
        734,
        3660,
        3661,
        3662,
        3668,
        3669,
        3670,
        3676,
        3677,
        3678,
        3724,
        3725,
        3726,
        3732,
        3733,
        3734,
        3740,
        3741,
        3742,
        3788,
        3789,
        3790,
        3796,
        3797,
        3798,
        3804,
        3805,
        3806,
      ]);
    });
  });
});
