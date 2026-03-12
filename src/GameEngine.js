// GameEngine.js - Central orchestrator with game loop
import { Player } from './Player.js';
import { Wall } from './Wall.js';
import { Coin } from './Coin.js';
import { Plasma } from './Plasma.js';
import { UFO } from './UFO.js';
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
    this.GAP_SIZE = 180;
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

    // Coin management
    this.coins = [];
    this.coinPool = [];
    this.COIN_SIZE = 20;
    this.COIN_POINTS = 2;

    // Plasma management
    this.plasmaShots = [];
    this.availablePlasmaShots = 0;
    this.usedPlasmaShots = 0;
    this.POINTS_PER_SHOT = 3;

    // UFO management
    this.ufos = [];
    this.ufoSpawnChance = 0.005;
    this.lastUFOSpawn = 0;
    this.MIN_UFO_INTERVAL = 3000;

    // Timing
    this.lastTimestamp = 0;
    this.accumulator = 0;
    this.animationFrameId = null;
    this.TARGET_FPS = 60;
    this.FRAME_TIME = 1000 / this.TARGET_FPS;
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
    this.coins = [];
    this.plasmaShots = [];
    this.ufos = [];
    this.availablePlasmaShots = 0;
    this.usedPlasmaShots = 0;
    this.lastUFOSpawn = 0;
    this.scoreManager.reset();

    // Spawn initial walls with proper spacing
    for (let i = 0; i < 3; i++) {
      const gapY = this.getRandomGapY();
      const x = this.canvas.width + i * this.WALL_SPACING;
      const wall = this.getWallFromPool(x, gapY);
      this.walls.push(wall);

      // Spawn coin between walls (easier to reach)
      const coinInTop = Math.random() > 0.5;
      const safeMargin = 80;
      const coinY = coinInTop
        ? Math.random() * (gapY - safeMargin * 2) + safeMargin
        : gapY +
          this.GAP_SIZE +
          Math.random() *
            (this.canvas.height - gapY - this.GAP_SIZE - safeMargin * 2) +
          safeMargin;
      this.spawnCoin(x + this.WALL_SPACING / 2, coinY);
    }

    // Start game
    this.setState('PLAYING');
    this.lastTimestamp = performance.now();
    this.gameLoop(this.lastTimestamp);
  }

  gameLoop(timestamp) {
    if (this.state !== 'PLAYING') return;

    // Calculate delta time
    const deltaTime = timestamp - this.lastTimestamp;

    // Only update if enough time has passed (60 FPS cap)
    if (deltaTime < this.FRAME_TIME) {
      this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
      return;
    }

    this.lastTimestamp = timestamp;

    // Fixed timestep update
    this.update(this.FIXED_TIMESTEP);

    // Render
    const remainingShots = this.availablePlasmaShots - this.usedPlasmaShots;
    this.renderer.render(
      this.state,
      this.player,
      this.walls,
      this.scoreManager.getCurrentScore(),
      this.scoreManager.getHighScore(),
      this.coins,
      this.plasmaShots,
      remainingShots,
      this.ufos,
    );

    // Request next frame
    this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  update(timestep) {
    // Update player
    this.player.update(timestep);

    // Update walls
    this.walls.forEach((wall) => wall.update(timestep, this.WALL_SPEED));

    // Update coins
    this.coins.forEach((coin) => coin.update(timestep, this.WALL_SPEED));

    // Update plasma shots
    this.plasmaShots.forEach((plasma) => plasma.update(timestep));

    // Update UFOs
    this.ufos.forEach((ufo) => ufo.update(timestep));

    // Check plasma-wall collisions
    this.checkPlasmaCollisions();

    // Check plasma-UFO collisions
    this.checkPlasmaUFOCollisions();

    // Check collisions
    if (this.checkCollisions()) {
      this.gameOver();
      return;
    }

    // Check UFO collisions
    if (this.checkUFOCollisions()) {
      this.gameOver();
      return;
    }

    // Check coin collection
    this.checkCoinCollection();

    // Check score
    this.checkScore();

    // Spawn UFO randomly
    this.trySpawnUFO();

    // Spawn new walls
    if (this.walls.length > 0) {
      const rightmostWall = this.walls[this.walls.length - 1];
      if (rightmostWall.x < this.canvas.width - this.WALL_SPACING) {
        this.spawnWall();
      }
    }

    // Remove off-screen entities
    this.removeOffScreenWalls();
    this.removeOffScreenCoins();
    this.removeOffScreenPlasma();
    this.removeOffScreenUFOs();
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

    // Check wall collisions (skip destroyed walls)
    for (let wall of this.walls) {
      if (wall.destroyed) continue;

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
        this.updatePlasmaShots();
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
    const remainingShots = this.availablePlasmaShots - this.usedPlasmaShots;
    this.renderer.render(
      this.state,
      this.player,
      this.walls,
      this.scoreManager.getCurrentScore(),
      this.scoreManager.getHighScore(),
      this.coins,
      this.plasmaShots,
      remainingShots,
      this.ufos,
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

    // Spawn coin between walls (easier to reach)
    const coinInTop = Math.random() > 0.5;
    const safeMargin = 80;
    const coinY = coinInTop
      ? Math.random() * (gapY - safeMargin * 2) + safeMargin
      : gapY +
        this.GAP_SIZE +
        Math.random() *
          (this.canvas.height - gapY - this.GAP_SIZE - safeMargin * 2) +
        safeMargin;
    this.spawnCoin(this.canvas.width + this.WALL_SPACING / 2, coinY);
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

  // Coin management
  getCoinFromPool(x, y) {
    let coin;
    if (this.coinPool.length > 0) {
      coin = this.coinPool.pop();
      coin.reset(x, y);
    } else {
      coin = new Coin(x, y, this.COIN_SIZE);
    }
    return coin;
  }

  returnCoinToPool(coin) {
    if (this.coinPool.length < this.maxPoolSize) {
      this.coinPool.push(coin);
    }
  }

  spawnCoin(x, y) {
    const coin = this.getCoinFromPool(x, y);
    this.coins.push(coin);
  }

  removeOffScreenCoins() {
    while (this.coins.length > 0 && this.coins[0].isOffScreen()) {
      const coin = this.coins.shift();
      this.returnCoinToPool(coin);
    }
  }

  checkCoinCollection() {
    const playerBounds = this.player.getBounds();

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      if (coin.collected) continue;

      const coinBounds = coin.getBounds();

      if (this.checkAABB(playerBounds, coinBounds)) {
        coin.collected = true;
        this.scoreManager.addPoints(this.COIN_POINTS);
        this.coins.splice(i, 1);
        this.returnCoinToPool(coin);
        this.updatePlasmaShots();
      }
    }
  }

  updatePlasmaShots() {
    this.availablePlasmaShots = Math.floor(
      this.scoreManager.getCurrentScore() / this.POINTS_PER_SHOT,
    );
  }

  shootPlasma() {
    const remainingShots = this.availablePlasmaShots - this.usedPlasmaShots;
    if (remainingShots <= 0) return;

    const plasma = new Plasma(
      this.player.x + this.player.width,
      this.player.y + this.player.height / 2 - 5,
    );
    this.plasmaShots.push(plasma);
    this.usedPlasmaShots++;
  }

  checkPlasmaCollisions() {
    for (let i = this.plasmaShots.length - 1; i >= 0; i--) {
      const plasma = this.plasmaShots[i];
      if (!plasma.active) continue;

      const plasmaBounds = plasma.getBounds();

      for (let wall of this.walls) {
        if (wall.destroyed) continue;

        const wallBounds = wall.getBounds();

        if (
          this.checkAABB(plasmaBounds, wallBounds.top) ||
          this.checkAABB(plasmaBounds, wallBounds.bottom)
        ) {
          wall.destroy();
          plasma.deactivate();
          this.plasmaShots.splice(i, 1);
          break;
        }
      }
    }
  }

  removeOffScreenPlasma() {
    this.plasmaShots = this.plasmaShots.filter(
      (plasma) => !plasma.isOffScreen(this.canvas.width),
    );
  }

  trySpawnUFO() {
    const now = performance.now();

    // Check if there's any active UFO
    const hasActiveUFO = this.ufos.some((ufo) => !ufo.destroyed);

    // Only spawn if: has plasma shots, no active UFO, enough time passed, random chance
    if (
      this.availablePlasmaShots > 0 &&
      !hasActiveUFO &&
      now - this.lastUFOSpawn > this.MIN_UFO_INTERVAL &&
      Math.random() < this.ufoSpawnChance
    ) {
      // Find the next wall to spawn UFO in its gap
      if (this.walls.length > 0) {
        const targetWall = this.walls[this.walls.length - 1];
        const ufoY = targetWall.gapY + this.GAP_SIZE / 2;
        const ufo = new UFO(this.canvas.width, ufoY);
        this.ufos.push(ufo);
        this.lastUFOSpawn = now;
      }
    }
  }

  checkUFOCollisions() {
    const playerBounds = this.player.getBounds();

    for (let ufo of this.ufos) {
      if (ufo.destroyed) continue;

      const ufoBounds = ufo.getBounds();

      if (this.checkAABB(playerBounds, ufoBounds)) {
        return true;
      }
    }

    return false;
  }

  checkPlasmaUFOCollisions() {
    for (let i = this.plasmaShots.length - 1; i >= 0; i--) {
      const plasma = this.plasmaShots[i];
      if (!plasma.active) continue;

      const plasmaBounds = plasma.getBounds();

      for (let ufo of this.ufos) {
        if (ufo.destroyed) continue;

        const ufoBounds = ufo.getBounds();

        if (this.checkAABB(plasmaBounds, ufoBounds)) {
          ufo.destroy();
          plasma.deactivate();
          this.plasmaShots.splice(i, 1);
          this.scoreManager.addPoints(10);
          break;
        }
      }
    }
  }

  removeOffScreenUFOs() {
    this.ufos = this.ufos.filter((ufo) => !ufo.isOffScreen());
  }
}
