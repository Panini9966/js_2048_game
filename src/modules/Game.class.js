'use strict';

class Game {
  constructor(initialState) {
    this.initialState = (
      initialState ?? Array.from({ length: 4 }, () => [0, 0, 0, 0])
    ).map((stateRow) => [...stateRow]);
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  copyState(state) {
    return state.map((stateRow) => [...stateRow]);
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((currentRow, rowIndex) => {
      currentRow.forEach((value, columnIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [row, column] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][column] = Math.random() < 0.1 ? 4 : 2;
  }

  mergeLine(line) {
    const values = line.filter((value) => value !== 0);
    const merged = [];

    for (let index = 0; index < values.length; index++) {
      if (values[index] === values[index + 1]) {
        const value = values[index] * 2;

        merged.push(value);
        this.score += value;
        index++;
      } else {
        merged.push(values[index]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const previousState = JSON.stringify(this.state);
    const reversed = direction === 'right' || direction === 'down';
    const vertical = direction === 'up' || direction === 'down';

    for (let lineIndex = 0; lineIndex < 4; lineIndex++) {
      const line = [];

      for (let position = 0; position < 4; position++) {
        const row = vertical ? position : lineIndex;
        const column = vertical ? lineIndex : position;

        line.push(this.state[row][column]);
      }

      if (reversed) {
        line.reverse();
      }

      const result = this.mergeLine(line);

      if (reversed) {
        result.reverse();
      }

      for (let position = 0; position < 4; position++) {
        const row = vertical ? position : lineIndex;
        const column = vertical ? lineIndex : position;

        this.state[row][column] = result[position];
      }
    }

    if (previousState === JSON.stringify(this.state)) {
      return false;
    }

    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  updateStatus() {
    if (this.state.flat().some((value) => value >= 2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.flat().some((value) => value === 0);
    let hasMerge = false;

    for (let row = 0; row < 4 && !hasMerge; row++) {
      for (let column = 0; column < 4 && !hasMerge; column++) {
        const value = this.state[row][column];

        hasMerge =
          value !== 0 &&
          (value === this.state[row][column + 1] ||
            value === this.state[row + 1]?.[column]);
      }
    }

    this.status = hasEmptyCell || hasMerge ? 'playing' : 'lose';
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.updateStatus();
  }

  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
