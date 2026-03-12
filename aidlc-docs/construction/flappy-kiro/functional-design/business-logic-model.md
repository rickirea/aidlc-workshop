# Flappy Kiro - Business Logic Model

## Game Physics Model

### Gravity System

**Model**: Simple constant gravity with instant velocity change

**Physics Constants**:

- `GRAVITY = 0.5` (pixels per frame squared)
- `JUMP_FORCE = -8` (pixels per frame, negative = upward)
- `MAX_FALL_SPEED = 10` (pixels per frame, terminal velocity)

**Physics Calculations**:

```
Player Update (each frame):
1. velocity.y += GRAVITY
2. if velocity.y > MAX_FALL_SPEED:
      velocity.y = MAX_FALL_SPEED
3. position.y += velocity.y
4. if position.y < 0:
      position.y = 0
5. if position.y > canvas.height - player.height:
      collision = true
```

```
Player Jump:
1. velocity.y = JUMP_FORCE
2. play jump sound
```

---

## Collision Detection Algorithm

### AABB (Axis-Aligned Bounding Box) Collision

**Algorithm**: Rectangle intersection test

**Player Bounds**:

```
playerBounds = {
  x: player.x,
  y: player.y,
  width: player.width,
  height: player.height
}
```

**Wall Bounds** (per wall):

```
topWallBounds = {
  x: wall.x,
  y: 0,
  width: wall.width,
  height: wall.gapY
}

bottomWallBounds = {
  x: wall.x,
  y: wall.gapY + wall.gapSize,
  width: wall.width,
  height: canvas.height - (wall.gapY + wall.gapSize)
}
```

**Collision Test**:

```
function checkAABB(rect1, rect2):
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y
```

**Collision Check Flow**:

```
For each wall in walls array:
  1. Get player bounds
  2. Get wall top bounds
  3. Get wall bottom bounds
  4. if checkAABB(player, topWall) OR checkAABB(player, bottomWall):
        return COLLISION
  5. Check ground collision: if player.y + player.height >= canvas.height:
        return COLLISION
  6. Check ceiling collision: if player.y <= 0:
        return COLLISION
```

---

## Wall Generation and Management

### Wall Spawning Logic

**Pattern**: Fixed pattern with predetermined gap positions

**Wall Constants**:

- `WALL_WIDTH = 60` (pixels)
- `WALL_SPACING = 250` (pixels between walls)
- `GAP_SIZE = 150` (pixels, easy difficulty)
- `WALL_SPEED = 2` (pixels per frame)
- `MIN_GAP_Y = 50` (minimum gap top position)
- `MAX_GAP_Y = canvas.height - GAP_SIZE - 50` (maximum gap top position)

**Spawning Algorithm**:

```
Initial Setup:
1. Create first wall at x = canvas.width
2. Set gapY = random(MIN_GAP_Y, MAX_GAP_Y)

Wall Update (each frame):
1. wall.x -= WALL_SPEED
2. if wall.x + WALL_WIDTH < 0:
      remove wall from array

Wall Spawning Trigger:
1. Get rightmost wall in array
2. if rightmost.x < canvas.width - WALL_SPACING:
      spawn new wall at x = canvas.width
      set gapY = random(MIN_GAP_Y, MAX_GAP_Y)
```

**Wall Array Management**:

- Walls stored in array
- New walls pushed to end
- Off-screen walls removed from beginning
- Typical active walls: 3-4 at any time

---

## Scoring Logic

### Score Increment Rule

**Trigger**: When player's right edge passes wall's right edge

**Algorithm**:

```
For each wall in walls array:
  1. if wall.passed == false:
        playerRightEdge = player.x + player.width
        wallRightEdge = wall.x + wall.width

        if playerRightEdge > wallRightEdge:
           score += 1
           wall.passed = true
           break (only score once per wall)
```

**Wall Passed Flag**:

- Each wall has `passed` boolean flag
- Initially false when wall created
- Set to true when player passes
- Prevents double-counting same wall

---

## Game State Machine

### States

1. **START**: Initial state, showing start screen
2. **PLAYING**: Active gameplay
3. **GAME_OVER**: Game ended, showing game over screen

### State Transitions

```
START State:
- Display start screen
- Wait for play button click
- On click → transition to PLAYING

PLAYING State:
- Run game loop
- Update all entities
- Check collisions
- Update score
- On collision → transition to GAME_OVER
- On spacebar → player jumps

GAME_OVER State:
- Display game over screen
- Show final score and high score
- Wait for restart button click
- On click → transition to PLAYING
```

### State Transition Logic

```
start():
  1. state = PLAYING
  2. reset player
  3. clear walls array
  4. reset score
  5. spawn initial walls
  6. begin game loop

gameOver():
  1. state = GAME_OVER
  2. stop game loop
  3. play game over sound
  4. update high score if current > high
  5. save high score to localStorage

restart():
  1. call start()
```

---

## Game Loop Timing

### Fixed Timestep Model

**Target Frame Rate**: 60 FPS (16.67ms per frame)

**Game Loop Structure**:

```
let lastTimestamp = 0
const FIXED_TIMESTEP = 1000 / 60  // 16.67ms

function gameLoop(timestamp):
  if state != PLAYING:
    return

  // Calculate elapsed time
  deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  // Fixed timestep update
  update(FIXED_TIMESTEP)

  // Render current state
  render()

  // Request next frame
  requestAnimationFrame(gameLoop)
```

**Benefits of Fixed Timestep**:

- Consistent physics behavior across different frame rates
- Predictable game speed
- Simpler physics calculations
- No need for delta time scaling in physics

**Update Order**:

1. Update player physics
2. Update all walls
3. Check collisions
4. Update score
5. Spawn/remove walls
6. Render frame

---

## High Score Persistence

### localStorage Integration

**Storage Key**: `flappyKiroHighScore`

**Save Logic**:

```
saveHighScore():
  localStorage.setItem('flappyKiroHighScore', highScore.toString())
```

**Load Logic**:

```
loadHighScore():
  stored = localStorage.getItem('flappyKiroHighScore')
  if stored != null:
    highScore = parseInt(stored)
  else:
    highScore = 0
```

**Update Logic**:

```
updateHighScore():
  if currentScore > highScore:
    highScore = currentScore
    saveHighScore()
```

---

## Edge Cases and Error Handling

### Edge Case 1: Multiple Walls Collision

**Scenario**: Player collides with multiple walls simultaneously
**Handling**: First collision detected triggers game over, ignore subsequent checks

### Edge Case 2: Wall Spawning at Game Start

**Scenario**: No walls exist when game starts
**Handling**: Spawn 2-3 initial walls at startup with proper spacing

### Edge Case 3: Score Increment Timing

**Scenario**: Player passes multiple walls in single frame
**Handling**: Only increment score once per wall using passed flag

### Edge Case 4: localStorage Not Available

**Scenario**: Browser doesn't support localStorage or it's disabled
**Handling**: Gracefully degrade - high score defaults to 0, no persistence

### Edge Case 5: Audio Loading Failure

**Scenario**: Audio files fail to load
**Handling**: Game continues without sound, log error to console

### Edge Case 6: Sprite Loading Failure

**Scenario**: ghosty.png fails to load
**Handling**: Draw colored rectangle as fallback, log error to console

### Edge Case 7: Rapid Restart Clicks

**Scenario**: User clicks restart multiple times quickly
**Handling**: Ignore clicks while game is resetting, prevent multiple initializations
