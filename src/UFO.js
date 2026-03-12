// UFO.js - Enemy UFO entity
export class UFO {
  constructor(x, y, speed = 1.5) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
    this.speed = speed;
    this.destroyed = false;
    this.wobble = 0;
  }

  update(deltaTime) {
    this.x -= this.speed;
    this.wobble += 0.1;
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  destroy() {
    this.destroyed = true;
  }
}
