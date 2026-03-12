# Flappy Kiro - Service Layer Design

## Service Architecture

The game uses a centralized orchestration pattern with GameEngine as the primary service coordinator.

---

## Primary Service: GameEngine

### Service Type

**Orchestration Service** - Coordinates all game components and manages game lifecycle

### Responsibilities

- Initialize all game components
- Manage game state machine (START → PLAYING → GAME_OVER)
- Orchestrate game loop execution
- Coordinate component updates
- Manage collision detection workflow
- Handle game events and state transitions

### Service Interactions

#### Initialization Flow

1. GameEngine creates all component instances
2. GameEngine calls Renderer.loadAssets()
3. GameEngine calls AudioManager.loadAudio()
4. GameEngine initializes InputHandler with self-reference
5. GameEngine sets initial state to START

#### Game Start Flow

1. InputHandler detects play button click
2. InputHandler calls GameEngine.start()
3. GameEngine resets all components
4. GameEngine transitions to PLAYING state
5. GameEngine begins game loop

#### Game Loop Flow (60 FPS)

1. GameEngine.gameLoop() called by requestAnimationFrame
2. GameEngine calculates deltaTime
3. GameEngine.update() orchestrates:
   - Player.update(deltaTime)
   - Wall.update(deltaTime, scrollSpeed) for each wall
   - GameEngine.checkCollisions()
   - ScoreManager.incrementScore() if wall passed
4. GameEngine calls Renderer.render() with current state
5. GameEngine requests next animation frame

#### Collision Detection Flow

1. GameEngine.checkCollisions() called each frame
2. GameEngine gets Player.getBounds()
3. GameEngine gets Wall.getBounds() for each wall
4. GameEngine performs AABB collision detection
5. If collision detected, GameEngine.gameOver() called

#### Game Over Flow

1. GameEngine.gameOver() called
2. GameEngine transitions to GAME_OVER state
3. GameEngine calls AudioManager.playGameOver()
4. GameEngine calls ScoreManager.updateHighScore()
5. GameEngine stops game loop
6. Renderer displays game over screen

#### Restart Flow

1. InputHandler detects restart button click
2. InputHandler calls GameEngine.restart()
3. GameEngine resets Player
4. GameEngine clears walls array
5. GameEngine calls ScoreManager.reset()
6. GameEngine transitions to PLAYING state
7. GameEngine resumes game loop

---

## Supporting Services

### Renderer Service

**Type**: Utility Service
**Pattern**: Stateless rendering service called by GameEngine
**Interaction**: GameEngine passes all necessary data to Renderer.render()

### AudioManager Service

**Type**: Utility Service
**Pattern**: Event-driven audio playback
**Interaction**: GameEngine triggers audio methods based on game events

### ScoreManager Service

**Type**: Data Service
**Pattern**: Encapsulates score state and persistence
**Interaction**: GameEngine queries and updates score through ScoreManager methods

### InputHandler Service

**Type**: Event Service
**Pattern**: Event listener that delegates to GameEngine
**Interaction**: Captures user input and calls GameEngine methods

### UIManager Service

**Type**: View Service
**Pattern**: Manages UI visibility based on game state
**Interaction**: GameEngine state changes trigger UI updates

---

## Service Communication Patterns

### Pattern 1: Command Pattern

- InputHandler sends commands to GameEngine (start, restart, jump)
- GameEngine executes commands and updates state

### Pattern 2: Query Pattern

- GameEngine queries component state (getBounds, getScore)
- Components return data without side effects

### Pattern 3: Update Pattern

- GameEngine calls update() on all components each frame
- Components update their internal state

### Pattern 4: Render Pattern

- GameEngine passes all render data to Renderer
- Renderer draws everything in single render() call

---

## Data Flow

```
User Input → InputHandler → GameEngine → Player/Walls
                                ↓
                          Collision Check
                                ↓
                          ScoreManager
                                ↓
                          AudioManager
                                ↓
                    Renderer ← All Component States
                                ↓
                            Canvas Display
```

---

## State Management

### Centralized State in GameEngine

- **Game State**: START, PLAYING, GAME_OVER
- **Player Reference**: Single Player instance
- **Walls Array**: Array of active Wall instances
- **Score Reference**: ScoreManager instance
- **Timing State**: lastTimestamp, deltaTime

### Component-Level State

- **Player**: position, velocity, size
- **Wall**: position, gapY, gapSize, passed flag
- **ScoreManager**: currentScore, highScore

### No Shared Global State

- All state accessed through GameEngine
- Components don't directly communicate
- Clean separation of concerns
