# Flappy Kiro - Domain Entities

## Entity Definitions

### Player Entity

**Purpose**: Represents the player character (Ghosty) with physics state

**Attributes**:

```javascript
{
  x: number,              // X position (pixels)
  y: number,              // Y position (pixels)
  width: number,          // Player width (pixels)
  height: number,         // Player height (pixels)
  velocityY: number,      // Vertical velocity (pixels per frame)
  sprite: Image           // Loaded ghosty.png image
}
```

**Initial State**:

```javascript
{
  x: 100,
  y: 250,
  width: 40,
  height: 40,
  velocityY: 0,
  sprite: null  // Loaded during initialization
}
```

**State Transitions**:

- Position updates every frame based on velocity
- Velocity increases by gravity each frame
- Velocity resets to JUMP_FORCE on jump action
- Position resets on game restart

---

### Wall Entity

**Purpose**: Represents a single wall obstacle with gap

**Attributes**:

```javascript
{
  x: number,              // X position (pixels)
  y: number,              // Always 0 (walls extend from top/bottom)
  width: number,          // Wall width (pixels)
  gapY: number,           // Gap top position (pixels from top)
  gapSize: number,        // Gap height (pixels)
  canvasHeight: number,   // Canvas height for bottom wall calculation
  passed: boolean         // Whether player has passed this wall
}
```

**Initial State** (per wall):

```javascript
{
  x: canvasWidth,         // Spawn at right edge
  y: 0,
  width: 60,
  gapY: random(50, canvasHeight - 200),
  gapSize: 150,
  canvasHeight: canvasHeight,
  passed: false
}
```

**State Transitions**:

- X position decreases by WALL_SPEED each frame
- Passed flag set to true when player passes
- Wall removed from array when x + width < 0

**Derived Properties**:

```javascript
topWallHeight = gapY;
bottomWallY = gapY + gapSize;
bottomWallHeight = canvasHeight - bottomWallY;
```

---

### GameState Entity

**Purpose**: Represents overall game state and configuration

**Attributes**:

```javascript
{
  state: string,          // Current game state: 'START', 'PLAYING', 'GAME_OVER'
  score: number,          // Current score
  highScore: number,      // High score from localStorage
  lastTimestamp: number,  // Last frame timestamp for timing
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
}
```

**Initial State**:

```javascript
{
  state: 'START',
  score: 0,
  highScore: 0,           // Loaded from localStorage
  lastTimestamp: 0,
  canvas: canvasElement,
  context: canvasContext
}
```

**State Transitions**:

- START → PLAYING: On play button click
- PLAYING → GAME_OVER: On collision
- GAME_OVER → PLAYING: On restart button click

---

## Configuration Constants

### Physics Constants

```javascript
const GRAVITY = 0.5; // Gravity acceleration (pixels/frame²)
const JUMP_FORCE = -8; // Jump velocity (pixels/frame)
const MAX_FALL_SPEED = 10; // Terminal velocity (pixels/frame)
```

### Game Constants

```javascript
const CANVAS_WIDTH = 800; // Canvas width (pixels)
const CANVAS_HEIGHT = 600; // Canvas height (pixels)
const FPS = 60; // Target frame rate
const FIXED_TIMESTEP = 1000 / 60; // Fixed timestep (milliseconds)
```

### Player Constants

```javascript
const PLAYER_START_X = 100; // Starting X position
const PLAYER_START_Y = 250; // Starting Y position
const PLAYER_SIZE = 40; // Player width and height
```

### Wall Constants

```javascript
const WALL_WIDTH = 60; // Wall width (pixels)
const WALL_SPACING = 250; // Horizontal spacing between walls
const WALL_SPEED = 2; // Wall scroll speed (pixels/frame)
const GAP_SIZE = 150; // Gap height (pixels) - easy difficulty
const MIN_GAP_Y = 50; // Minimum gap top position
const MAX_GAP_Y = CANVAS_HEIGHT - GAP_SIZE - 50; // Maximum gap top position
```

### Visual Constants

```javascript
const BACKGROUND_COLOR = '#87CEEB'; // Sky blue
const WALL_COLOR = '#228B22'; // Forest green
const GROUND_COLOR = '#8B4513'; // Brown
const TEXT_COLOR = '#FFFFFF'; // White
```

---

## Entity Relationships

### Composition Relationships

**GameEngine contains**:

- 1 Player instance
- N Wall instances (array)
- 1 Renderer instance
- 1 InputHandler instance
- 1 AudioManager instance
- 1 UIManager instance
- 1 ScoreManager instance

### Association Relationships

**InputHandler references**:

- GameEngine (for command delegation)

**No other direct relationships** - all communication through GameEngine

---

## Data Structures

### Walls Array

```javascript
walls = [
  Wall { x: 800, gapY: 150, passed: false },
  Wall { x: 1050, gapY: 200, passed: false },
  Wall { x: 1300, gapY: 100, passed: false }
]
```

**Operations**:

- Push: Add new wall to end when spawning
- Shift: Remove first wall when off-screen
- Iterate: Update and check collision for each wall

### Score Data

```javascript
scoreData = {
  current: number, // Current game score
  high: number, // All-time high score
};
```

---

## Business Logic Flows

### Game Initialization Flow

```
1. Load ghosty.png sprite
2. Load jump.wav and game_over.wav audio
3. Load high score from localStorage
4. Initialize player at starting position
5. Create empty walls array
6. Set state to START
7. Display start screen
```

### Game Start Flow

```
1. Reset player to starting position
2. Reset player velocity to 0
3. Clear walls array
4. Reset current score to 0
5. Spawn initial 3 walls with proper spacing
6. Set state to PLAYING
7. Start game loop with requestAnimationFrame
```

### Frame Update Flow (PLAYING state)

```
1. Apply gravity to player velocity
2. Update player position based on velocity
3. Update each wall position (move left)
4. Check if rightmost wall needs spawning
5. Spawn new wall if needed
6. Remove off-screen walls
7. Check collisions (player vs walls, ground, ceiling)
8. If collision: trigger game over
9. Check if player passed any walls
10. Increment score if wall passed
11. Render current frame
```

### Collision Response Flow

```
1. Collision detected
2. Set state to GAME_OVER
3. Play game_over.wav sound
4. Compare current score with high score
5. If current > high: update and save high score
6. Stop game loop
7. Display game over screen with scores
```

### Restart Flow

```
1. User clicks restart button
2. Call game start flow
3. Resume game loop
```

---

## Validation Rules

### Player Validation

- Player Y position must be >= 0 (ceiling)
- Player Y position must be <= canvas.height - player.height (ground)
- Player velocity clamped to MAX_FALL_SPEED

### Wall Validation

- Gap Y position must be >= MIN_GAP_Y
- Gap Y position must be <= MAX_GAP_Y
- Wall width must be > 0
- Gap size must be > 0

### Score Validation

- Score must be >= 0
- Score increments by exactly 1 per wall
- High score must be >= current score when saved

---

## Performance Considerations

### Fixed Timestep Benefits

- Consistent physics regardless of frame rate
- No delta time multiplication needed
- Predictable game behavior
- Simpler calculations

### Optimization Points

- Limit active walls to visible area + buffer
- Remove off-screen walls immediately
- Use simple AABB collision (fast computation)
- Cache sprite and audio assets
- Minimize garbage collection with object reuse
