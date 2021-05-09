import Conway from './conway';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const game = Conway(100);
  game.randomize();
  game.draw(canvas);
});
