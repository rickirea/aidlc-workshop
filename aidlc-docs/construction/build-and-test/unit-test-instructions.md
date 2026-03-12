# Unit Test Execution - Flappy Kiro

## Overview

This project uses manual testing due to its simplicity and vanilla JavaScript implementation without a test framework.

## Manual Unit Testing

### Test Player.js

**Test 1: Player Initialization**

1. Open browser console
2. Run: `const player = new window.game.player.constructor(100, 250, 40)`
3. Verify: player.x = 100, player.y = 250, player.velocityY = 0

**Test 2: Gravity Application**

1. Create player instance
2. Run: `player.update(16.67)` multiple times
3. Verify: velocityY increases, y position increases

**Test 3: Jump Mechanics**

1. Create player instance
2. Run: `player.jump()`
3. Verify: velocityY = -8

**Test 4: Terminal Velocity**

1. Create player instance
2. Run: `player.update(16.67)` 20+ times
3. Verify: velocityY caps at 10

---

### Test Wall.js

**Test 1: Wall Initialization**

1. Open browser console
2. Create wall: `const wall = new Wall(800, 150, 150, 60, 600)`
3. Verify: wall.x = 800, wall.gapY = 150, wall.passed = false

**Test 2: Wall Movement**

1. Create wall instance
2. Run: `wall.update(16.67, 2)`
3. Verify: wall.x decreases by 2

**Test 3: Off-Screen Detection**

1. Create wall at x = -100
2. Run: `wall.isOffScreen()`
3. Verify: returns true

**Test 4: Pass Detection**

1. Create wall at x = 50
2. Run: `wall.isPassed(100, 40)`
3. Verify: returns true (player right edge 140 > wall right edge 110)

---

### Test ScoreManager.js

**Test 1: Score Initialization**

1. Open browser console
2. Access: `window.game.scoreManager`
3. Verify: currentScore = 0, highScore loaded from localStorage

**Test 2: Score Increment**

1. Run: `window.game.scoreManager.incrementScore()`
2. Verify: currentScore increases by 1

**Test 3: High Score Update**

1. Set currentScore to 10
2. Set highScore to 5
3. Run: `window.game.scoreManager.updateHighScore()`
4. Verify: highScore = 10, saved to localStorage

**Test 4: localStorage Persistence**

1. Play game and achieve score
2. Refresh browser
3. Verify: High score persists

---

### Test AudioManager.js

**Test 1: Audio Loading**

1. Open browser console
2. Access: `window.game.audioManager`
3. Verify: audioLoaded = true (or false with error logged)

**Test 2: Jump Sound**

1. Run: `window.game.audioManager.playJump()`
2. Verify: Jump sound plays

**Test 3: Game Over Sound**

1. Run: `window.game.audioManager.playGameOver()`
2. Verify: Game over sound plays

---

### Test Renderer.js

**Test 1: Sprite Loading**

1. Open browser console
2. Access: `window.game.renderer`
3. Verify: spriteLoaded = true (or false with fallback)

**Test 2: Canvas Clearing**

1. Run: `window.game.renderer.clear()`
2. Verify: Canvas is cleared

**Test 3: Player Rendering**

1. Run: `window.game.renderer.drawPlayer(window.game.player)`
2. Verify: Player sprite or rectangle appears on canvas

---

### Test GameEngine.js

**Test 1: Initialization**

1. Load game
2. Verify: state = 'START', all components initialized

**Test 2: State Transitions**

1. Click Play button
2. Verify: state changes to 'PLAYING', game loop starts

**Test 3: Collision Detection**

1. During gameplay, let player hit wall
2. Verify: state changes to 'GAME_OVER', game loop stops

**Test 4: Wall Spawning**

1. Start game
2. Verify: 3 initial walls spawn
3. Wait for walls to scroll
4. Verify: New walls spawn at right edge

**Test 5: Wall Pooling**

1. Play game for 30+ seconds
2. Open console and check: `window.game.wallPool.length`
3. Verify: Pool contains reused walls

---

## Automated Testing (Optional Future Enhancement)

To add automated unit tests in the future:

### 1. Install Test Framework

```bash
npm init -y
npm install --save-dev jest
```

### 2. Create Test Files

```
tests/
├── Player.test.js
├── Wall.test.js
├── ScoreManager.test.js
└── GameEngine.test.js
```

### 3. Run Tests

```bash
npm test
```

## Test Results

**Expected Results**:

- All manual tests pass
- No console errors
- Game functions as designed
- 60 FPS maintained

**Test Coverage**:

- Player physics: ✓
- Wall movement: ✓
- Collision detection: ✓
- Scoring logic: ✓
- State management: ✓
- Audio playback: ✓
- Rendering: ✓
