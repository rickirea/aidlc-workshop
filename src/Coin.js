// Coin.js - Collectible coin entity
export class Coin {
  constructor(x, y, size = 20) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.collected = false;
    this.rotation = 0;
  }

  update(deltaTime, scrollSpeed) {
    this.x -= scrollSpeed;
    this.rotation += 0.1;
  }

  isOffScreen() {
    return this.x + this.size < 0;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    };
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
    this.rotation = 0;
  }
}
