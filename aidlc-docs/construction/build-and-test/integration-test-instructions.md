# Integration Test Instructions - Flappy Kiro

## Purpose

Test interactions between game components to ensure they work together correctly.

## Test Scenarios

### Scenario 1: Game Initialization Flow

**Description**: Test complete game initialization sequence

**Setup**:

1. Start local HTTP server
2. Open browser to http://localhost:8000
3. Open browser DevTools console

**Test Steps**:

1. Verify page loads without errors
2. Check console for successful asset loading
3. Verify start screen displays
4. Verify Play button is visible

**Expected Results**:

- No console errors
- Start screen rendered correctly
- All components initialized
- Game state = 'START'

**Cleanup**: Refresh page

---

### Scenario 2: Input → Player → Audio Integration

**Description**: Test spacebar input triggers player jump and audio

**Setup**: Start game (click Play button)

**Test Steps**:

1. Press spacebar
2. Observe player movement
3. Listen for jump sound

**Expected Results**:

- Player jumps (velocityY = -8)
- Jump sound plays
- Player sprite moves upward

**Cleanup**: Let game continue or restart

---

### Scenario 3: GameEngine → Renderer Integration

**Description**: Test game loop updates renderer correctly

**Setup**: Start game

**Test Steps**:

1. Observe game for 5 seconds
2. Watch walls scroll
3. Watch player fall
4. Verify score displays

**Expected Results**:

- Walls scroll smoothly from right to left
- Player falls with gravity
- Score displays at top center
- 60 FPS maintained (check with DevTools)

**Cleanup**: Let game continue

---

### Scenario 4: Collision Detection → Game Over Flow

**Description**: Test collision triggers game over sequence

**Setup**: Start game

**Test Steps**:

1. Let player collide with wall (or ground)
2. Observe state change
3. Check audio playback
4. Verify UI update

**Expected Results**:

- Game over sound plays
- State changes to 'GAME_OVER'
- Game loop stops
- Game over screen displays
- Restart button appears
- High score updates if applicable

**Cleanup**: Click Restart

---

### Scenario 5: Score → Wall Integration

**Description**: Test score increments when passing walls

**Setup**: Start game

**Test Steps**:

1. Successfully pass through first wall
2. Observe score
3. Pass through second wall
4. Observe score again

**Expected Results**:

- Score increments by 1 for each wall passed
- Score increments only once per wall
- Score displays correctly on screen

**Cleanup**: Continue or restart game

---

### Scenario 6: Wall Pool → GameEngine Integration

**Description**: Test wall pooling and reuse

**Setup**: Start game

**Test Steps**:

1. Play for 30+ seconds
2. Open console
3. Check: `window.game.wallPool.length`
4. Check: `window.game.walls.length`

**Expected Results**:

- Wall pool contains reused walls (length > 0)
- Active walls count stays around 4-5
- No memory leaks (check DevTools Memory tab)

**Cleanup**: Stop game

---

### Scenario 7: ScoreManager → localStorage Integration

**Description**: Test high score persistence

**Setup**: Clear localStorage first

**Test Steps**:

1. Play game and achieve score of 5
2. Trigger game over
3. Note high score displayed
4. Refresh browser
5. Check high score on start screen

**Expected Results**:

- High score saves to localStorage
- High score persists after refresh
- High score displays correctly

**Cleanup**: None needed

---

### Scenario 8: State Machine → UI Integration

**Description**: Test state transitions update UI correctly

**Setup**: Load game

**Test Steps**:

1. Verify START state: Play button visible, Restart hidden
2. Click Play
3. Verify PLAYING state: Both buttons hidden
4. Trigger game over
5. Verify GAME_OVER state: Restart visible, Play hidden

**Expected Results**:

- UI updates correctly for each state
- Buttons show/hide appropriately
- No UI glitches or flashing

**Cleanup**: Refresh page

---

### Scenario 9: Asset Loading → Graceful Degradation

**Description**: Test fallback behavior when assets fail

**Setup**:

1. Temporarily rename assets/ghosty.png
2. Start local server
3. Load game

**Test Steps**:

1. Observe console for error
2. Start game
3. Verify player renders as rectangle fallback

**Expected Results**:

- Error logged to console
- Game continues to function
- Player renders as white rectangle
- No crashes or blocking errors

**Cleanup**: Restore ghosty.png filename

---

### Scenario 10: Complete Game Session

**Description**: End-to-end integration test

**Setup**: Fresh browser session

**Test Steps**:

1. Load game
2. Click Play
3. Play for 30 seconds
4. Pass through 5+ walls
5. Intentionally collide with wall
6. Verify game over
7. Click Restart
8. Play again

**Expected Results**:

- Complete flow works smoothly
- No errors at any stage
- Score resets on restart
- High score persists
- Performance remains stable

**Cleanup**: None needed

---

## Integration Test Checklist

- [ ] Game initialization flow works
- [ ] Input triggers correct actions
- [ ] Rendering updates smoothly
- [ ] Collision detection works accurately
- [ ] Score increments correctly
- [ ] Wall pooling functions properly
- [ ] High score persists
- [ ] State transitions work
- [ ] Asset fallbacks work
- [ ] Complete game session succeeds

## Performance Monitoring

During integration tests, monitor:

- **FPS**: Should stay at 60 FPS (check DevTools Performance tab)
- **Memory**: Should stay under 100MB (check DevTools Memory tab)
- **Network**: Assets load successfully (check DevTools Network tab)
- **Console**: No errors or warnings

## Common Integration Issues

### Issue: Walls don't spawn

- **Check**: GameEngine.spawnWall() logic
- **Check**: Wall spacing constants

### Issue: Score doesn't increment

- **Check**: Wall.isPassed() logic
- **Check**: Player and wall positions

### Issue: Audio doesn't play

- **Check**: Browser autoplay policy
- **Check**: Audio file paths
- **Check**: AudioManager.audioLoaded flag

### Issue: High score doesn't persist

- **Check**: localStorage availability
- **Check**: ScoreManager.saveHighScore() calls
- **Check**: Browser privacy settings
