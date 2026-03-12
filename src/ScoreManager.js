// ScoreManager.js - Score tracking and persistence
export class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.highScore = 0;
    this.storageKey = 'flappyKiroHighScore';
    this.storageAvailable = true;
    this.loadHighScore();
  }

  incrementScore() {
    this.currentScore++;
  }

  addPoints(points) {
    this.currentScore += points;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  getHighScore() {
    return this.highScore;
  }

  updateHighScore() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.saveHighScore();
    }
  }

  reset() {
    this.currentScore = 0;
  }

  loadHighScore() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.highScore = stored ? parseInt(stored, 10) : 0;
      this.storageAvailable = true;
    } catch (error) {
      console.warn('localStorage unavailable:', error);
      this.highScore = 0;
      this.storageAvailable = false;
    }
  }

  saveHighScore() {
    if (!this.storageAvailable) return;

    try {
      localStorage.setItem(this.storageKey, this.highScore.toString());
    } catch (error) {
      console.error('Failed to save high score:', error);
      this.storageAvailable = false;
    }
  }
}
