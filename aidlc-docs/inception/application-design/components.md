# Flappy Kiro - Component Design

## Component Overview

The game is organized into separate classes, each with a single responsibility following object-oriented design principles.

---

## Core Components

### 1. Player

**Purpose**: Represents Ghosty character with physics and movement

**Responsibilities**:

- Manage player position (x, y coordinates)
- Apply gravity to player
- Handle jump/ascend action
- Track player velocity
- Provide collision bounds for detection
- Maintain player sprite state

---

### 2. Wall

**Purpose**: Represents individual wall obstacle with gap

**Responsibilities**:

- Manage wall position and dimensions
- Define gap position and size
- Track wall movement (scrolling)
- Provide collision bounds for top and bottom sections
- Determine if player has passed through

---

### 3. GameEngine

**Purpose**: Central game controller managing game loop and state

**Responsibilities**:

- Manage game state (START, PLAYING, GAME_OVER)
- Run game loop using requestAnimationFrame
- Coordinate all components
- Handle collision detection
- Manage score tracking
- Control game timing and delta time
- Initialize and reset game

---

### 4. Renderer

**Purpose**: Handles all canvas drawing operations

**Responsibilities**:

- Clear canvas each frame
- Draw background
- Draw player sprite
- Draw walls
- Draw UI elements (score, game over screen, start screen)
- Manage canvas context
- Handle sprite loading and caching

---

### 5. InputHandler

**Purpose**: Manages keyboard input

**Responsibilities**:

- Listen for spacebar key events
- Listen for button click events
- Trigger player jump action
- Handle start/restart button clicks
- Prevent default browser behaviors

---

### 6. AudioManager

**Purpose**: Manages game sound effects

**Responsibilities**:

- Load audio files (jump.wav, game_over.wav)
- Play jump sound on player action
- Play game over sound on collision
- Handle audio preloading
- Manage audio state (muted/unmuted if needed)

---

### 7. UIManager

**Purpose**: Manages game UI screens and overlays

**Responsibilities**:

- Display start screen with play button
- Display current score during gameplay
- Display game over screen with final score and high score
- Display restart button
- Show game instructions
- Handle UI state transitions

---

### 8. ScoreManager

**Purpose**: Manages scoring and high score persistence

**Responsibilities**:

- Track current score
- Increment score when wall passed
- Load high score from localStorage
- Save high score to localStorage
- Provide score data to UI
- Reset score on game restart

---

## Component Interaction Summary

- **GameEngine** orchestrates all components and manages game loop
- **Player** receives input from InputHandler via GameEngine
- **Renderer** draws all visual elements based on component states
- **AudioManager** plays sounds triggered by game events
- **UIManager** displays screens based on game state
- **ScoreManager** provides score data to UIManager and GameEngine
- **Wall** objects managed by GameEngine in an array
