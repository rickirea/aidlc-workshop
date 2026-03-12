// Renderer.js - Canvas rendering with asset caching
export class Renderer {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.sprite = null;
    this.spriteLoaded = false;
    this.stars = this.generateStars(100);
    this.trail = [];
    this.maxTrailLength = 15;
  }

  generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        brightness: Math.random(),
      });
    }
    return stars;
  }

  async loadAssets() {
    try {
      this.sprite = new Image();
      this.sprite.src = '/assets/ghosty.png';

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
    // Cosmic background gradient
    const gradient = this.context.createLinearGradient(
      0,
      0,
      0,
      this.canvas.height,
    );
    gradient.addColorStop(0, '#0a0e27');
    gradient.addColorStop(0.5, '#1a1a3e');
    gradient.addColorStop(1, '#0f0f23');
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stars
    this.stars.forEach((star) => {
      star.brightness = (star.brightness + 0.02) % 1;
      const alpha = 0.3 + Math.sin(star.brightness * Math.PI * 2) * 0.7;
      this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.context.fillRect(star.x, star.y, star.size, star.size);
    });
  }

  drawPlayer(player) {
    // Add position to trail
    this.trail.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
    });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Draw neon trail
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.6;
      const size = (i / this.trail.length) * 20;

      this.context.shadowBlur = 20;
      this.context.shadowColor = '#00ffff';
      this.context.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      this.context.beginPath();
      this.context.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
      this.context.fill();
    }

    this.context.shadowBlur = 0;

    // Draw player with neon glow
    if (this.spriteLoaded) {
      this.context.shadowBlur = 25;
      this.context.shadowColor = '#00ffff';
      this.context.drawImage(
        this.sprite,
        player.x,
        player.y,
        player.width,
        player.height,
      );
      this.context.shadowBlur = 0;
    } else {
      // Fallback: neon cyan rectangle
      this.context.shadowBlur = 25;
      this.context.shadowColor = '#00ffff';
      this.context.fillStyle = '#00ffff';
      this.context.fillRect(player.x, player.y, player.width, player.height);
      this.context.shadowBlur = 0;
    }
  }

  drawWall(wall) {
    if (wall.destroyed) return;

    const meteorCount = 6;

    // Top meteor cluster
    for (let i = 0; i < meteorCount; i++) {
      const meteorX = wall.x + (i % 2) * 30 + Math.random() * 10;
      const meteorY = (i * wall.gapY) / meteorCount + Math.random() * 20;
      this.drawMeteor(meteorX, meteorY);
    }

    // Bottom meteor cluster
    const bottomY = wall.gapY + wall.gapSize;
    const bottomHeight = wall.canvasHeight - bottomY;

    for (let i = 0; i < meteorCount; i++) {
      const meteorX = wall.x + (i % 2) * 30 + Math.random() * 10;
      const meteorY =
        bottomY + (i * bottomHeight) / meteorCount + Math.random() * 20;
      this.drawMeteor(meteorX, meteorY);
    }
  }

  drawMeteor(x, y) {
    const size = 20 + Math.random() * 15;

    this.context.fillStyle = '#3a3a3a';
    this.context.beginPath();

    const points = 6;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = size * (0.7 + Math.random() * 0.3);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) {
        this.context.moveTo(px, py);
      } else {
        this.context.lineTo(px, py);
      }
    }
    this.context.closePath();
    this.context.fill();

    this.context.strokeStyle = '#ff00ff';
    this.context.lineWidth = 2;
    this.context.shadowBlur = 15;
    this.context.shadowColor = '#ff00ff';
    this.context.stroke();
    this.context.shadowBlur = 0;

    this.context.fillStyle = '#2a2a2a';
    this.context.beginPath();
    this.context.arc(x - 5, y - 3, 3, 0, Math.PI * 2);
    this.context.fill();
    this.context.beginPath();
    this.context.arc(x + 4, y + 5, 4, 0, Math.PI * 2);
    this.context.fill();
  }

  drawUFO(ufo) {
    if (ufo.destroyed) return;

    const wobbleY = Math.sin(ufo.wobble) * 5;

    this.context.save();
    this.context.translate(
      ufo.x + ufo.width / 2,
      ufo.y + ufo.height / 2 + wobbleY,
    );

    this.context.shadowBlur = 30;
    this.context.shadowColor = '#ff0000';

    // UFO dome
    this.context.fillStyle = '#ff0000';
    this.context.beginPath();
    this.context.ellipse(0, -5, 15, 10, 0, 0, Math.PI * 2);
    this.context.fill();

    // UFO base
    this.context.fillStyle = '#cc0000';
    this.context.beginPath();
    this.context.ellipse(0, 5, 25, 8, 0, 0, Math.PI * 2);
    this.context.fill();

    // Lights
    for (let i = -1; i <= 1; i++) {
      this.context.fillStyle = '#ffff00';
      this.context.beginPath();
      this.context.arc(i * 12, 8, 3, 0, Math.PI * 2);
      this.context.fill();
    }

    this.context.restore();
    this.context.shadowBlur = 0;
  }

  drawPlasma(plasma) {
    if (!plasma.active) return;

    this.context.shadowBlur = 25;
    this.context.shadowColor = '#00ff00';

    this.context.fillStyle = 'rgba(0, 255, 0, 0.3)';
    this.context.fillRect(
      plasma.x - 5,
      plasma.y - 7,
      plasma.width + 10,
      plasma.height + 14,
    );

    this.context.fillStyle = '#00ff00';
    this.context.fillRect(plasma.x, plasma.y, plasma.width, plasma.height);

    this.context.fillStyle = '#ffffff';
    this.context.fillRect(
      plasma.x + 5,
      plasma.y + 2,
      plasma.width - 10,
      plasma.height - 4,
    );

    this.context.shadowBlur = 0;
  }

  drawScore(score) {
    this.context.shadowBlur = 20;
    this.context.shadowColor = '#ffff00';
    this.context.fillStyle = '#ffff00';
    this.context.font = 'bold 32px Arial';
    this.context.textAlign = 'center';
    this.context.fillText(score.toString(), this.canvas.width / 2, 50);
    this.context.shadowBlur = 0;
  }

  drawPlasmaCounter(availableShots) {
    this.context.shadowBlur = 15;
    this.context.shadowColor = availableShots > 0 ? '#00ff00' : '#666666';
    this.context.fillStyle = availableShots > 0 ? '#00ff00' : '#666666';
    this.context.font = 'bold 24px Arial';
    this.context.textAlign = 'right';
    this.context.fillText(`⚡ ${availableShots}`, this.canvas.width - 30, 50);
    this.context.shadowBlur = 0;
  }

  drawCoin(coin) {
    if (coin.collected) return;

    this.context.save();
    this.context.translate(coin.x + coin.size / 2, coin.y + coin.size / 2);
    this.context.rotate(coin.rotation);

    this.context.shadowBlur = 20;
    this.context.shadowColor = '#ffff00';
    this.context.fillStyle = '#ffff00';
    this.context.beginPath();
    this.context.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
    this.context.fill();

    this.context.fillStyle = '#ffffff';
    this.context.beginPath();
    this.context.arc(0, 0, coin.size / 4, 0, Math.PI * 2);
    this.context.fill();

    this.context.restore();
    this.context.shadowBlur = 0;
  }

  drawStartScreen() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.shadowBlur = 30;
    this.context.shadowColor = '#00ffff';
    this.context.fillStyle = '#00ffff';
    this.context.font = 'bold 48px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('Flappy Kiro', this.canvas.width / 2, 170);

    this.context.shadowBlur = 15;
    this.context.shadowColor = '#ff00ff';
    this.context.fillStyle = '#ff00ff';
    this.context.font = '18px Arial';
    this.context.fillText('SPACEBAR to jump', this.canvas.width / 2, 240);
    this.context.fillText(
      'X to shoot plasma (1 shot per 3 points)',
      this.canvas.width / 2,
      265,
    );
    this.context.fillText(
      'Walls = 1pt | Coins = 2pts | UFOs = 10pts',
      this.canvas.width / 2,
      290,
    );
    this.context.fillText(
      'Destroy UFOs with plasma!',
      this.canvas.width / 2,
      315,
    );

    this.context.shadowBlur = 20;
    this.context.shadowColor = '#ffff00';
    this.context.fillStyle = '#ffff00';
    this.context.font = 'bold 32px Arial';
    this.context.fillText('Click PLAY to start', this.canvas.width / 2, 400);

    this.context.shadowBlur = 0;
  }

  drawGameOverScreen(score, highScore) {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.shadowBlur = 40;
    this.context.shadowColor = '#ff0066';
    this.context.fillStyle = '#ff0066';
    this.context.font = 'bold 48px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('GAME OVER', this.canvas.width / 2, 200);

    this.context.shadowBlur = 20;
    this.context.shadowColor = '#00ffff';
    this.context.fillStyle = '#00ffff';
    this.context.font = '32px Arial';
    this.context.fillText('Score: ' + score, this.canvas.width / 2, 280);

    this.context.shadowColor = '#ffff00';
    this.context.fillStyle = '#ffff00';
    this.context.fillText(
      'High Score: ' + highScore,
      this.canvas.width / 2,
      330,
    );

    this.context.shadowBlur = 15;
    this.context.shadowColor = '#ff00ff';
    this.context.fillStyle = '#ff00ff';
    this.context.font = 'bold 28px Arial';
    this.context.fillText(
      'Click RESTART to play again',
      this.canvas.width / 2,
      420,
    );

    this.context.shadowBlur = 0;
  }

  render(
    state,
    player,
    walls,
    score,
    highScore,
    coins = [],
    plasmaShots = [],
    availableShots = 0,
    ufos = [],
  ) {
    this.clear();
    this.drawBackground();

    if (state === 'START') {
      this.drawStartScreen();
    } else if (state === 'PLAYING') {
      walls.forEach((wall) => this.drawWall(wall));
      coins.forEach((coin) => this.drawCoin(coin));
      ufos.forEach((ufo) => this.drawUFO(ufo));
      plasmaShots.forEach((plasma) => this.drawPlasma(plasma));
      this.drawPlayer(player);
      this.drawScore(score);
      this.drawPlasmaCounter(availableShots);
    } else if (state === 'GAME_OVER') {
      walls.forEach((wall) => this.drawWall(wall));
      coins.forEach((coin) => this.drawCoin(coin));
      this.drawPlayer(player);
      this.drawGameOverScreen(score, highScore);
    }
  }
}
