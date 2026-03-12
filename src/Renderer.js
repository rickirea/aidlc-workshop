// Renderer.js - Canvas rendering with asset caching
export class Renderer {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.sprite = null;
    this.spriteLoaded = false;
  }

  async loadAssets() {
    try {
      this.sprite = new Image();
      this.sprite.src = 'assets/ghosty.png';

      await new Promise((resolve, reject) => {
        this.sprite.onload = resolve;
        this.sprite.onerror = reject;
      });

      this.spriteLoaded = true;
    } catch (error) {
      console.error('Failed to load sprite:', error);
      this.spriteLoaded = false;
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.context.fillStyle = '#87CEEB';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player) {
    if (this.spriteLoaded) {
      this.context.drawImage(
        this.sprite,
        player.x,
        player.y,
        player.width,
        player.height,
      );
    } else {
      // Fallback: white rectangle
      this.context.fillStyle = '#FFFFFF';
      this.context.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  drawWall(wall) {
    this.context.fillStyle = '#228B22';

    // Draw top wall
    this.context.fillRect(wall.x, 0, wall.width, wall.gapY);

    // Draw bottom wall
    const bottomY = wall.gapY + wall.gapSize;
    const bottomHeight = wall.canvasHeight - bottomY;
    this.context.fillRect(wall.x, bottomY, wall.width, bottomHeight);
  }

  drawScore(score) {
    this.context.fillStyle = '#FFFFFF';
    this.context.font = 'bold 32px Arial';
    this.context.textAlign = 'center';
    this.context.fillText(score.toString(), this.canvas.width / 2, 50);
  }

  drawStartScreen() {
    // Semi-transparent overlay
    this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Title
    this.context.fillStyle = '#FFFFFF';
    this.context.font = 'bold 48px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('Flappy Kiro', this.canvas.width / 2, 200);

    // Instructions
    this.context.font = '24px Arial';
    this.context.fillText('Press SPACEBAR to jump', this.canvas.width / 2, 280);
    this.context.fillText('Avoid the walls!', this.canvas.width / 2, 320);

    // Play button (drawn by UIManager, just show text here)
    this.context.font = 'bold 32px Arial';
    this.context.fillText('Click PLAY to start', this.canvas.width / 2, 400);
  }

  drawGameOverScreen(score, highScore) {
    // Semi-transparent overlay
    this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Game Over text
    this.context.fillStyle = '#FF0000';
    this.context.font = 'bold 48px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('GAME OVER', this.canvas.width / 2, 200);

    // Score
    this.context.fillStyle = '#FFFFFF';
    this.context.font = '32px Arial';
    this.context.fillText('Score: ' + score, this.canvas.width / 2, 280);
    this.context.fillText(
      'High Score: ' + highScore,
      this.canvas.width / 2,
      330,
    );

    // Restart instruction
    this.context.font = 'bold 28px Arial';
    this.context.fillText(
      'Click RESTART to play again',
      this.canvas.width / 2,
      420,
    );
  }

  render(state, player, walls, score, highScore) {
    this.clear();
    this.drawBackground();

    if (state === 'START') {
      this.drawStartScreen();
    } else if (state === 'PLAYING') {
      walls.forEach((wall) => this.drawWall(wall));
      this.drawPlayer(player);
      this.drawScore(score);
    } else if (state === 'GAME_OVER') {
      walls.forEach((wall) => this.drawWall(wall));
      this.drawPlayer(player);
      this.drawGameOverScreen(score, highScore);
    }
  }
}
