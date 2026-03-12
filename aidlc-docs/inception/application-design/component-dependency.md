# Flappy Kiro - Component Dependencies

## Dependency Matrix

| Component    | Depends On                                                                  | Used By      | Communication Pattern  |
| ------------ | --------------------------------------------------------------------------- | ------------ | ---------------------- |
| GameEngine   | Player, Wall, Renderer, InputHandler, AudioManager, UIManager, ScoreManager | InputHandler | Orchestration          |
| Player       | None                                                                        | GameEngine   | Method calls           |
| Wall         | None                                                                        | GameEngine   | Method calls           |
| Renderer     | None                                                                        | GameEngine   | Method calls with data |
| InputHandler | GameEngine                                                                  | None         | Command delegation     |
| AudioManager | None                                                                        | GameEngine   | Event-triggered calls  |
| UIManager    | None                                                                        | GameEngine   | State-based calls      |
| ScoreManager | None                                                                        | GameEngine   | Query/Command calls    |

---

## Dependency Graph

```
                    ┌─────────────┐
                    │ GameEngine  │ (Central Orchestrator)
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐         ┌────────┐        ┌──────────┐
   │ Player │         │  Wall  │        │ Renderer │
   └────────┘         └────────┘        └──────────┘

        ▼                  ▼                  ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ InputHandler │  │ AudioManager │  │  UIManager   │
   └──────────────┘  └──────────────┘  └──────────────┘

                           ▼
                    ┌──────────────┐
                    │ ScoreManager │
                    └──────────────┘
```

---

## Dependency Details

### GameEngine Dependencies

**Direct Dependencies**:

- Player (composition)
- Wall (composition, array)
- Renderer (composition)
- InputHandler (composition)
- AudioManager (composition)
- UIManager (composition)
- ScoreManager (composition)

**Dependency Type**: Composition - GameEngine creates and owns all component instances

**Initialization Order**:

1. Renderer
2. AudioManager
3. ScoreManager
4. Player
5. UIManager
6. InputHandler (requires GameEngine reference)

---

### InputHandler Dependencies

**Direct Dependencies**:

- GameEngine (reference passed in constructor)

**Dependency Type**: Association - InputHandler holds reference to GameEngine

**Communication**:

- Calls GameEngine.start()
- Calls GameEngine.restart()
- Calls GameEngine.player.jump()

---

### Component Independence

**Zero-Dependency Components**:

- Player
- Wall
- Renderer
- AudioManager
- UIManager
- ScoreManager

These components are self-contained and don't depend on other game components, making them:

- Easy to test in isolation
- Reusable in other contexts
- Simple to maintain

---

## Communication Patterns

### Pattern 1: GameEngine → Components (Update)

```
GameEngine.update()
  ├─> Player.update(deltaTime)
  ├─> Wall.update(deltaTime, scrollSpeed) [for each wall]
  └─> ScoreManager.incrementScore() [conditional]
```

### Pattern 2: GameEngine → Components (Query)

```
GameEngine.checkCollisions()
  ├─> Player.getBounds()
  └─> Wall.getBounds() [for each wall]
```

### Pattern 3: GameEngine → Renderer (Render)

```
GameEngine.gameLoop()
  └─> Renderer.render(state, player, walls, score, highScore)
```

### Pattern 4: InputHandler → GameEngine (Command)

```
InputHandler.handleKeyDown()
  └─> GameEngine.player.jump()

InputHandler.handlePlayClick()
  └─> GameEngine.start()

InputHandler.handleRestartClick()
  └─> GameEngine.restart()
```

### Pattern 5: GameEngine → AudioManager (Event)

```
GameEngine.gameOver()
  └─> AudioManager.playGameOver()

Player.jump()
  └─> AudioManager.playJump() [via GameEngine]
```

---

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│   Events    │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ InputHandler │
└──────┬───────┘
       │ Commands
       ▼
┌─────────────────────────────────────────┐
│           GameEngine                    │
│  ┌─────────────────────────────────┐   │
│  │  Game State Machine             │   │
│  │  START → PLAYING → GAME_OVER    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Update Flow:                           │
│  ┌────────┐  ┌────────┐  ┌──────────┐ │
│  │ Player │  │  Wall  │  │  Score   │ │
│  └────────┘  └────────┘  └──────────┘ │
│       │           │            │       │
│       └───────────┴────────────┘       │
│                   │                    │
│            Collision Check             │
│                   │                    │
│       ┌───────────┴────────────┐       │
│       ▼                        ▼       │
│  ┌──────────┐           ┌──────────┐  │
│  │  Audio   │           │   UI     │  │
│  └──────────┘           └──────────┘  │
└───────────┬─────────────────────────────┘
            │ Render Data
            ▼
      ┌──────────┐
      │ Renderer │
      └─────┬────┘
            │
            ▼
      ┌──────────┐
      │  Canvas  │
      └──────────┘
```

---

## Circular Dependency Prevention

**Potential Risk**: InputHandler → GameEngine → InputHandler

**Solution**:

- InputHandler holds reference to GameEngine (one-way)
- GameEngine does NOT hold reference back to InputHandler
- InputHandler is created last and receives GameEngine reference
- No circular dependency exists

---

## Dependency Injection

**Constructor Injection Used**:

- InputHandler receives GameEngine in constructor
- Renderer receives canvas and context in constructor
- All other components are self-contained

**Benefits**:

- Clear dependency declaration
- Easy to test with mocks
- Flexible component replacement

---

## Testing Implications

### Unit Testing Strategy

**Easy to Test (No Dependencies)**:

- Player - Pure logic, no external dependencies
- Wall - Pure logic, no external dependencies
- ScoreManager - Only depends on localStorage (mockable)

**Moderate Testing (Single Dependency)**:

- InputHandler - Requires GameEngine mock
- Renderer - Requires canvas mock

**Integration Testing Required**:

- GameEngine - Orchestrates all components, best tested with integration tests

### Mock Requirements

For unit testing GameEngine:

- Mock Renderer
- Mock AudioManager
- Mock InputHandler
- Use real Player and Wall (simple logic)
- Mock ScoreManager localStorage calls
