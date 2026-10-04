'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cell = cells[rowIndex * 4 + columnIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreElement.textContent = game.getScore();

  const updateStatus = game.getStatus();

  startMessage.classList.toggle('hidden', updateStatus !== 'idle');
  winMessage.classList.toggle('hidden', updateStatus !== 'win');
  loseMessage.classList.toggle('hidden', updateStatus !== 'lose');
}

render();

const startButton = document.querySelector('.button.start');

function showRestartButton() {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
    showRestartButton();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };
  const move = moves[e.key];

  if (!move) {
    return;
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();

  if (move()) {
    showRestartButton();
  }

  render();
});
