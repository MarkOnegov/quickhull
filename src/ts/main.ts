import { fromEvent } from 'rxjs';
import CanvasInput from './canvas-input';
import Quickhull from './quickhull';

const canvas = document.getElementsByTagName('canvas').namedItem('canvas');
const random = document
  .getElementsByTagName('button')
  .namedItem('random-button');
const ctx = canvas.getContext('2d');
const canvasInput = new CanvasInput(canvas, random);
const quickhull = new Quickhull(
  canvasInput.points$,
  ctx,
  canvas.width,
  canvas.height,
  canvasInput.disabled$,
);
fromEvent(document.getElementById('animate-button'), 'click').subscribe(() =>
  quickhull.animate(),
);
