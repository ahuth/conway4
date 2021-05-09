import Conway from './conway';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  const game = Conway(100);
  game.randomize();

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  game.draw(canvas);

  const nextButton = document.getElementById('next') as HTMLButtonElement;
  nextButton.addEventListener('click', function () {
    game.next();
    game.draw(canvas);
  });
});
