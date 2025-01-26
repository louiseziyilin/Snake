import { FirebaseClient } from "./firebaseClient.js";
import { update, ref,
//@ts-ignore Import module
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
class MoveRightCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveRight(deltaTime);
        new UpdatePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveLeftCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveLeft(deltaTime);
        new UpdatePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveUpCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveUp(deltaTime);
        new UpdatePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveDownCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveDown(deltaTime);
        new UpdatePositionToFirebaseCommand(this.snake).execute();
    }
}
class UpdatePositionToFirebaseCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute() {
        update(ref(FirebaseClient.instance.db, `/players/${this.snake.id}`), {
            x: this.snake.x,
            y: this.snake.y
        });
    }
}
export { MoveDownCommand, MoveLeftCommand, MoveRightCommand, MoveUpCommand, };
//# sourceMappingURL=command.js.map