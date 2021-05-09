import Conway from './conway';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  let playing = false;

  const game = Conway(100);
  game.randomize();

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  game.draw(canvas);

  const toggleButton = document.getElementById('toggle') as HTMLButtonElement;
  toggleButton.addEventListener('click', function () {
    // The toggle button was clicked, so determine if we should start or stop the game from running.
    if (playing) {
      // The game was running, so stop everything.
      playing = false;
      toggleButton.textContent = 'Start';
    } else {
      // The game wasn't running, so start it up.
      playing = true;
      toggleButton.textContent = 'Stop';

      function compute() {
        if (!playing) { return; }
        game.next();
        game.draw(canvas);
        window.requestAnimationFrame(compute);
      }

      window.requestAnimationFrame(compute);
    }
  });
});
