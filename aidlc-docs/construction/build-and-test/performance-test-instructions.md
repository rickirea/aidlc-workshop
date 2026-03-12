# Performance Test Instructions - Flappy Kiro

## Purpose

Validate game performance meets 60 FPS requirement and memory constraints.

## Performance Requirements

- **Frame Rate**: 60 FPS sustained
- **Frame Time**: < 16.67ms per frame
- **Memory Usage**: < 100MB
- **Load Time**: < 2 seconds to interactive

## Setup Performance Test Environment

### 1. Prepare Browser

- Use Chrome or Firefox for best DevTools
- Close other tabs to reduce interference
- Disable browser extensions that might affect performance

### 2. Open DevTools

- Press F12 to open DevTools
- Navigate to Performance tab
- Navigate to Memory tab (for memory tests)

## Performance Tests

### Test 1: Frame Rate Stability

**Objective**: Verify 60 FPS maintained during gameplay

**Steps**:

1. Open DevTools Performance tab
2. Click "Record" button
3. Start game and play for 30 seconds
4. Pass through multiple walls
5. Stop recording
6. Analyze frame rate graph

**Expected Results**:

- Frame rate stays at 60 FPS
- No significant frame drops
- Frame time consistently < 16.67ms
- No long tasks blocking main thread

**Acceptance Criteria**:

- Average FPS ≥ 58
- 95th percentile frame time < 18ms

---

### Test 2: Memory Usage

**Objective**: Verify no memory leaks during extended play

**Steps**:

1. Open DevTools Memory tab
2. Take heap snapshot (baseline)
3. Play game for 2 minutes
4. Take another heap snapshot
5. Compare memory usage

**Expected Results**:

- Memory usage < 100MB
- No significant memory growth over time
- Wall pool size stays bounded
- No detached DOM nodes

**Acceptance Criteria**:

- Total memory < 100MB
- Memory growth < 10MB over 2 minutes

---

### Test 3: Load Time

**Objective**: Verify game loads quickly

**Steps**:

1. Open DevTools Network tab
2. Hard refresh page (Ctrl+Shift+R)
3. Measure time to interactive
4. Check asset loading times

**Expected Results**:

- Page interactive in < 2 seconds
- All assets load successfully
- No blocking resources

**Acceptance Criteria**:

- Time to interactive < 2s
- All assets load in < 1s

---

### Test 4: Input Latency

**Objective**: Verify responsive controls

**Steps**:

1. Open DevTools Performance tab
2. Record while playing
3. Press spacebar multiple times
4. Analyze input event to visual response time

**Expected Results**:

- Input processed within 1 frame (16.67ms)
- Visual feedback immediate
- No input lag

**Acceptance Criteria**:

- Input latency < 33ms (2 frames)

---

### Test 5: Collision Detection Performance

**Objective**: Verify collision checks don't impact frame rate

**Steps**:

1. Start game
2. Monitor FPS with many walls on screen
3. Intentionally collide with walls multiple times
4. Check frame time during collision checks

**Expected Results**:

- Collision detection completes in < 2ms
- No FPS drops during collision checks
- Spatial optimization working (skips distant walls)

**Acceptance Criteria**:

- Collision check time < 2ms per frame

---

### Test 6: Rendering Performance

**Objective**: Verify rendering completes within frame budget

**Steps**:

1. Open DevTools Performance tab
2. Record during gameplay
3. Analyze rendering time per frame
4. Check for layout thrashing or forced reflows

**Expected Results**:

- Rendering completes in < 8ms per frame
- No layout thrashing
- No unnecessary repaints
- Canvas operations optimized

**Acceptance Criteria**:

- Render time < 8ms per frame

---

### Test 7: Extended Play Session

**Objective**: Verify stable performance over time

**Steps**:

1. Play game continuously for 5 minutes
2. Monitor FPS throughout
3. Check memory usage periodically
4. Verify no degradation

**Expected Results**:

- FPS remains stable at 60
- Memory usage stays constant
- No performance degradation
- No crashes or errors

**Acceptance Criteria**:

- FPS ≥ 58 after 5 minutes
- Memory increase < 20MB

---

## Performance Optimization Checklist

If performance doesn't meet targets:

### Frame Rate Issues

- [ ] Check game loop timing
- [ ] Verify fixed timestep implementation
- [ ] Reduce collision check complexity
- [ ] Optimize rendering operations
- [ ] Check for blocking operations

### Memory Issues

- [ ] Verify wall pool working correctly
- [ ] Check for memory leaks in event listeners
- [ ] Ensure off-screen walls removed
- [ ] Verify no circular references

### Rendering Issues

- [ ] Minimize canvas state changes
- [ ] Reduce draw calls
- [ ] Check for unnecessary clears
- [ ] Optimize text rendering

## Performance Monitoring Tools

### Chrome DevTools

- **Performance Tab**: Record and analyze frame rate
- **Memory Tab**: Heap snapshots and allocation timeline
- **Network Tab**: Asset loading times
- **Rendering Tab**: Paint flashing, layer borders

### Firefox DevTools

- **Performance Tab**: Similar to Chrome
- **Memory Tab**: Memory snapshots
- **Network Tab**: Asset loading

### Manual FPS Counter

Add to GameEngine for development:

```javascript
// In gameLoop method
this.frameCount++;
if (timestamp - this.lastFpsUpdate >= 1000) {
  console.log('FPS:', this.frameCount);
  this.frameCount = 0;
  this.lastFpsUpdate = timestamp;
}
```

## Performance Test Results Template

```
Performance Test Results - [Date]

Frame Rate Test:
- Average FPS: [X]
- Min FPS: [X]
- Frame drops: [X]
- Status: [PASS/FAIL]

Memory Test:
- Initial memory: [X] MB
- After 2 min: [X] MB
- Growth: [X] MB
- Status: [PASS/FAIL]

Load Time Test:
- Time to interactive: [X]s
- Asset load time: [X]s
- Status: [PASS/FAIL]

Input Latency Test:
- Average latency: [X]ms
- Max latency: [X]ms
- Status: [PASS/FAIL]

Overall: [PASS/FAIL]
```
