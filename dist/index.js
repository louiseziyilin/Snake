//@ts-ignore Import module
import { FirebaseClient } from "./firebaseClient.js";
import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Controller } from './controller.js';
import { MoveLeftCommand, MoveDownCommand, MoveRightCommand, MoveUpCommand } from './command.js';
import { Background } from './background.js';
import { Apple } from './apple.js';
import { onDisconnect, ref, onValue,
//@ts-ignore Import module
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
class Game {
    canvasElement = document.getElementById("gameScreen");
    backgroundImage = document.getElementById("gameBackground");
    snakeBodyImage = document.getElementById("snakeBody");
    appleImage = document.getElementById("apple");
    prevTime = 0;
    FPS = 60;
    timeBetweenFrames = 1000 / this.FPS;
    snakeWidth = 50;
    snakeHeight = 50;
    characters = {};
    apples = [];
    static _instance;
    canvas = new Canvas();
    snake = new Snake((Canvas.WIDTH - this.snakeWidth) / 2, (Canvas.HEIGHT - this.snakeHeight) / 2, this.snakeWidth, this.snakeWidth, this.snakeBodyImage);
    controller = new Controller(new MoveUpCommand(this.snake), new MoveLeftCommand(this.snake), new MoveDownCommand(this.snake), new MoveRightCommand(this.snake));
    background = new Background(0, 0, Canvas.WIDTH, Canvas.HEIGHT, this.backgroundImage);
    constructor() {
        this.instantiate();
        this.initializeApples();
        onDisconnect(ref(FirebaseClient.instance.db, `/players/${this.snake._id}`)).set(null);
    }
    initializeApples(count = 10) {
        this.apples = Array.from({ length: count }, () => new Apple(this.appleImage));
    }
    instantiate() {
        requestAnimationFrame((time) => this.handleNextFrame(time));
    }
    update(deltaTime) {
        this.canvas.updateCanvasSize();
        this.controller.keyPressHandler(deltaTime);
        //Grab everything from the database and save it locally to my game
        onValue(ref(FirebaseClient.instance.db, "/players"), (snapshot) => {
            if (snapshot.val()) {
                this.characters = snapshot.val();
                //Remove the player, but keep all the other users
                delete this.characters[this.snake.id];
            }
        }, { onlyOnce: true });
    }
    draw() {
        this.background.draw(this.canvas.context);
        this.snake.draw(this.canvas.context);
        for (let id in this.characters) {
            new Snake(this.characters[id].x, this.characters[id].y, this.snakeWidth, this.snakeWidth, this.snakeBodyImage).draw(this.canvas.context);
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
    handleNextFrame(time) {
        const deltaTime = time - this.prevTime;
        if (deltaTime > this.timeBetweenFrames - 0.2) {
            this.update(deltaTime);
            this.draw();
            this.prevTime = time;
        }
        requestAnimationFrame((time) => this.handleNextFrame(time));
    }
    static get instance() {
        if (!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    }
}
class Driver {
    constructor() {
        Game.instance;
    }
}
new Driver();
//# sourceMappingURL=index.js.map