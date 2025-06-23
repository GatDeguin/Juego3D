# Juego3D

This repository is an early experiment for a small 3D game implemented with **HTML5**, **JavaScript**, **CSS**, and the **Three.js** library. The project explores gravity‑changing mechanics in a minimal web environment.

## Game Concept

The prototype focuses on a simple scene where the player can rotate the direction of gravity. By flipping the world, puzzles and platforming challenges become possible even in a small level.

## Controls

- **Arrow keys / WASD**: Move the player character
- **Space**: Jump
- **G**: Rotate gravity (work in progress)

## Development Setup

The game relies on Three.js for all 3D rendering. No build step is required; just serve the files with a small HTTP server. With Node.js installed you can run:

```bash
npx serve
```

This command launches a local server and prints a URL you can open in your browser. Any static server (e.g., `python3 -m http.server`) will also work.

## How to Run

1. Clone the repository and navigate into its directory.
2. Start a lightweight HTTP server:
   - `npx serve` (recommended), or
   - `python3 -m http.server`
3. Visit the URL printed by the server (`http://localhost:3000` is the default for `serve`), then open `index.html`.
   Loading the file directly may fail to fetch external scripts such as Three.js due to browser security restrictions.

## Project Goal

The core objective is to implement simple controls that allow the player to change gravity during gameplay using Three.js for rendering. The mechanics will eventually let the player rotate or flip the world to solve platforming challenges.
