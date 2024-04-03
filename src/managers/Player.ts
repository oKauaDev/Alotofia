import { StartPlayerConfigs } from "../types/PlayerTypes";
import Game from "./Game";
import PlayerBrain from "./PlayerBrain";

export default class Player {
  private game: Game;
  private id: number;
  private x: number = 0;
  private y: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;
  private color: string;
  private brain: PlayerBrain | undefined;
  private fruitIndex: number = 0;
  private trainPoints: number = 0;

  constructor(config: StartPlayerConfigs) {
    this.game = config.game;
    this.id = config.id;
    this.color = config.color;
    this.x = config.x ?? 0;
    this.y = config.y ?? 0;
  }

  public getGame() {
    return this.game;
  }

  public getID() {
    return this.id;
  }

  public getTrainPoints() {
    return this.trainPoints;
  }

  public getFruitIndex() {
    return this.fruitIndex;
  }

  public setFruitIndex(fruitIndex: number) {
    this.fruitIndex = fruitIndex;
  }

  public addTrainPoints(points = 1) {
    this.trainPoints += points;
  }

  public getColor() {
    return this.color;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getLastX() {
    return this.lastX;
  }

  public getLastY() {
    return this.lastY;
  }

  public getBrain() {
    return this.brain;
  }

  public bottom() {
    if (this.y < this.game.getCanvasConfigs().h - 1) {
      this.lastY = this.y;
      this.y += 1;
    } else {
      this.lastY = 0;
      this.y = 0;
    }

    this.game.renderizeSenary();
  }

  public top() {
    if (this.y > 0) {
      this.lastY = this.y;
      this.y -= 1;
    } else {
      this.lastY = this.game.getCanvasConfigs().h;
      this.y = this.game.getCanvasConfigs().h;
    }

    this.game.renderizeSenary();
  }

  public right() {
    if (this.x < this.game.getCanvasConfigs().w - 1) {
      this.lastX = this.x;
      this.x += 1;
    } else {
      this.lastX = 0;
      this.x = 0;
    }

    this.game.renderizeSenary();
  }

  public left() {
    if (this.x > 0) {
      this.lastX = this.x;
      this.x -= 1;
    } else {
      this.lastX = this.game.getCanvasConfigs().w;
      this.x = this.game.getCanvasConfigs().w;
    }

    this.game.renderizeSenary();
  }

  public async addNeoron(fx: number, fy: number) {
    if (this.brain) {
      const distanceToPrevious = Math.sqrt((this.lastX - fx) ** 2 + (this.lastY - fy) ** 2);
      const distanceToCurrent = Math.sqrt((this.x - fx) ** 2 + (this.y - fy) ** 2);

      if (distanceToCurrent < distanceToPrevious) {
        let label = "top";

        if (this.x < fx) {
          label = "right";
        } else if (this.x > fx) {
          label = "left";
        } else if (this.y < fy) {
          label = "bottom";
        } else if (this.y > fy) {
          label = "top";
        }

        await this.brain.trainByMove(this.x, this.y, fx, fy, label);
      }
    }
  }

  public logout() {
    this.game.unregisterPlayer(this);
    this.brain?.stop();
    this.brain = undefined;
  }

  public async login() {
    this.game.registerPlayer(this);
    this.brain = new PlayerBrain(this);
    this.game.renderizeSenary();
    await this.brain.learn();
  }

  public start() {
    this.brain?.start();
  }
}
