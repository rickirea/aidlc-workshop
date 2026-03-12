// UIManager.js - UI screen management
export class UIManager {
  constructor() {
    this.playButton = document.getElementById('playButton');
    this.restartButton = document.getElementById('restartButton');
  }

  updateUI(state) {
    if (state === 'START') {
      this.showStartScreen();
    } else if (state === 'PLAYING') {
      this.showGameScreen();
    } else if (state === 'GAME_OVER') {
      this.showGameOverScreen();
    }
  }

  showStartScreen() {
    if (this.playButton) {
      this.playButton.style.display = 'block';
    }
    if (this.restartButton) {
      this.restartButton.style.display = 'none';
    }
  }

  showGameScreen() {
    if (this.playButton) {
      this.playButton.style.display = 'none';
    }
    if (this.restartButton) {
      this.restartButton.style.display = 'none';
    }
  }

  showGameOverScreen() {
    if (this.playButton) {
      this.playButton.style.display = 'none';
    }
    if (this.restartButton) {
      this.restartButton.style.display = 'block';
    }
  }
}
