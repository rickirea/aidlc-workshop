# Flappy Kiro - Component Methods

## Player Class

### Constructor

```javascript
constructor(x, y, size);
```

- Initialize player at starting position
- Set player dimensions

### update(deltaTime)

```javascript
update(deltaTime);
```

- Apply gravity to player velocity
- Update player position based on velocity
- Clamp player within canvas bounds

### jump()

```javascript
jump();
```

- Apply upward velocity to player
- Trigger jump animation if applicable

### getBounds()

```javascript
getBounds() -> {x, y, width, height}
```

- Return collision bounds for player

### reset()

```javascript
reset();
```

- Reset player to starting position
- Reset velocity to zero

---

## Wall Class

### Constructor

```javascript
constructor(x, gapY, gapSize, width, canvasHeight);
```

- Initialize wall position
- Set gap position and size
- Calculate top and bottom wall heights

### update(deltaTime, scrollSpeed)

```javascript
update(deltaTime, scrollSpeed);
```

- Move wall leftward at scroll speed
- Update position based on delta time

### isOffScreen()

```javascript
isOffScreen() -> boolean
```

- Check if wall has moved past left edge

### isPassed(playerX)

```javascript
isPassed(playerX) -> boolean
```

- Check if player has passed through this wall

### getBounds()

```javascript
getBounds() -> {top: {x, y, width, height}, bottom: {x, y, width, height}}
```

- Return collision bounds for top and bottom wall sections

---

## GameEngine Class

### Constructor

```javascript
constructor(canvas);
```

- Initialize all game components
- Set up canvas reference
- Initialize game state

### init()

```javascript
init();
```

- Load assets (sprites, audio)
- Initialize all managers
- Set up event listeners
- Start game in START state

### start()

```javascript
start();
```

- Transition from START to PLAYING state
- Reset game variables
- Begin game loop

### update(deltaTime)

```javascript
update(deltaTime);
```

- Update player
- Update all walls
- Check collisions
- Update score
- Remove off-screen walls
- Spawn new walls

### gameLoop(timestamp)

```javascript
gameLoop(timestamp);
```

- Calculate delta time
- Call update with delta time
- Call render
- Request next animation frame

### checkCollisions()

```javascript
checkCollisions() -> boolean
```

- Check player collision with walls
- Check player collision with ground/ceiling
- Return true if collision detected

### gameOver()

```javascript
gameOver();
```

- Transition to GAME_OVER state
- Stop game loop
- Play game over sound
- Update high score if needed

### restart()

```javascript
restart();
```

- Reset all components
- Clear walls array
- Reset score
- Transition to PLAYING state

### getState()

```javascript
getState() -> string
```

- Return current game state

---

## Renderer Class

### Constructor

```javascript
constructor(canvas, context);
```

- Store canvas and context references
- Initialize sprite cache

### loadAssets()

```javascript
loadAssets() -> Promise
```

- Load ghosty.png sprite
- Return promise when loading complete

### clear()

```javascript
clear();
```

- Clear entire canvas

### drawBackground()

```javascript
drawBackground();
```

- Draw background color or pattern

### drawPlayer(player)

```javascript
drawPlayer(player);
```

- Draw player sprite at player position

### drawWall(wall)

```javascript
drawWall(wall);
```

- Draw top wall section
- Draw bottom wall section
- Draw gap area

### drawScore(score)

```javascript
drawScore(score);
```

- Draw current score at top of screen

### drawStartScreen()

```javascript
drawStartScreen();
```

- Draw title
- Draw play button
- Draw instructions

### drawGameOverScreen(score, highScore)

```javascript
drawGameOverScreen(score, highScore);
```

- Draw "Game Over" text
- Draw final score
- Draw high score
- Draw restart button

### render(gameState, player, walls, score, highScore)

```javascript
render(gameState, player, walls, score, highScore);
```

- Clear canvas
- Draw based on current game state
- Coordinate all drawing operations

---

## InputHandler Class

### Constructor

```javascript
constructor(gameEngine);
```

- Store reference to game engine
- Initialize event listeners

### setupListeners()

```javascript
setupListeners();
```

- Add spacebar keydown listener
- Add button click listeners

### handleKeyDown(event)

```javascript
handleKeyDown(event);
```

- Check if spacebar pressed
- Trigger player jump if in PLAYING state
- Start game if in START state

### handlePlayClick()

```javascript
handlePlayClick();
```

- Start game when play button clicked

### handleRestartClick()

```javascript
handleRestartClick();
```

- Restart game when restart button clicked

---

## AudioManager Class

### Constructor

```javascript
constructor();
```

- Initialize audio objects
- Set up audio file paths

### loadAudio()

```javascript
loadAudio() -> Promise
```

- Load jump.wav
- Load game_over.wav
- Return promise when loading complete

### playJump()

```javascript
playJump();
```

- Play jump sound effect

### playGameOver()

```javascript
playGameOver();
```

- Play game over sound effect

---

## UIManager Class

### Constructor

```javascript
constructor(canvas);
```

- Store canvas reference
- Initialize UI state

### showStartScreen()

```javascript
showStartScreen();
```

- Display start screen elements
- Show play button

### showGameScreen()

```javascript
showGameScreen();
```

- Hide start screen
- Show game canvas

### showGameOverScreen()

```javascript
showGameOverScreen();
```

- Display game over overlay
- Show restart button

### hideAllScreens()

```javascript
hideAllScreens();
```

- Hide all UI overlays

---

## ScoreManager Class

### Constructor

```javascript
constructor();
```

- Initialize score variables
- Load high score from localStorage

### incrementScore()

```javascript
incrementScore();
```

- Increase current score by 1

### getCurrentScore()

```javascript
getCurrentScore() -> number
```

- Return current score

### getHighScore()

```javascript
getHighScore() -> number
```

- Return high score

### updateHighScore()

```javascript
updateHighScore();
```

- Compare current score with high score
- Update high score if current is higher
- Save to localStorage

### reset()

```javascript
reset();
```

- Reset current score to 0

### loadHighScore()

```javascript
loadHighScore();
```

- Load high score from localStorage
- Default to 0 if not found

### saveHighScore()

```javascript
saveHighScore();
```

- Save high score to localStorage
