# Flappy Kiro - Requirements Document

## Intent Analysis Summary

**User Request**: Build a Flappy Bird clone called Flappy Kiro featuring a ghost character (Ghosty) that navigates through walls with gaps.

**Request Type**: New Project - Greenfield game development

**Scope Estimate**: Single application with multiple components (game engine, rendering, physics, input handling, UI)

**Complexity Estimate**: Moderate - Classic game mechanics with well-defined behavior patterns

---

## Functional Requirements

### FR1: Player Character (Ghosty)

- Ghosty sprite rendered using provided ghosty.png asset
- Continuous rightward movement at constant horizontal velocity
- Automatic descent due to gravity simulation
- Ascent triggered by spacebar key press
- Smooth animation and movement

### FR2: Wall Obstacles

- Walls appear as vertical barriers with gaps
- Gaps positioned at random heights
- Consistent horizontal spacing between wall pairs
- Walls scroll from right to left to simulate forward movement
- Simple colored rendering for walls

### FR3: Collision Detection

- Detect collision between Ghosty and walls
- Detect collision between Ghosty and ground
- Detect collision between Ghosty and ceiling (if applicable)
- End gameplay immediately upon any collision

### FR4: Scoring System

- Award 1 point for each successful pass through wall pair
- Display current score during gameplay
- Track and persist high score using browser localStorage
- Display high score on game over screen

### FR5: Game States

- **Start Screen**: Display title, instructions, and "Play" button
- **Playing**: Active gameplay with controls enabled
- **Game Over**: Display final score, high score, and restart button

### FR6: Audio

- Play jump.wav sound effect when spacebar pressed
- Play game_over.wav sound effect when collision occurs
- Audio files loaded from assets/ directory

### FR7: Input Controls

- Spacebar key to make Ghosty ascend
- Click restart button to reset game
- Click play button to start from start screen

---

## Non-Functional Requirements

### NFR1: Performance

- Maintain smooth 60 FPS gameplay on modern browsers
- Efficient rendering using HTML5 Canvas
- Optimized game loop with requestAnimationFrame

### NFR2: Technology Stack

- HTML5 Canvas for rendering
- Vanilla JavaScript (no frameworks)
- No external dependencies beyond browser APIs

### NFR3: Browser Compatibility

- Support modern browsers: Chrome, Firefox, Safari, Edge (latest versions)
- No legacy browser support required

### NFR4: Difficulty

- Easy difficulty level:
  - Larger gap sizes for easier navigation
  - Slower movement speed
  - Moderate gravity strength

### NFR5: User Experience

- Responsive controls with immediate feedback
- Clear visual feedback for game states
- Intuitive UI with minimal learning curve

### NFR6: Code Quality

- Clean, readable vanilla JavaScript
- Modular code structure
- Commented code for maintainability

---

## Technical Constraints

- Must use existing assets: ghosty.png, jump.wav, game_over.wav
- Browser-based application (no server required)
- Client-side only implementation
- localStorage for high score persistence

---

## Success Criteria

- Ghosty responds immediately to spacebar input
- Smooth 60 FPS animation without stuttering
- Accurate collision detection
- Score increments correctly for each wall passed
- High score persists across browser sessions
- Game over screen displays correctly with restart functionality
- Audio plays at appropriate game events

---

## Out of Scope

- Mobile touch controls
- Multiplayer functionality
- Online leaderboards
- Multiple difficulty settings
- Power-ups or special abilities
- Background music
- Multiple character skins
- Level progression or variations
