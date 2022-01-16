import Point from './point';

export type LineCoefficients = {
  a: number;
  b: number;
  c: number;
};

export default class Line {
  startPoint: Point;

  endPoint: Point;

  coefficients: LineCoefficients;

  constructor(startPoint: Point, endPoint: Point) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    if (startPoint.x === endPoint.y) {
      if (startPoint.y < endPoint.y) {
        this.coefficients = { a: -1, b: 0, c: startPoint.x };
        return;
      }
      this.coefficients = { a: -1, b: 0, c: -startPoint.x };
      return;
    }
    const k = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
    const c = -k * endPoint.x + endPoint.y;
    if (startPoint.x < endPoint.x) {
      this.coefficients = { a: -k, b: 1, c: -c };
      return;
    }
    this.coefficients = { a: k, b: -1, c };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.stroke();
  }

  static draw(
    ctx: CanvasRenderingContext2D,
    startPoint: Point,
    endPoint: Point,
  ) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }
}
