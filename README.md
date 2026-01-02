# Sudoku Game

A cross-platform Sudoku game for iOS and Android.

## Overview

This is a mobile-friendly Sudoku game built with HTML, CSS, and JavaScript, designed to work seamlessly on both iOS and Android devices.

## Features

- Classic Sudoku gameplay
- Four difficulty levels (Easy, Medium, Hard, Expert)
- Mobile-optimized interface
- Touch-friendly controls
- Dark/Light mode support
- Game save/resume functionality
- Undo, Erase, and Hint features
- Timer and mistake tracking
- Best time statistics per difficulty
- Progressive Web App (PWA) support

## Tech Stack

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (Vanilla)
- Capacitor for native iOS/Android deployment
- Progressive Web App (PWA) capabilities

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open `http://localhost:8000` in a web browser

### Mobile Deployment

```bash
# Build for Android
npx cap add android
npx cap sync android
npx cap open android

# Build for iOS
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Project Structure

```
sudoku-game/
├── index.html          # Main menu
├── difficulty.html     # Difficulty selection
├── game.html           # Game board
├── sudoku.js           # Core game logic
├── sw.js               # Service worker for PWA
├── manifest.json       # PWA configuration
├── capacitor.config.json
├── android/            # Android project
└── ios/                # iOS project
```

## License

MIT License - see [LICENSE](LICENSE) for details.
