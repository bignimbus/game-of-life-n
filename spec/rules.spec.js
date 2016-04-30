'use strict';

const rules = require('../lib/rules');

describe('rules', () => {
  describe('stayAlive', () => {
    let stayAlive = rules.stayAlive;
    it('should return true if the given number / dimensions is >= 3/16 and < 7/16', () => {
      global.DIMENSIONS = 2;
      expect(stayAlive(1)).toBe(false);
      expect(stayAlive(2)).toBe(true);
      expect(stayAlive(3)).toBe(true);
      expect(stayAlive(4)).toBe(false);

      global.DIMENSIONS = 3;
      expect(stayAlive(4)).toBe(false);
      expect(stayAlive(5)).toBe(true);
      expect(stayAlive(11)).toBe(true);
      expect(stayAlive(12)).toBe(false);

      global.DIMENSIONS = 4;
      expect(stayAlive(14)).toBe(false);
      expect(stayAlive(15)).toBe(true);
      expect(stayAlive(34)).toBe(true);
      expect(stayAlive(35)).toBe(false);
    });
  });

  describe('becomeAlive', () => {
    let becomeAlive = rules.becomeAlive;
    it('should return true if the given number / dimensions is >= 5/16 and < 7/16', () => {
      global.DIMENSIONS = 2;
      expect(becomeAlive(2)).toBe(false);
      expect(becomeAlive(3)).toBe(true);
      expect(becomeAlive(4)).toBe(false);

      global.DIMENSIONS = 3;
      expect(becomeAlive(8)).toBe(false);
      expect(becomeAlive(9)).toBe(true);
      expect(becomeAlive(11)).toBe(true);
      expect(becomeAlive(12)).toBe(false);

      global.DIMENSIONS = 4;
      expect(becomeAlive(24)).toBe(false);
      expect(becomeAlive(25)).toBe(true);
      expect(becomeAlive(34)).toBe(true);
      expect(becomeAlive(35)).toBe(false);
    });
  });
});

