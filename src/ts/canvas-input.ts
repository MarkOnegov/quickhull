import { fromEvent, Observable, Subject } from 'rxjs';
import MyMath from './math';
import Point from './point';

export default class CanvasInput {
  points$: Observable<Point[]>;

  disabled$: Subject<boolean> = new Subject<boolean>();

  private points: Point[] = [];

  private disabled = false;

  private width: number;

  private height: number;

  constructor(canvas: HTMLCanvasElement, random: HTMLButtonElement) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.points$ = new Observable<Point[]>((sub) => {
      if (this.disabled) {
        return;
      }
      fromEvent(canvas, 'click').subscribe((event) => {
        this.clickHandler(event as MouseEvent);
        sub.next(this.points);
      });
      fromEvent(random, 'click').subscribe(() => {
        this.generateRandom();
        sub.next(this.points);
      });
    });
    this.disabled$.subscribe((disabled) => {
      console.log(disabled);
      this.disabled = disabled;
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
        new Point(this.width * Math.random(), this.height * Math.random()),
      );
    }
  }
}
