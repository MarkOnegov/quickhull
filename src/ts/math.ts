import Line from './line';
import Point from './point';
import Vector from './vector';

export default abstract class MyMath {
  static score(point: Point, { coefficients }: Line) {
    return coefficients.a * point.x + coefficients.b * point.y + coefficients.c;
  }

  static dotProduct(a: Vector, b: Vector) {
    return a.x * b.x + a.y * b.y;
  }

  static getAngle(a: Point, b: Point, c: Point) {
    const v1 = new Vector(a, b);
    const v2 = new Vector(c, b);
    const d = this.dotProduct(v1, v2);
    const dv1 = this.dotProduct(v1, v1);
    const dv2 = this.dotProduct(v2, v2);
    return Math.acos(d / Math.sqrt(dv1 * dv2));
  }

  static getDistance(point: Point, line: Line) {
    return (
      this.score(point, line) /
      Math.sqrt(line.coefficients.a ** 2 + line.coefficients.b ** 2)
    );
  }

  static getDistanceSquared(point: Point, x: number, y: number) {
    const dx = point.x - x;
    const dy = point.y - y;
    return dx * dx + dy * dy;
  }
}
