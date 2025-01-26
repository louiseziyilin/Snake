//@ts-ignore Import module
import { FirebaseClient } from "./firebaseClient.js";
import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Controller } from './controller.js';
import { 
  MoveLeftCommand, 
  MoveDownCommand, 
  MoveRightCommand, 
  MoveUpCommand 
} from './command.js';
import { Background } from './background.js';
import { Apple } from './apple.js';
import {
  set,
  onDisconnect,
  ref,
  onValue,
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

class Game {
    private canvasElement = document.getElementById("gameScreen") as HTMLCanvasElement;
    private backgroundImage = document.getElementById("gameBackground") as HTMLImageElement;
    private snakeBodyImage = document.getElementById("snakeBody") as HTMLImageElement;
    private appleImage = document.getElementById("apple") as HTMLImageElement;

    private prevTime: number = 0;
    private FPS: number = 60;
    private timeBetweenFrames: number = 1000 / this.FPS;
    private snakeWidth: number = 50;
    private snakeHeight: number = 50;
    private characters = {};
    private apples: Apple[] = [];

    private static _instance: Game;
    private canvas: Canvas = new Canvas();
    private snake: Snake = new Snake(
      (Canvas.WIDTH - this.snakeWidth) / 2, 
      (Canvas.HEIGHT - this.snakeHeight) / 2, 
      this.snakeWidth, 
      this.snakeWidth,
      this.snakeBodyImage
    );
    private controller: Controller = new Controller(
      new MoveUpCommand(this.snake),
      new MoveLeftCommand(this.snake),
      new MoveDownCommand(this.snake),
      new MoveRightCommand(this.snake)
    );
    private background: Background = new Background(
      0,
      0,
      Canvas.WIDTH,
      Canvas.HEIGHT,
      this.backgroundImage
    );

    constructor() {
        this.instantiate();
        // this.initializeApples();
        onDisconnect(
          ref(FirebaseClient.instance.db, `/players/${this.snake._id}`)
        ).set(null);
    }

  //   private initializeApples(count: number = 10): void {
  //     this.apples = Array.from({ length: count }, () => 
  //         new Apple(this.appleImage)
  //     );
  // }

    private instantiate(): void {
      requestAnimationFrame((time) => this.handleNextFrame(time));
    }

    private update(deltaTime: number): void {
      this.canvas.updateCanvasSize();
      this.controller.keyPressHandler(deltaTime);

      //Grab everything from the database and save it locally to my game
      onValue(
        ref(FirebaseClient.instance.db, "/players"),
        (snapshot) => {
          if (snapshot.val()) {
            this.characters = snapshot.val();
  
            //Remove the player, but keep all the other users
            delete this.characters[this.snake.id];
          }
        },
        { onlyOnce: true }
      );
    }

    private draw (): void{
      this.background.draw(this.canvas.context);
      this.snake.draw (this.canvas.context);
      for (let id in this.characters) {
        new Snake(
          this.characters[id].x,
          this.characters[id].y,
          this.snakeWidth, 
          this.snakeWidth,
          this.snakeBodyImage
        ).draw(this.canvas.context);
      }

      this.apples.forEach(apple => {
        if (apple.isEatenBy(this.snake)) {
            this.snake.grow();
            apple.remove();
            
            // Respawn apple after a short delay
            setTimeout(() => {
                apple.respawn();
            }, 500);
        }

        // Draw visible apples
        if (apple.isVisible) {
            apple.draw(this.canvas.context);
        }
      });
    }

  private handleNextFrame(time: number): void {

    const deltaTime = time - this.prevTime;
    if (deltaTime > this.timeBetweenFrames - 0.2) {
      this.update(deltaTime);
      this.draw();
      this.prevTime = time;
    }
    requestAnimationFrame((time) => this.handleNextFrame(time));
  }

  public static get instance(): Game {
    if (!Game._instance) Game._instance = new Game();
    return Game._instance;
  }
}

class Driver {
  constructor() {
    Game.instance;
  }
}

new Driver();