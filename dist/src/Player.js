// Player.js - Player entity with physics
export class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.velocityY = 0;

    // Physics constants
    this.gravity = 0.5;
    this.jumpForce = -8;
    this.maxFallSpeed = 10;
  }

  update(deltaTime) {
    // Apply gravity
    this.velocityY += this.gravity;

    // Clamp to max fall speed
    if (this.velocityY > this.maxFallSpeed) {
      this.velocityY = this.maxFallSpeed;
    }

    // Update position
    this.y += this.velocityY;
  }

  jump() {
    this.velocityY = this.jumpForce;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityY = 0;
  }
}
