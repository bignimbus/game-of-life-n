'use strict';

const game = require('../lib/game');

describe('game', () => {
  describe('#setGlobals', () => {
    let {setGlobals} = game;
    afterEach(() => {
      setGlobals();
    });
    it('should set values by default', () => {
      setGlobals();
      expect(global.SIZE).toBe(4);
      expect(global.DIMENSIONS).toBe(2);
    });

    it('should set values passed into the first argument', () => {
      setGlobals({size: 3, dimensions: 3});
      expect(global.SIZE).toBe(3);
      expect(global.DIMENSIONS).toBe(3);
    });
  });

  describe('#populate', () => {
    let {populate} = game;
    it('should accept a list of indices to make "alive"', () => {
      let plane = populate(0, 1, 2);
      expect(plane).toEqual([1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('should treat an empty argument list as an empty array', () => {
      let plane = populate();
      expect(plane).toEqual(new Array(16).fill(0));
    });
  });

  describe('#deadOrAlive', () => {
    let {deadOrAlive} = game;
    beforeEach(() => {
      global.SIZE = 4;
      global.DIMENSIONS = 2;
      global.PLANE_SIZE = Math.pow(global.SIZE, global.DIMENSIONS);
    });
    it('for the cell at {point}, should return a 0 or 1 indicating whether the cell will be dead or alive, respectively, at the next game increment', () => {
      let plane = [
        0, 1, 0, 1,
        1, 0, 0, 1,
        0, 1, 1, 0,
        0, 0, 1, 0
      ];
      expect(deadOrAlive(0, 5, plane)).toBe(0);
      expect(deadOrAlive(0, 8, plane)).toBe(0);
      expect(deadOrAlive(0, 11, plane)).toBe(1);
    });
  });

  describe('#increment', () => {
    let {increment} = game;
    beforeEach(() => {
      global.SIZE = 4;
      global.DIMENSIONS = 2;
      global.PLANE_SIZE = Math.pow(global.SIZE, global.DIMENSIONS);
    });
    it('should not mutate the given array', () => {
      let arr = new Array(global.PLANE_SIZE).fill(0),
        state = increment(arr);
      expect(state).not.toBe(arr);
      expect(state).toEqual(arr);
    });
    it('should return the state of the next tick of Conway\'s Game of Life', () => {
      let plane = [
          0, 1, 0, 1,
          1, 1, 0, 0,
          0, 0, 1, 1,
          0, 0, 0, 0
        ],
        state = increment(plane);
      expect(state).toEqual([
        1, 1, 1, 0,
        1, 1, 0, 1,
        0, 1, 1, 0,
        0, 0, 0, 0
      ]);
    });
  });

  describe('#gameLoop', () => {
    let {gameLoop} = game;
    it('should return a generator', () => {
      expect(gameLoop().toString()).toBe('[object Generator]');
    });
  });
});

