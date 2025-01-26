import { GameObject } from './gameObject.js';
import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { FirebaseClient } from './firebaseClient.js';
import { 
  ref, 
  set, 
  onValue 
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

interface AppleData {
  x: number;
  y: number;
  visible: boolean;
}

class Apple extends GameObject {
  private _isVisible: boolean = true;
  private _firebaseRef: any;

  constructor(
    image: HTMLImageElement,
    id: number,
    appleWidth: number = 50,
    appleHeight: number = 50
  ) {
    // Initial coordinates will be set by Firebase
    super(0, 0, appleWidth, appleHeight, image);
    
    // Create a Firebase reference for this specific apple
    this._firebaseRef = ref(FirebaseClient.instance.db, `/apples/${id}`);
  }

  public initializeLocation(): void {
    // Only initialize if location isn't already set in Firebase
    set(this._firebaseRef, {
      x: Math.floor(Math.random() * (Canvas.WIDTH - this.w)),
      y: Math.floor(Math.random() * (Canvas.HEIGHT - this.h)),
      visible: true
    });
  }

  public listenForUpdates(callback?: () => void): void {
    onValue(this._firebaseRef, (snapshot) => {
      const data = snapshot.val() as AppleData;
      if (data) {
        this._x = data.x;
        this._y = data.y;
        this._isVisible = data.visible;
        
        if (callback) callback();
      }
    });
  }

  public remove(): void {
    set(this._firebaseRef, {
      x: this._x,
      y: this._y,
      visible: false
    });
  }

  public respawn(): void {
    set(this._firebaseRef, {
      x: Math.floor(Math.random() * (Canvas.WIDTH - this.w)),
      y: Math.floor(Math.random() * (Canvas.HEIGHT - this.h)),
      visible: true
    });
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (this._isVisible) {
      super.draw(context);
    }
  }

  public isEatenBy(snake: Snake): boolean {
    return this._isVisible && (
      this._x < snake.x + snake.w &&
      this._x + this.w > snake.x &&
      this._y < snake.y + snake.h &&
      this._y + this.h > snake.y
    );
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }
}

export { Apple };