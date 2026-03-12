# Build Instructions - Flappy Kiro

## Prerequisites

- **Build Tool**: None (no build step required)
- **Dependencies**: None (vanilla JavaScript, no npm packages)
- **Environment Variables**: None required
- **System Requirements**:
  - Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
  - Local HTTP server for development

## Build Steps

### 1. Verify File Structure

Ensure all files are in place:

```
workspace-root/
├── index.html
├── styles.css
├── src/
│   ├── Player.js
│   ├── Wall.js
│   ├── GameEngine.js
│   ├── Renderer.js
│   ├── InputHandler.js
│   ├── AudioManager.js
│   ├── UIManager.js
│   ├── ScoreManager.js
│   └── main.js
└── assets/
    ├── ghosty.png
    ├── jump.wav
    └── game_over.wav
```

### 2. No Build Step Required

This project uses native ES6 modules and requires no build process.

- No transpilation needed
- No bundling needed
- No minification needed
- Files are served directly to browser

### 3. Start Local Development Server

ES6 modules require a local HTTP server (cannot use file:// protocol).

**Option 1: Python**

```bash
python -m http.server 8000
```

**Option 2: Node.js**

```bash
npx http-server
```

**Option 3: VS Code Live Server**

- Install "Live Server" extension
- Right-click index.html
- Select "Open with Live Server"

### 4. Open in Browser

Navigate to:

```
http://localhost:8000
```

### 5. Verify Build Success

- **Expected Output**: Game loads with start screen
- **Build Artifacts**: None (no build step)
- **Common Warnings**: None expected

## Troubleshooting

### CORS Errors with ES6 Modules

- **Cause**: Opening index.html directly with file:// protocol
- **Solution**: Use local HTTP server (see Step 3)

### Module Not Found Errors

- **Cause**: Incorrect file paths in import statements
- **Solution**: Verify all import paths use .js extension and correct relative paths

### Assets Not Loading

- **Cause**: Incorrect asset paths or missing files
- **Solution**: Verify assets/ directory contains ghosty.png, jump.wav, game_over.wav

## Deployment Build (Optional)

For production deployment:

### 1. Optional Minification

```bash
# If desired, use terser for minification
npx terser src/*.js -o dist/game.min.js
```

### 2. Deploy Files

Upload all files to web server:

- index.html
- styles.css
- src/ directory (or minified version)
- assets/ directory

### 3. Configure Web Server

Ensure server serves:

- HTML with correct MIME type
- JavaScript modules with `application/javascript` MIME type
- Audio files with correct MIME types
