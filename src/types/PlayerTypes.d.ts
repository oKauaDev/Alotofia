import Game from "../managers/Game";

export interface StartPlayerConfigs {
  game: Game;
  id: number;
  color: string;
  x?: number;
  y?: number;
}
