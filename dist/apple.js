import { GameObject } from './gameObject.js';
import { Canvas } from './canvas.js';
class Apple extends GameObject {
    _isVisible = true;
    constructor(image, appleWidth = 30, appleHeight = 30) {
        const x = Math.floor(Math.random() * (Canvas.WIDTH - appleWidth));
        const y = Math.floor(Math.random() * (Canvas.HEIGHT - appleHeight));
        super(x, y, appleWidth, appleHeight, image);
    }
    respawn() {
        this._x = Math.floor(Math.random() * (Canvas.WIDTH - this.w));
        this._y = Math.floor(Math.random() * (Canvas.HEIGHT - this.h));
        this._isVisible = true;
    }
    remove() {
        this._isVisible = false;
    }
    draw(context) {
        if (this._isVisible) {
            super.draw(context);
        }
    }
    isEatenBy(snake) {
        return this._isVisible && (this._x < snake.x + snake.w &&
            this._x + this.w > snake.x &&
            this._y < snake.y + snake.h &&
            this._y + this.h > snake.y);
    }
    get isVisible() {
        return this._isVisible;
    }
}
export { Apple };
//# sourceMappingURL=apple.js.map