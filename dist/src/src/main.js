// main.js - Initialize and start game
import { GameEngine } from './GameEngine.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('gameCanvas');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Create and initialize game
  const game = new GameEngine(canvas);
  await game.init();

  // Make game accessible for debugging
  window.game = game;
});
