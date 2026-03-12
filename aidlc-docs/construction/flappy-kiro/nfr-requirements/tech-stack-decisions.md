# Flappy Kiro - Tech Stack Decisions

## Technology Selection

### Frontend Technology: HTML5 Canvas + Vanilla JavaScript

**Decision**: Use HTML5 Canvas 2D with vanilla JavaScript ES6+

**Rationale**:

- Native browser support, no dependencies
- Excellent performance for 2D games
- Direct control over rendering pipeline
- Simple deployment (no build step)
- Meets 60 FPS requirement easily

**Alternatives Considered**:

- Game frameworks (Phaser, PixiJS): Rejected - unnecessary overhead for simple game
- WebGL: Rejected - overkill for 2D sprite game
- Python/Pygame: Rejected - requires desktop installation

---

## Module System: ES6 Modules

**Decision**: Use native ES6 modules with type="module"

**Rationale**:

- Native browser support in modern browsers
- Clean import/export syntax
- No build tools required
- Automatic strict mode
- Better code organization

**Implementation**:

```html
<script
  type="module"
  src="src/main.js"
></script>
```

**File Structure**:

```
src/
  ├── Player.js          (export class Player)
  ├── Wall.js            (export class Wall)
  ├── GameEngine.js      (export class GameEngine)
  ├── Renderer.js        (export class Renderer)
  ├── InputHandler.js    (export class InputHandler)
  ├── AudioManager.js    (export class AudioManager)
  ├── UIManager.js       (export class UIManager)
  ├── ScoreManager.js    (export class ScoreManager)
  └── main.js            (import all, initialize game)
```

---

## Rendering Technology: Canvas 2D API

**Decision**: Use Canvas 2D Context for all rendering

**Rationale**:

- Perfect for 2D sprite-based games
- Simple API, easy to use
- Excellent performance for this use case
- Wide browser support

**Key APIs Used**:

- `context.clearRect()` - Clear canvas
- `context.fillRect()` - Draw walls
- `context.drawImage()` - Draw sprite
- `context.fillText()` - Draw text
- `context.fillStyle` - Set colors

---

## Performance Optimization Strategy

### requestAnimationFrame

**Decision**: Use requestAnimationFrame for game loop

**Rationale**:

- Browser-optimized timing
- Automatic pause when tab inactive
- Syncs with display refresh rate
- Best practice for animations

### Fixed Timestep

**Decision**: Fixed timestep at 60 FPS

**Rationale**:

- Consistent physics behavior
- Predictable game speed
- Simpler calculations
- No delta time scaling needed

### Rendering Optimizations

**Strategies**:

- Full canvas clear each frame (simple and fast)
- Minimize state changes in canvas context
- Cache loaded sprites and audio
- Limit active objects (walls) to visible area

---

## State Management: localStorage

**Decision**: Use localStorage for high score persistence

**Rationale**:

- Simple key-value storage
- Synchronous API (no async complexity)
- Persistent across sessions
- No server required

**Storage Schema**:

```javascript
localStorage.setItem('flappyKiroHighScore', '42');
```

**Limitations Accepted**:

- Per-browser storage (not synced across devices)
- Can be cleared by user
- Limited to single high score value

---

## Audio Technology: HTMLAudioElement

**Decision**: Use standard HTML5 Audio API

**Rationale**:

- Simple API for sound effects
- Adequate for short audio clips
- Wide browser support
- No dependencies required

**Implementation**:

```javascript
const jumpSound = new Audio('assets/jump.wav');
jumpSound.play();
```

**Lazy Loading**:

- Audio objects created on AudioManager initialization
- Files loaded on first play() call
- No preloading screen needed

---

## Development Approach

### No Build Tools

**Decision**: No webpack, rollup, or other bundlers

**Rationale**:

- Keep development simple
- Fast iteration cycle
- No build configuration needed
- Direct browser refresh for testing

**Trade-offs Accepted**:

- No code minification
- No tree shaking
- Slightly larger file sizes
- Multiple HTTP requests for modules

### Local Development

**Decision**: Simple HTTP server for local testing

**Options**:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code Live Server extension
```

---

## Browser API Decisions

### Canvas 2D Context

**Usage**: All rendering operations
**Fallback**: None needed (universally supported)

### localStorage

**Usage**: High score persistence
**Fallback**: In-memory high score if unavailable

### requestAnimationFrame

**Usage**: Game loop timing
**Fallback**: None needed (universally supported in modern browsers)

### KeyboardEvent

**Usage**: Spacebar input detection
**Fallback**: None needed (standard API)

### HTMLAudioElement

**Usage**: Sound effect playback
**Fallback**: Silent gameplay if audio fails

---

## Error Handling Strategy

### Graceful Degradation

**Approach**: Game continues with fallbacks on errors

**Fallback Scenarios**:

**Sprite Loading Failure**:

- Fallback: Draw colored rectangle for player
- Log: console.error('Failed to load sprite')
- Impact: Visual only, gameplay unaffected

**Audio Loading Failure**:

- Fallback: Silent gameplay
- Log: console.error('Failed to load audio')
- Impact: No sound, gameplay unaffected

**localStorage Unavailable**:

- Fallback: In-memory high score (session only)
- Log: console.warn('localStorage unavailable')
- Impact: High score not persisted

**requestAnimationFrame Unavailable**:

- Fallback: None (required API, universally supported)
- Impact: Game won't run (acceptable for modern browsers)

---

## Quality Attributes

### Maintainability

**Target**: Easy to understand and modify
**Strategies**:

- Clear class responsibilities
- Descriptive method names
- Inline comments for complex logic
- Consistent code style

### Testability

**Target**: Components can be tested independently
**Strategies**:

- Loose coupling between components
- Dependency injection where needed
- Pure functions for calculations
- Mockable external dependencies

### Extensibility

**Target**: Easy to add features later
**Design Considerations**:

- Modular component structure
- Configuration constants for easy tuning
- Clear interfaces between components
- State machine for game flow

---

## Performance Targets Summary

| Metric        | Target  | Maximum | Measurement         |
| ------------- | ------- | ------- | ------------------- |
| Frame Rate    | 60 FPS  | 55 FPS  | performance.now()   |
| Frame Time    | 16.67ms | 18ms    | Delta calculation   |
| Memory Usage  | < 50MB  | < 100MB | Browser DevTools    |
| Load Time     | < 1s    | < 2s    | Time to interactive |
| Input Latency | < 16ms  | < 33ms  | Keypress to action  |

---

## Technology Constraints

### Must Use

- HTML5 Canvas 2D
- Vanilla JavaScript (no frameworks)
- ES6 modules
- Standard browser APIs only

### Must Not Use

- External JavaScript libraries
- Build tools or bundlers
- Server-side components
- Database systems
- CSS frameworks

### Optional

- CSS for basic styling
- Simple HTTP server for local development
- Browser DevTools for debugging
