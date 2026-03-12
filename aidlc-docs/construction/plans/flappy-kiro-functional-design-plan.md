# Functional Design Plan - Flappy Kiro

## Design Objectives

- Define detailed game physics and mechanics algorithms
- Model game entities and their state
- Define business rules for collision detection, scoring, and game flow
- Design data structures and transformations

## Functional Design Questions

### Question 1: Physics Model

What physics model should be used for player movement?

A) Simple constant gravity with instant velocity change on jump
B) Realistic physics with acceleration, deceleration, and terminal velocity
C) Arcade-style with tweakable gravity and jump force values
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2: Collision Detection Algorithm

What collision detection approach should be used?

A) Simple AABB (Axis-Aligned Bounding Box) rectangle collision
B) Pixel-perfect collision detection
C) Circular collision bounds for player
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3: Wall Generation Pattern

How should walls be generated and managed?

A) Fixed pattern with predetermined gap positions
B) Random gap positions within min/max bounds
C) Procedural generation with difficulty curve
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: Score Increment Logic

When exactly should the score increment?

A) When player's center passes wall's center x-coordinate
B) When player's right edge passes wall's right edge
C) When player completely clears the wall gap
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 5: Game Loop Timing

How should frame timing be handled?

A) Fixed timestep (update at fixed intervals regardless of frame rate)
B) Variable timestep (update based on actual elapsed time)
C) Hybrid (fixed logic updates, variable rendering)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Functional Design Tasks

### Business Logic Modeling

- [x] Define game physics calculations (gravity, velocity, jump force)
- [x] Model collision detection algorithm
- [x] Design wall generation and spawning logic
- [x] Define score increment logic
- [x] Model game state transitions

### Domain Entities

- [x] Define Player entity structure (position, velocity, size, state)
- [x] Define Wall entity structure (position, gap, dimensions, passed flag)
- [x] Define GameState entity (current state, score, high score, timing)
- [x] Define configuration constants (gravity, jump force, wall speed, etc.)

### Business Rules

- [x] Define collision detection rules
- [x] Define scoring rules
- [x] Define game over conditions
- [x] Define wall spawning rules
- [x] Define player boundary constraints

### Data Flow

- [x] Document input processing flow
- [x] Document physics update flow
- [x] Document collision check flow
- [x] Document rendering data flow
- [x] Document state persistence flow

### Validation

- [x] Verify all game mechanics are well-defined
- [x] Ensure physics calculations are complete
- [x] Validate business rules cover all scenarios
- [x] Check for edge cases and error conditions
