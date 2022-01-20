import { concatMap, delay, from, Observable, of, Subject } from 'rxjs';
import Line from './line';
import MyMath from './math';
import Point from './point';

type State = {
  maxPoint: Point;
  currentLine: Line;
  currentPoints: Point[];
  hull: Point[];
};

export default class Quickhull {
  private readonly delayMs = 500;

  hull: Point[] = [];

  private ctx: CanvasRenderingContext2D;

  private width: number;

  private height: number;

  private points: Point[];

  private first: boolean;

  states: State[];

  private disable$: Subject<boolean>;

  constructor(
    points: Observable<Point[]>,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    disable$?: Subject<boolean>,
  ) {
    this.ctx = ctx;
    ctx.lineWidth = 2;
    this.width = width;
    this.height = height;
    this.disable$ = disable$;
    points.subscribe((ps) => {
      this.findHull(ps);
    });
  }

  findHull(points: Point[]) {
    this.points = points;
    this.states = [];
    if (points.length < 4) {
      this.hull = points;
    } else {
      const pointsSorted = [...points].sort((a, b) => a.x - b.x);
      const min = pointsSorted[0];
      const max = pointsSorted[pointsSorted.length - 1];
      const hull = [min];
      const upHull = this.step(max, min, pointsSorted, hull);
      hull.push(max);
      const downHull = this.step(min, max, pointsSorted, hull);
      this.hull = [min, ...upHull, max, ...downHull];
    }
    this.drawHull();
  }

  animate() {
    if (this.disable$) this.disable$.next(true);
    this.first = true;
    if (this.states) {
      from([...this.states, undefined])
        .pipe(
          concatMap((state) => {
            if (this.first) {
              return of(state);
            }
            return of(state).pipe(delay(500));
          }),
        )
        .subscribe({
          next: this.drawState.bind(this),
          complete: () => {
            this.drawHull();
            if (this.disable$) this.disable$.next(false);
          },
        });
    }
  }

  private drawHull() {
    this.ctx.fillStyle = '#333';
    this.ctx.strokeStyle = '#2ca1db';
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.hull.forEach((point) => point.draw(this.ctx));
    for (let index = 0; index < this.hull.length - 1; index += 1) {
      Line.draw(this.ctx, this.hull[index], this.hull[index + 1]);
    }
    Line.draw(this.ctx, this.hull[0], this.hull[this.hull.length - 1]);
    this.points.forEach((p) => p.draw(this.ctx));
  }

  private drawState(state: State) {
    if (!state) {
      return;
    }
    this.first = false;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (state.hull.length) {
      this.ctx.strokeStyle = '#2ca1db';
      this.ctx.beginPath();
      this.ctx.moveTo(state.hull[0].x, state.hull[0].y);
      state.hull.forEach((p) => this.ctx.lineTo(p.x, p.y));
      this.ctx.closePath();
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = '#dbd516';
    state.currentLine.draw(this.ctx);

    this.ctx.fillStyle = '#333';
    this.points.forEach((p) => p.draw(this.ctx));

    this.ctx.fillStyle = '#169adb';
    state.currentPoints.forEach((p) => p.draw(this.ctx));

    this.ctx.fillStyle = '#db4251';
    state.maxPoint.draw(this.ctx);
  }

  private step(
    left: Point,
    right: Point,
    points: Point[],
    hull: Point[],
  ): Point[] {
    if (!points.length) {
      return [];
    }
    const currentLine = new Line(left, right);
    let maxD = -1;
    const currentPoints = points.filter((point) => {
      const d = MyMath.getDistance(point, currentLine as Line);
      maxD = Math.max(d, maxD);
      return !(point === left || point === right) && d > 0;
    });
    if (maxD <= 0 || !currentPoints.length) {
      return [];
    }
    const maxPoints = currentPoints.filter(
      (point) => MyMath.getDistance(point, currentLine as Line) === maxD,
    );
    let maxAngle = -Math.PI * 2;
    let maxPoint = maxPoints[0];
    maxPoints.forEach((point) => {
      const angle = MyMath.getAngle(point, left, right);
      if (angle > maxAngle) {
        maxAngle = angle;
        maxPoint = point;
      }
    });
    const leftIndex = hull.indexOf(left);
    const rightIndex = hull.indexOf(right);
    if (leftIndex >= 0 && leftIndex + 1 < hull.length) {
      hull.splice(leftIndex + 1, 0, maxPoint);
    } else if (rightIndex >= 0) {
      hull.splice(rightIndex, 0, maxPoint);
    } else {
      hull.push(maxPoint);
    }
    this.states.push({ currentLine, maxPoint, currentPoints, hull: [...hull] });
    const rightHull = this.step(maxPoint, right, currentPoints, hull);
    const leftHull = this.step(left, maxPoint, currentPoints, hull);

    return [...rightHull, maxPoint, ...leftHull];
  }
}
