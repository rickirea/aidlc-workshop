# Flappy Kiro - Non-Functional Requirements

## Performance Requirements

### NFR-P1: Frame Rate

**Requirement**: Maintain consistent 60 FPS during gameplay
**Priority**: Critical
**Measurement**: Monitor frame time using performance.now()
**Target**: 16.67ms per frame maximum
**Acceptance**: No frame drops during normal gameplay

### NFR-P2: Rendering Performance

**Requirement**: Optimize canvas rendering for smooth animation
**Priority**: High
**Strategy**:

- Use requestAnimationFrame for optimal timing
- Clear only necessary canvas areas (or full clear if faster)
- Minimize draw calls per frame
- Cache rendered elements where possible

### NFR-P3: Memory Management

**Requirement**: Prevent memory leaks during extended gameplay
**Priority**: Medium
**Strategy**:

- Reuse wall objects when possible
- Remove off-screen walls promptly
- Limit active wall count to 4-5 maximum
- No unbounded array growth

### NFR-P4: Input Responsiveness

**Requirement**: Immediate response to spacebar input
**Priority**: Critical
**Target**: < 16ms latency from keypress to jump action
**Implementation**: Direct event handler without debouncing

---

## Browser Compatibility Requirements

### NFR-B1: Supported Browsers

**Requirement**: Support modern browsers only
**Browsers**:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### NFR-B2: Required Browser APIs

**APIs Used**:

- Canvas 2D Context (standard)
- localStorage (standard)
- HTMLAudioElement (standard)
- requestAnimationFrame (standard, widely supported)
- ES6 Modules (type="module" in script tag)

**Fallback Strategy**:

- No polyfills required for modern browsers
- Graceful degradation for missing features

### NFR-B3: No Mobile Support

**Requirement**: Desktop browsers only
**Rationale**: Spacebar control not applicable to mobile
**Future**: Could add touch controls in future iteration

---

## Code Quality Requirements

### NFR-Q1: Code Organization

**Requirement**: Multiple files with ES6 modules
**Structure**:

```
src/
  ├── Player.js
  ├── Wall.js
  ├── GameEngine.js
  ├── Renderer.js
  ├── InputHandler.js
  ├── AudioManager.js
  ├── UIManager.js
  ├── ScoreManager.js
  └── main.js (entry point)
```

### NFR-Q2: JavaScript Version

**Requirement**: ES6+ features allowed
**Features Used**:

- Classes
- Arrow functions
- const/let
- Template literals
- ES6 modules (import/export)

### NFR-Q3: Code Style

**Requirement**: Clean, readable code
**Standards**:

- Consistent naming conventions (camelCase)
- Meaningful variable names
- Comments for complex logic
- No dead code
- DRY principle

### NFR-Q4: No Build Tools

**Requirement**: No build step required
**Rationale**: Keep development simple
**Implementation**: Native ES6 modules in browser

---

## Reliability Requirements

### NFR-R1: Error Handling

**Requirement**: Graceful degradation on errors
**Strategy**:

- Asset loading failures: Use fallbacks (colored rectangles, no sound)
- localStorage unavailable: Continue without high score persistence
- Audio playback errors: Continue without sound
- Log all errors to console for debugging

### NFR-R2: Asset Loading

**Requirement**: Lazy load assets as needed
**Strategy**:

- Load sprite when Renderer initializes
- Load audio when AudioManager initializes
- Game can start before assets fully loaded
- Display loading indicator if needed

### NFR-R3: State Recovery

**Requirement**: Game recovers from invalid states
**Strategy**:

- Validate state transitions
- Default to START state on errors
- Reset game on unrecoverable errors

---

## Usability Requirements

### NFR-U1: Visual Clarity

**Requirement**: Clear visual feedback for all game states
**Implementation**:

- Distinct start screen with instructions
- Visible score during gameplay
- Clear game over screen with scores
- High contrast colors for visibility

### NFR-U2: Audio Feedback

**Requirement**: Audio cues for key actions
**Implementation**:

- Jump sound on player action
- Game over sound on collision
- No background music (per requirements)

### NFR-U3: Responsive Controls

**Requirement**: Immediate feedback on input
**Implementation**:

- No input lag
- Visual/audio feedback on actions
- Clear button states (hover, active)

---

## Maintainability Requirements

### NFR-M1: Code Documentation

**Requirement**: Inline comments for complex logic
**Areas to Document**:

- Physics calculations
- Collision detection algorithm
- Game loop timing
- State transitions

### NFR-M2: Modular Architecture

**Requirement**: Loosely coupled components
**Benefits**:

- Easy to test individual components
- Simple to modify or extend
- Clear separation of concerns

### NFR-M3: Configuration Management

**Requirement**: Game constants in one location
**Implementation**:

- Constants defined at top of relevant files
- Easy to adjust difficulty by changing constants
- No magic numbers in code

---

## Security Requirements

### NFR-S1: Client-Side Only

**Requirement**: No server communication
**Rationale**: Simple browser game with no sensitive data
**Implication**: No authentication, no API calls, no data transmission

### NFR-S2: localStorage Safety

**Requirement**: Safe localStorage usage
**Implementation**:

- Only store high score (non-sensitive)
- Validate data when reading
- Handle localStorage quota errors
- No user-generated content stored

---

## Scalability Requirements

### NFR-SC1: Not Applicable

**Rationale**: Single-player browser game
**No Requirements For**:

- Concurrent users
- Server scaling
- Database scaling
- Load balancing

---

## Availability Requirements

### NFR-A1: Client-Side Availability

**Requirement**: Game available when browser is open
**Rationale**: No server dependencies
**Uptime**: 100% (dependent only on browser)

---

## Performance Metrics

### Key Performance Indicators

**Frame Rate**:

- Target: 60 FPS
- Minimum: 55 FPS
- Measurement: performance.now() delta

**Memory Usage**:

- Target: < 50MB
- Maximum: < 100MB
- Measurement: Browser dev tools

**Load Time**:

- Target: < 1 second to interactive
- Maximum: < 2 seconds
- Measurement: Time to first playable frame

**Input Latency**:

- Target: < 16ms
- Maximum: < 33ms (2 frames)
- Measurement: Time from keypress to visual response

---

## Tech Stack Summary

**Core Technologies**:

- HTML5 Canvas 2D
- Vanilla JavaScript (ES6+)
- CSS3 for styling
- Native ES6 modules

**Browser APIs**:

- Canvas 2D Context
- requestAnimationFrame
- localStorage
- HTMLAudioElement
- KeyboardEvent

**Development Tools**:

- No build tools required
- Browser dev tools for debugging
- Simple HTTP server for local testing

**No External Dependencies**:

- No npm packages
- No frameworks
- No libraries
- Pure browser APIs only
