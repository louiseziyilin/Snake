abstract class GameObject {
  
  constructor(
    protected _x: number,
    protected _y: number,
    protected _w: number,
    protected _h: number,
    protected image: HTMLImageElement
  ) { }

  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public get w(): number {
    return this._w;
  }
  public get h(): number {
    return this._h;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this._x, this._y, this.w, this.h);
  }
}

export { GameObject };