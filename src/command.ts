import { FirebaseClient } from "./firebaseClient.js";
import { Snake } from "./snake.js";
import {
  update,
  ref,
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

interface Command {
  execute(deltaTime): void;
}

class MoveRightCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveRight(deltaTime);
    new UpdatePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveLeftCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveLeft(deltaTime);
    new UpdatePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveUpCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveUp(deltaTime);
    new UpdatePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveDownCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveDown(deltaTime);
    new UpdatePositionToFirebaseCommand(this.snake).execute();
  }
}

class UpdatePositionToFirebaseCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(): void {
    update(ref(FirebaseClient.instance.db, `/players/${this.snake.id}`), {
      x: this.snake.x,
      y: this.snake.y
    });
  }
}

export {
  Command,
  MoveDownCommand,
  MoveLeftCommand,
  MoveRightCommand,
  MoveUpCommand,
};
