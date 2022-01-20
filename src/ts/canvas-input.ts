import { fromEvent, Subject } from 'rxjs';
import MyMath from './math';
import Point from './point';

export default class CanvasInput {
  points$: Subject<Point[]> = new Subject<Point[]>();

  disabled$: Subject<boolean> = new Subject<boolean>();

  private points: Point[] = [];

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, random: HTMLButtonElement) {
    this.canvas = canvas;
    fromEvent(canvas, 'click').subscribe((event) => {
      this.clickHandler(event as MouseEvent);
      this.points$.next([...this.points]);
    });
    fromEvent(random, 'click').subscribe(() => {
      this.generateRandom();
      this.points$.next([...this.points]);
    });
    this.disabled$.subscribe((disabled) => {
      // eslint-disable-next-line no-param-reassign
      random.disabled = disabled;
    });
  }

  private clickHandler(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const filteredPoints = this.points.filter(
      (p) => MyMath.getDistanceSquared(p, x, y) > 100,
    );
    if (filteredPoints.length !== this.points.length) {
      this.points = filteredPoints;
    } else {
      this.points.push(new Point(x, y));
    }
  }

  private generateRandom() {
    this.points = [];
    for (let i = Math.random() * 50; i > 0; i -= 1) {
      this.points.push(
        new Point(
          Math.trunc((this.canvas.width - 20) * Math.random() + 10),
          Math.trunc((this.canvas.height - 20) * Math.random() + 10),
        ),
      );
    }
  }
}
