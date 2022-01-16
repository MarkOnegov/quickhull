import Point from './point';

export default class Vector {
  x: number;

  y: number;

  constructor(a: Point | number, b: Point | number) {
    if (a instanceof Point && b instanceof Point) {
      this.x = b.x - a.x;
      this.y = b.y - a.y;
      return;
    }
    if (typeof a === 'number' && typeof b === 'number') {
      this.x = a;
      this.y = b;
      return;
    }
    throw new Error();
  }
}
