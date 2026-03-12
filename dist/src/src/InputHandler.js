// InputHandler.js - Keyboard and button input
export class InputHandler {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard listener
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Button listeners
    const playButton = document.getElementById('playButton');
    const restartButton = document.getElementById('restartButton');

    if (playButton) {
      playButton.addEventListener('click', () => this.handlePlayClick());
    }

    if (restartButton) {
      restartButton.addEventListener('click', () => this.handleRestartClick());
    }
  }

  handleKeyDown(event) {
    if (event.code === 'Space') {
      event.preventDefault();

      const state = this.gameEngine.getState();

      if (state === 'PLAYING') {
        this.gameEngine.player.jump();
        this.gameEngine.audioManager.playJump();
      } else if (state === 'START') {
        this.handlePlayClick();
      }
    }
  }

  handlePlayClick() {
    this.gameEngine.start();
  }

  handleRestartClick() {
    this.gameEngine.restart();
  }
}
