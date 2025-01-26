// import { GameObject } from './gameObject.js';
// import { Controller } from './controller.js';
// import { Utility } from './utility.js';
// import { Canvas } from './canvas.js';
// import { Background } from './background.js';

// class Snake extends GameObject {
//   private _velocity: number = 200;
//   private _health: number = 10000;
//   public maxHealth: number;
//   private segments: Array<{ x: number, y: number }> = [];

//   constructor(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     image: HTMLImageElement
//   ) {
//     super(x, y, width, height, image);
//     this._health = 10000;
//     this.maxHealth = 10000;

//     // Initialize snake with 3 segments
//     for (let i = 0; i < 3; i++) {
//       this.segments.push({ x: x - i * width + 10, y: y });
//       console.log(i);
//     }
//   }

//   /** Draws the snake with its segments on the canvas. */
//   public draw(context: CanvasRenderingContext2D): void {
//     this.segments.forEach(segment => {
//       context.drawImage(this.image, segment.x, segment.y, this.w, this.h);
//       console.log('a');
//     });
//   }

//   public update(controller: Controller, deltaTime: number): void {
//     let velocityX = 0;
//     let velocityY = 0;

//     if (controller.left) {
//       velocityX = -Utility.adjustForDeltaTime(this._velocity, deltaTime);
//     }

//     if (controller.right) {
//       velocityX = Utility.adjustForDeltaTime(this._velocity, deltaTime);
//     }

//     if (controller.up) {
//       velocityY = -Utility.adjustForDeltaTime(this._velocity, deltaTime);
//     }

//     if (controller.down) {
//       velocityY = Utility.adjustForDeltaTime(this._velocity, deltaTime);
//     }

//     // Normalize velocity for diagonal movement
//     if (velocityX !== 0 && velocityY !== 0) {
//       const normalizationFactor = Math.sqrt(2) / 2; // derives from Pythagorean theorem
//       velocityX *= normalizationFactor;
//       velocityY *= normalizationFactor;
//     }

//     this.moveSnake(velocityX, velocityY);

//     // Set up boundaries
//     this._x = Math.max(0, Math.min(this._x, Canvas.WIDTH - this.w));
//     this._y = Math.max(0, Math.min(this._y, Canvas.HEIGHT - this.h));
//   }

//     public moveRight(deltaTime: number): void {
//     this._x += Utility.adjustForDeltaTime(this._velocity, deltaTime);
//   }

//   public moveLeft(deltaTime: number): void {
//     this._x -= Utility.adjustForDeltaTime(this._velocity, deltaTime);
//   }

//   public moveUp(deltaTime: number): void {
//     this._y -= Utility.adjustForDeltaTime(this._velocity, deltaTime);
//   }

//   public moveDown(deltaTime: number): void {
//     this._y += Utility.adjustForDeltaTime(this._velocity, deltaTime);
//   }

//   private moveSnake(velocityX: number, velocityY: number): void {
//     // Update the head position
//     const newHead = { x: this.segments[0].x + velocityX, y: this.segments[0].y + velocityY };

//     // Add new head to the front of the segments array
//     this.segments.unshift(newHead);

//     // Remove the last segment to maintain the length
//     this.segments.pop();
//   }

//   public get velocity(): number {
//     return this._velocity;
//   }

//   /** Reduces the player's health by a specified amount.
//    * @param {number} amount - The amount of damage taken by the player.
//    */
//   public takeDamage(amount: number): void {
//     this._health -= amount;
//     if (this._health <= 0) {
//       this._health = 0;
//     }
//   }

//   public get health(): number {
//     return this._health;
//   }
// }
// export { Snake };

import { GameObject } from './gameObject.js';
import { Controller } from './controller.js';
import { Utility } from './utility.js';
import { Canvas } from './canvas.js';
//@ts-ignore Import module
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@3.3.4/nanoid.min.js";

class Snake extends GameObject {
  private _velocity: number = 200;
  private _health: number = 10000;
  public maxHealth: number;
  private segments: Array<{ x: number, y: number }> = [];
  private segmentImage: HTMLImageElement;
  public _id: string = nanoid();

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLImageElement
  ) {
    super(x, y, width, height, image);
    this._health = 10000;
    this.maxHealth = 10000;
    this.segmentImage = image;

    // Initialize snake with 3 segments, spaced out properly
    for (let i = 0; i < 3; i++) {
      this.segments.push({ x: x - i * width, y: y });
    }
  }

  /** Draws the snake with its segments on the canvas. */
  public draw(context: CanvasRenderingContext2D): void {
    this.segments.forEach((segment, index) => {
      context.drawImage(this.segmentImage, segment.x, segment.y, this.w, this.h);
    });
  }

  public grow(): void {
    // Add a new segment at the end of the snake
    const lastSegment = this.segments[this.segments.length - 1];
    this.segments.push({ x: lastSegment.x, y: lastSegment.y });
  }

  // public update(controller: Controller, deltaTime: number): void {
  //   let velocityX = 0;
  //   let velocityY = 0;

  //   if (controller.a) {
  //     velocityX = -Utility.adjustForDeltaTime(this._velocity, deltaTime);
  //   }

  //   if (controller.d) {
  //     velocityX = Utility.adjustForDeltaTime(this._velocity, deltaTime);
  //   }

  //   if (controller.w) {
  //     velocityY = -Utility.adjustForDeltaTime(this._velocity, deltaTime);
  //   }

  //   if (controller.s) {
  //     velocityY = Utility.adjustForDeltaTime(this._velocity, deltaTime);
  //   }

  //   // Normalize velocity for diagonal movement
  //   if (velocityX !== 0 && velocityY !== 0) {
  //     const normalizationFactor = Math.sqrt(2) / 2; // derives from Pythagorean theorem
  //     velocityX *= normalizationFactor;
  //     velocityY *= normalizationFactor;
  //   }

  //   // this.moveSnake(velocityX, velocityY);

  //   // Set up boundaries
  //   this._x = Math.max(0, Math.min(this._x, Canvas.WIDTH - this.w));
  //   this._y = Math.max(0, Math.min(this._y, Canvas.HEIGHT - this.h));
  // }

  public moveRight(deltaTime: number): void {
    this._x += Utility.adjustForDeltaTime(this._velocity, deltaTime);
  }

  public moveLeft(deltaTime: number): void {
    this._x -= Utility.adjustForDeltaTime(this._velocity, deltaTime);
  }

  public moveUp(deltaTime: number): void {
    this._y -= Utility.adjustForDeltaTime(this._velocity, deltaTime);
  }

  public moveDown(deltaTime: number): void {
    this._y += Utility.adjustForDeltaTime(this._velocity, deltaTime);
  }
  

  public takeDamage(amount: number): void {
    this._health -= amount;
    if (this._health <= 0) {
      this._health = 0;
    }
  }

  public get health(): number {
    return this._health;
  }

  public get id(): string {
    return this._id;
  }
}
export { Snake };
