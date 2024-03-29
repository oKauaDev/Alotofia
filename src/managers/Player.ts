import { StartPlayerConfigs } from "../types/PlayerTypes";
import Game from "./Game";
import PlayerBrain from "./PlayerBrain";

export default class Player {
  private game: Game;
  private id: number;
  private x: number = 0;
  private y: number = 0;
  private color: string;
  private brain: PlayerBrain | undefined;
  private fruitIndex: number = 0;

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

  public getFruitIndex() {
    return this.fruitIndex;
  }

  public setFruitIndex(fruitIndex: number) {
    this.fruitIndex = fruitIndex;
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

  public getBrain() {
    return this.brain;
  }

  public bottom() {
    if (this.y < this.game.getCanvasConfigs().h - 1) {
      this.y += 1;
      this.game.renderizeSenary();
    }
  }

  public top() {
    if (this.y > 0) {
      this.y -= 1;
      this.game.renderizeSenary();
    }
  }

  public right() {
    if (this.x < this.game.getCanvasConfigs().w - 1) {
      this.x += 1;
      this.game.renderizeSenary();
    }
  }

  public left() {
    if (this.x > 0) {
      this.x -= 1;
      this.game.renderizeSenary();
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
