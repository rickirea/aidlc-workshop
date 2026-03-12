// AudioManager.js - Audio playback with lazy loading
export class AudioManager {
  constructor() {
    this.jumpSound = null;
    this.gameOverSound = null;
    this.audioLoaded = false;
  }

  async loadAudio() {
    try {
      this.jumpSound = new Audio('assets/jump.wav');
      this.gameOverSound = new Audio('assets/game_over.wav');

      // Preload audio
      await Promise.all([this.jumpSound.load(), this.gameOverSound.load()]);

      this.audioLoaded = true;
    } catch (error) {
      console.error('Failed to load audio:', error);
      this.audioLoaded = false;
    }
  }

  playJump() {
    if (this.audioLoaded && this.jumpSound) {
      this.jumpSound.currentTime = 0;
      this.jumpSound
        .play()
        .catch((e) => console.error('Jump sound failed:', e));
    }
  }

  playGameOver() {
    if (this.audioLoaded && this.gameOverSound) {
      this.gameOverSound.currentTime = 0;
      this.gameOverSound
        .play()
        .catch((e) => console.error('Game over sound failed:', e));
    }
  }
}
