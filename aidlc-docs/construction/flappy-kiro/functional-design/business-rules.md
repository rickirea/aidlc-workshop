# Flappy Kiro - Business Rules

## Game Mechanics Rules

### Rule 1: Player Movement

**Rule**: Player moves continuously rightward (visual effect through wall scrolling)

- Player X position remains constant at 100 pixels from left edge
- Walls scroll leftward to create illusion of forward movement
- Player only moves vertically (Y axis)

### Rule 2: Gravity Application

**Rule**: Gravity applies continuously during PLAYING state

- Gravity adds to velocity every frame: `velocity.y += GRAVITY`
- Gravity does NOT apply during START or GAME_OVER states
- Velocity capped at MAX_FALL_SPEED to prevent excessive speed

### Rule 3: Jump Mechanics

**Rule**: Jump only works during PLAYING state

- Spacebar press sets velocity to JUMP_FORCE (-8 pixels/frame)
- Jump replaces current velocity (no accumulation)
- Jump sound plays on each valid jump
- Jumps ignored during START and GAME_OVER states

### Rule 4: Player Boundaries

**Rule**: Player constrained within canvas vertical bounds

- If player.y < 0: collision with ceiling
- If player.y + player.height >= canvas.height: collision with ground
- No horizontal boundaries (player X is fixed)

---

## Collision Rules

### Rule 5: Wall Collision Detection

**Rule**: Collision occurs when player bounds intersect wall bounds

- Check AABB intersection with top wall section
- Check AABB intersection with bottom wall section
- Collision with either section triggers game over
- Collision check runs every frame during PLAYING state

### Rule 6: Ground Collision

**Rule**: Player touching ground ends game

- Collision when: `player.y + player.height >= canvas.height`
- Triggers immediate game over

### Rule 7: Ceiling Collision

**Rule**: Player touching ceiling ends game

- Collision when: `player.y <= 0`
- Triggers immediate game over

### Rule 8: Collision Response

**Rule**: Any collision immediately ends game

- First collision detected stops further checks
- Game state transitions to GAME_OVER
- Game loop stops
- Game over sound plays
- High score updated if applicable

---

## Scoring Rules

### Rule 9: Score Increment Condition

**Rule**: Score increments when player's right edge passes wall's right edge

- Calculate: `playerRightEdge = player.x + player.width`
- Calculate: `wallRightEdge = wall.x + wall.width`
- If `playerRightEdge > wallRightEdge` AND `wall.passed == false`: increment score
- Set `wall.passed = true` to prevent double-counting

### Rule 10: Score Increment Amount

**Rule**: Each wall passed awards exactly 1 point

- No bonus points
- No multipliers
- Linear scoring progression

### Rule 11: High Score Update

**Rule**: High score updates only when current score exceeds it

- Check on game over: `if currentScore > highScore`
- Update high score: `highScore = currentScore`
- Save to localStorage immediately
- High score persists across browser sessions

### Rule 12: Score Reset

**Rule**: Current score resets to 0 on game restart

- High score never resets (persists)
- Score resets before PLAYING state begins

---

## Wall Management Rules

### Rule 13: Wall Spawning Trigger

**Rule**: New wall spawns when rightmost wall reaches spawn threshold

- Check rightmost wall: `rightmostWall.x < canvas.width - WALL_SPACING`
- Spawn new wall at: `x = canvas.width`
- Gap position randomized: `gapY = random(MIN_GAP_Y, MAX_GAP_Y)`

### Rule 14: Wall Removal

**Rule**: Walls removed when completely off-screen

- Remove when: `wall.x + wall.width < 0`
- Remove from beginning of walls array
- Prevents memory accumulation

### Rule 15: Initial Wall Setup

**Rule**: Game starts with 3 pre-spawned walls

- Wall 1: x = canvas.width
- Wall 2: x = canvas.width + WALL_SPACING
- Wall 3: x = canvas.width + (WALL_SPACING \* 2)
- Each with random gap position

### Rule 16: Wall Movement

**Rule**: All walls move at constant speed during PLAYING state

- Movement: `wall.x -= WALL_SPEED` per frame
- Speed constant: 2 pixels per frame
- Movement stops during START and GAME_OVER states

### Rule 17: Gap Position Constraints

**Rule**: Gap must be within playable bounds

