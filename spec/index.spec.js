'use strict';

const {gameFactory} = require('../index');
const {toCoord} = require('../index');

describe('Game of Life ^ n', () => {
  it('should export a gameLoop', () => {
    let game = gameFactory({size: 2, dimensions: 2}, [0, 1, 0, 1]);
    expect(game.toString()).toBe('[object Generator]');
  });

  it('should export a toCoord function', () => {
    expect(toCoord).toEqual(jasmine.any(Function));
  });
});

