// GameEngine.js - Central orchestrator with game loop
import { Player } from './Player.js';
import { Wall } from './Wall.js';
import { Renderer } from './Renderer.js';
import { InputHandler } from './InputHandler.js';
import { AudioManager } from './AudioManager.js';
import { UIManager } from './UIManager.js';
import { ScoreManager } from './ScoreManager.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.state = 'START';

    // Game constants
    this.WALL_WIDTH = 60;
    this.WALL_SPACING = 250;
    this.GAP_SIZE = 150;
    this.WALL_SPEED = 2;
    this.MIN_GAP_Y = 50;
    this.MAX_GAP_Y = this.canvas.height - this.GAP_SIZE - 50;
    this.PLAYER_START_X = 100;
    this.PLAYER_START_Y = 250;
    this.PLAYER_SIZE = 40;
    this.FIXED_TIMESTEP = 16.67;

    // Initialize components
    this.renderer = new Renderer(this.canvas, this.context);
    this.audioManager = new AudioManager();
    this.scoreManager = new ScoreManager();
    this.player = new Player(
      this.PLAYER_START_X,
      this.PLAYER_START_Y,
      this.PLAYER_SIZE,
    );
    this.uiManager = new UIManager();
    this.inputHandler = new InputHandler(this);

    // Wall management
    this.walls = [];
    this.wallPool = [];
    this.maxPoolSize = 10;

    // Timing
    this.lastTimestamp = 0;
    this.animationFrameId = null;
  }

  async init() {
    try {
      // Load assets in parallel
      await Promise.all([
        this.renderer.loadAssets(),
        this.audioManager.loadAudio(),
      ]);
    } catch (error) {
      console.error('Initialization error:', error);
    }

    // Show start screen
    this.setState('START');
    this.renderer.render(
      this.state,
      this.player,
      this.walls,
      this.scoreManager.getCurrentScore(),
      this.scoreManager.getHighScore(),
    );
  }

  start() {
    // Reset game
    this.player.reset(this.PLAYER_START_X, this.PLAYER_START_Y);
    this.walls = [];
    this.scoreManager.reset();

    // Spawn initial walls with proper spacing
    for (let i = 0; i < 3; i++) {
      const gapY = this.getRandomGapY();
      const x = this.canvas.width + i * this.WALL_SPACING;
      const wall = this.getWallFromPool(x, gapY);
      this.walls.push(wall);
    }

    // Start game
    this.setState('PLAYING');
    this.lastTimestamp = performance.now();
    this.gameLoop(this.lastTimestamp);
  }

  gameLoop(timestamp) {
    if (this.state !== 'PLAYING') return;

    // Fixed timestep update
    this.update(this.FIXED_TIMESTEP);

    // Render
    this.renderer.render(
      this.state,
      this.player,
      this.walls,
      this.scoreManager.getCurrentScore(),
      this.scoreManager.getHighScore(),
    );

    // Request next frame
    this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  update(timestep) {
    // Update player
    this.player.update(timestep);

    // Update walls
    this.walls.forEach((wall) => wall.update(timestep, this.WALL_SPEED));

    // Check collisions
    if (this.checkCollisions()) {
      this.gameOver();
      return;
    }

    // Check score
    this.checkScore();

    // Spawn new walls
    if (this.walls.length > 0) {
      const rightmostWall = this.walls[this.walls.length - 1];
      if (rightmostWall.x < this.canvas.width - this.WALL_SPACING) {
        this.spawnWall();
      }
    }

    // Remove off-screen walls
    this.removeOffScreenWalls();
  }

  checkCollisions() {
    const playerBounds = this.player.getBounds();

    // Check ground collision
    if (playerBounds.y + playerBounds.height >= this.canvas.height) {
      return true;
    }

    // Check ceiling collision
    if (playerBounds.y <= 0) {
      return true;
    }

    // Check wall collisions
    for (let wall of this.walls) {
      // Skip distant walls
      if (wall.x + wall.width < playerBounds.x - 50) continue;
      if (wall.x > playerBounds.x + playerBounds.width + 50) break;

      const wallBounds = wall.getBounds();

      if (
        this.checkAABB(playerBounds, wallBounds.top) ||
        this.checkAABB(playerBounds, wallBounds.bottom)
      ) {
        return true;
      }
    }

    return false;
  }

  checkAABB(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  checkScore() {
    for (let wall of this.walls) {
      if (!wall.passed && wall.isPassed(this.player.x, this.player.width)) {
        wall.passed = true;
        this.scoreManager.incrementScore();
        break;
      }
    }
  }

  gameOver() {
    this.setState('GAME_OVER');
    this.audioManager.playGameOver();
    this.scoreManager.updateHighScore();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Render final frame
    this.renderer.render(
      this.state,
      this.player,
      this.walls,
      this.scoreManager.getCurrentScore(),
      this.scoreManager.getHighScore(),
    );
  }

  restart() {
    this.start();
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    const validStates = ['START', 'PLAYING', 'GAME_OVER'];

    if (!validStates.includes(newState)) {
      console.error('Invalid state:', newState);
      return;
    }

    this.state = newState;
    this.uiManager.updateUI(newState);
  }

  // Wall pool management
  getWallFromPool(x, gapY) {
    let wall;
    if (this.wallPool.length > 0) {
      wall = this.wallPool.pop();
      wall.reset(x, gapY);
    } else {
      wall = new Wall(
        x,
        gapY,
        this.GAP_SIZE,
        this.WALL_WIDTH,
        this.canvas.height,
      );
    }
    return wall;
  }

  returnWallToPool(wall) {
    if (this.wallPool.length < this.maxPoolSize) {
      this.wallPool.push(wall);
    }
  }

  spawnWall() {
    const gapY = this.getRandomGapY();
    const wall = this.getWallFromPool(this.canvas.width, gapY);
    this.walls.push(wall);
  }

  removeOffScreenWalls() {
    while (this.walls.length > 0 && this.walls[0].isOffScreen()) {
      const wall = this.walls.shift();
      this.returnWallToPool(wall);
    }
  }

  getRandomGapY() {
    return (
      Math.floor(Math.random() * (this.MAX_GAP_Y - this.MIN_GAP_Y + 1)) +
      this.MIN_GAP_Y
    );
  }
}
