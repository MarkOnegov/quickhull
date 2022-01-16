import { fromEvent } from 'rxjs';
import CanvasInput from './canvas-input';
import Point from './point';
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

let disabled = false;
const animateButton = document
  .getElementsByTagName('button')
  .namedItem('animate-button');
const createIssueButton = document
  .getElementsByTagName('button')
  .namedItem('issue-button');

canvasInput.disabled$.subscribe((d) => {
  disabled = d;
  animateButton.disabled = d;
  createIssueButton.disabled = d;
});

fromEvent(animateButton, 'click').subscribe(() => {
  if (!disabled) {
    quickhull.animate();
  }
});

let points: Point[] = [];
// eslint-disable-next-line no-return-assign
canvasInput.points$.subscribe((ps) => (points = ps));

const popup = document.getElementById('issue-popup');
const overlay = popup.getElementsByClassName('overlay')[0];
const link = popup.getElementsByTagName('a')[0];
const pointsOutput = document.getElementById(
  'points-output',
) as HTMLTextAreaElement;

fromEvent(createIssueButton, 'click').subscribe(() => {
  if (disabled) {
    return;
  }
  const pointsStr = `Points: [${points
    .map((p) => `(${p.x}, ${p.y})`)
    .join(', ')}]`;
  pointsOutput.value = pointsStr;
  popup.classList.add('active');
  setTimeout(() => popup.classList.add('show'), 200);
});

const closePopup = () => {
  popup.classList.remove('show');
  setTimeout(() => popup.classList.remove('active'), 200);
};

fromEvent(overlay, 'click').subscribe(closePopup);
fromEvent(link, 'click').subscribe(closePopup);
