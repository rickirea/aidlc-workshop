// Wall.js - Wall entity with movement
export class Wall {
  constructor(x, gapY, gapSize, width, canvasHeight) {
    this.x = x;
    this.y = 0;
    this.width = width;
    this.gapY = gapY;
    this.gapSize = gapSize;
    this.canvasHeight = canvasHeight;
    this.passed = false;
    this.destroyed = false;
  }

  update(deltaTime, scrollSpeed) {
    this.x -= scrollSpeed;
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  isPassed(playerX, playerWidth) {
    const playerRightEdge = playerX + playerWidth;
    const wallRightEdge = this.x + this.width;
    return playerRightEdge > wallRightEdge;
  }

  getBounds() {
    return {
      top: {
        x: this.x,
        y: 0,
        width: this.width,
        height: this.gapY,
      },
      bottom: {
        x: this.x,
        y: this.gapY + this.gapSize,
        width: this.width,
        height: this.canvasHeight - (this.gapY + this.gapSize),
      },
    };
  }

  reset(x, gapY) {
    this.x = x;
    this.gapY = gapY;
    this.passed = false;
    this.destroyed = false;
  }

  destroy() {
    this.destroyed = true;
  }
}
