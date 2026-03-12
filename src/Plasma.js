// Plasma.js - Plasma shot entity
export class Plasma {
  constructor(x, y, speed = 8) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 10;
    this.speed = speed;
    this.active = true;
  }

  update(deltaTime) {
    this.x += this.speed;
  }

  isOffScreen(canvasWidth) {
    return this.x > canvasWidth;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  deactivate() {
    this.active = false;
  }
}