- Minimum: `gapY >= MIN_GAP_Y` (50 pixels from top)
- Maximum: `gapY <= MAX_GAP_Y` (50 pixels from bottom after gap)
- Ensures gap is always fully visible and reachable

---

## Game State Rules

### Rule 18: State Transition Conditions

**Rule**: State transitions only occur on specific events

**START → PLAYING**:

- Trigger: Play button clicked
- Actions: Reset game, spawn walls, start loop

**PLAYING → GAME_OVER**:

- Trigger: Collision detected
- Actions: Stop loop, play sound, update high score, show game over screen

**GAME_OVER → PLAYING**:

- Trigger: Restart button clicked
- Actions: Same as START → PLAYING

### Rule 19: Input Handling by State

**Rule**: Input behavior depends on current state

**START State**:

- Spacebar: No effect
- Play button click: Start game

**PLAYING State**:

- Spacebar: Player jumps
- Buttons: No effect

**GAME_OVER State**:

- Spacebar: No effect
- Restart button click: Restart game

---

## Audio Rules

### Rule 20: Jump Sound

**Rule**: Jump sound plays on every valid jump

- Trigger: Spacebar pressed during PLAYING state
- Sound: jump.wav
- No sound during START or GAME_OVER states

### Rule 21: Game Over Sound

**Rule**: Game over sound plays once on collision

- Trigger: Collision detected
- Sound: game_over.wav
- Plays only once per game over event

### Rule 22: Audio Preloading

**Rule**: Audio files must be preloaded before game starts

- Load during initialization
- Game can start even if audio fails to load
- Failed audio logs error but doesn't block gameplay

---

## Rendering Rules

### Rule 23: Render Order

**Rule**: Elements rendered in specific order (back to front)

1. Background
2. Walls (all walls)
3. Ground line (if applicable)
4. Player sprite
5. Score text
6. UI overlays (start screen or game over screen)

### Rule 24: Render Frequency

**Rule**: Render called once per frame during game loop

- Render only when state is PLAYING
- Static screens (START, GAME_OVER) render once on state change
- Clear canvas before each render

### Rule 25: Sprite Rendering

**Rule**: Player sprite rendered at player position

- If sprite loaded: draw ghosty.png at (player.x, player.y)
- If sprite failed: draw colored rectangle as fallback
- Sprite size matches player.width and player.height

---

## Persistence Rules

### Rule 26: High Score Storage

**Rule**: High score persists in browser localStorage

- Storage key: 'flappyKiroHighScore'
- Saved as string representation of number
- Loaded on game initialization
- Updated only when current score exceeds high score

### Rule 27: No Other Persistence

**Rule**: Only high score persists across sessions

- Current score not saved
- Game state not saved
- Player position not saved
- Wall positions not saved

---

## Validation and Constraints

### Rule 28: Numeric Constraints

**Rule**: All numeric values must be within valid ranges

- Player position: 0 <= y <= canvas.height - player.height
- Wall gap position: MIN_GAP_Y <= gapY <= MAX_GAP_Y
- Velocity: -Infinity < velocityY <= MAX_FALL_SPEED
- Score: score >= 0
- High score: highScore >= 0

### Rule 29: Asset Validation

**Rule**: Game handles missing or failed assets gracefully

- Missing sprite: Use colored rectangle fallback
- Missing audio: Continue without sound
- Log errors to console for debugging
- Never block game start due to asset failures

### Rule 30: State Consistency

**Rule**: Game state must always be valid

- State must be one of: 'START', 'PLAYING', 'GAME_OVER'
- Invalid states default to 'START'
- State transitions are atomic (no partial transitions)

---

## Business Logic Invariants

### Invariant 1: Score Monotonicity

**Invariant**: Score only increases during a single game session

- Score never decreases
- Score resets to 0 only on restart
- Each wall contributes exactly 1 point

### Invariant 2: Wall Ordering

**Invariant**: Walls in array are ordered by X position (right to left)

- Rightmost wall at end of array
- Leftmost wall at beginning of array
- New walls always added to end
- Off-screen walls removed from beginning

### Invariant 3: Single Collision

**Invariant**: Only one collision can trigger game over per game session

- First collision detected ends game
- No collision checks after game over
- Game must restart to check collisions again

### Invariant 4: Passed Flag Uniqueness

**Invariant**: Each wall's passed flag set exactly once

- Initially false
- Set to true when player passes
- Never reset to false
- Ensures score increments exactly once per wall
