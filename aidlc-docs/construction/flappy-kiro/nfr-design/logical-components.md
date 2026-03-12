# Flappy Kiro - Logical Components

## Component Architecture

The game uses a layered architecture with clear separation of concerns.

---

## Layer 1: Core Game Logic

### GameEngine (Orchestrator)

**Type**: Controller/Orchestrator
**Responsibility**: Central coordinator for all game operations

**Logical Structure**:

```
GameEngine
├── State Management (START, PLAYING, GAME_OVER)
├── Game Loop (requestAnimationFrame)
├── Component Coordination
├── Collision Detection
└── Wall Pool Management
```

**Key Algorithms**:

- Game loop with fixed timestep
- Collision detection with spatial optimization
- Wall spawning and cleanup
- State machine transitions

---

### Player (Entity)

**Type**: Domain Entity
**Responsibility**: Player physics and state

**Logical Structure**:

```
Player
├── Position (x, y)
├── Velocity (velocityY)
├── Dimensions (width, height)
└── Physics Methods (update, jump, getBounds)
```

**Key Algorithms**:

- Gravity application
- Velocity clamping
- Position updates

---

### Wall (Entity)

**Type**: Domain Entity
**Responsibility**: Wall obstacle state and behavior

**Logical Structure**:

```
Wall
├── Position (x, y)
├── Dimensions (width, gapY, gapSize)
├── State (passed flag)
└── Methods (update, getBounds, reset)
```

**Key Algorithms**:

- Horizontal movement
- Bounds calculation
- Pass detection

---

## Layer 2: Rendering and Presentation

### Renderer (View)

**Type**: Presentation Component
**Responsibility**: All visual rendering

**Logical Structure**:

```
Renderer
├── Canvas Context
├── Sprite Cache
├── Drawing Methods
│   ├── drawBackground()
│   ├── drawPlayer()
│   ├── drawWall()
│   ├── drawScore()
│   ├── drawStartScreen()
│   └── drawGameOverScreen()
└── Asset Loading
```

**Key Operations**:

- Canvas clearing
- Sprite rendering
- Primitive drawing (rectangles, text)
- Screen composition

---

### UIManager (View Controller)

**Type**: UI State Manager
**Responsibility**: UI screen visibility and transitions

**Logical Structure**:

```
UIManager
├── Screen State
├── Button Handlers
└── Screen Methods
    ├── showStartScreen()
    ├── showGameScreen()
    └── showGameOverScreen()
```

---

## Layer 3: Input and Audio

### InputHandler (Controller)

**Type**: Input Controller
**Responsibility**: Capture and delegate user input

**Logical Structure**:

```
InputHandler
├── Event Listeners
│   ├── Keyboard (spacebar)
│   └── Mouse (button clicks)
├── GameEngine Reference
└── Handler Methods
    ├── handleKeyDown()
    ├── handlePlayClick()
    └── handleRestartClick()
```

**Key Operations**:

- Event listening
- Input validation
- Command delegation to GameEngine

---

### AudioManager (Service)

**Type**: Audio Service
**Responsibility**: Sound effect playback

**Logical Structure**:

```
AudioManager
├── Audio Cache
│   ├── jumpSound
│   └── gameOverSound
├── Loading State
└── Playback Methods
    ├── playJump()
    └── playGameOver()
```

**Key Operations**:

- Audio loading
- Sound playback
- Error handling

---

## Layer 4: Data Management

### ScoreManager (Service)

**Type**: Data Service
**Responsibility**: Score tracking and persistence

**Logical Structure**:

```
ScoreManager
├── Score State
│   ├── currentScore
│   └── highScore
├── Storage Interface (localStorage)
└── Score Methods
    ├── incrementScore()
    ├── updateHighScore()
    ├── loadHighScore()
    └── saveHighScore()
```

**Key Operations**:

- Score tracking
- localStorage read/write
- High score comparison

---

## Component Interaction Layers

### Layer Flow

```
┌─────────────────────────────────────────┐
│  Layer 3: Input/Audio                   │
│  ┌──────────────┐    ┌──────────────┐  │
│  │InputHandler  │    │AudioManager  │  │
│  └──────┬───────┘    └──────▲───────┘  │
└─────────┼──────────────────┼───────────┘
          │                  │
          ▼                  │
┌─────────────────────────────────────────┐
│  Layer 1: Core Logic                    │
│  ┌──────────────────────────────────┐   │
│  │       GameEngine                 │   │
│  │  ┌────────┐  ┌────────┐         │   │
│  │  │ Player │  │  Wall  │         │   │
│  │  └────────┘  └────────┘         │   │
│  └──────┬───────────────┬───────────┘   │
└─────────┼───────────────┼───────────────┘
          │               │
          ▼               ▼
┌─────────────────────────────────────────┐
│  Layer 2: Presentation                  │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Renderer    │    │  UIManager   │  │
│  └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  Layer 4: Data                          │
│  ┌──────────────┐                       │
│  │ScoreManager  │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

---

## Logical Component Responsibilities

### Orchestration Layer

- **GameEngine**: Coordinates all components, manages game loop, handles collisions

### Entity Layer

- **Player**: Player physics and state
- **Wall**: Wall state and movement

### Presentation Layer

- **Renderer**: Visual rendering
- **UIManager**: UI screen management

### Service Layer

- **InputHandler**: Input capture and delegation
- **AudioManager**: Audio playback
- **ScoreManager**: Score persistence

---

## Performance-Critical Components

### High-Frequency Operations (60 times/second)

1. **GameEngine.update()** - Must complete in < 8ms
2. **Player.update()** - Must complete in < 1ms
3. **Wall.update()** - Must complete in < 0.5ms per wall
4. **GameEngine.checkCollisions()** - Must complete in < 2ms
5. **Renderer.render()** - Must complete in < 8ms

### Low-Frequency Operations

1. **ScoreManager.saveHighScore()** - Only on game over
2. **AudioManager.playSound()** - Only on events
3. **UIManager.showScreen()** - Only on state changes

---

## Memory Profile

### Static Memory (Allocated Once)

- GameEngine instance: ~1KB
- Component instances: ~5KB total
- Sprite image: ~10-50KB
- Audio buffers: ~50-100KB

### Dynamic Memory (During Gameplay)

- Active walls: 4-5 walls × ~1KB = ~5KB
- Wall pool: 10 walls × ~1KB = ~10KB
- Total dynamic: ~15KB

### Total Memory Footprint

- Expected: ~100-200KB
- Well under 50MB target

---

## Initialization Sequence

```
1. Page Load
   └─> Create GameEngine(canvas)

2. GameEngine.init()
   ├─> Create Renderer(canvas, context)
   ├─> Create AudioManager()
   ├─> Create ScoreManager()
   ├─> Create Player(x, y, size)
   ├─> Create UIManager(canvas)
   ├─> Create InputHandler(this)
   ├─> Initialize wall pool
   ├─> Load assets (parallel)
   │   ├─> Renderer.loadAssets()
   │   └─> AudioManager.loadAudio()
   └─> Set state to START

3. User clicks Play
   └─> GameEngine.start()
       ├─> Reset player
       ├─> Clear walls
       ├─> Reset score
       ├─> Spawn initial walls
       ├─> Set state to PLAYING
       └─> Start game loop
```

---

## Component Lifecycle

### Singleton Components (Created Once)

- GameEngine
- Renderer
- AudioManager
- ScoreManager
- Player
- UIManager
- InputHandler

### Pooled Components (Reused)

- Wall (pool of 10, 4-5 active)

### Transient Components

- None (all components are long-lived)
