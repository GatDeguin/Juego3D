// Placeholder for game input and physics integration

// Current gravity vector. This value should be consumed by the physics
// engine each frame to determine how objects fall or move.
let gravity = { x: 0, y: -9.8, z: 0 };

/**
 * Update the gravity vector based on key presses.
 * Arrow keys modify the direction of gravity which will later
 * influence how objects accelerate in the 3D world. This function is
 * intentionally simple for now and does not apply the vector to any
 * objects. Future physics code should query `gravity` each frame and
 * apply forces accordingly.
 */
document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      gravity.y -= 1;
      break;
    case 'ArrowDown':
      gravity.y += 1;
      break;
    case 'ArrowLeft':
      gravity.x -= 1;
      break;
    case 'ArrowRight':
      gravity.x += 1;
      break;
  }
});

// Expose gravity for other modules (if using modules)
export { gravity };
