import Game from "./Game";

export default class Fruit {
  private game: Game;
  private x: number = 0;
  private y: number = 0;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getGame() {
    return this.game;
  }
}
