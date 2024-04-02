import { PlayersData } from "../types/GameTypes";
import Fruit from "./Fruit";
import Player from "./Player";

export default class Game {
  private canvas: HTMLCanvasElement;
  private score: HTMLUListElement;
  private context: CanvasRenderingContext2D | null = null;
  private players: Player[] = [];
  private fruits: Fruit[] = [];
  private playersData: PlayersData = {};

  constructor(canvas: HTMLCanvasElement, score: HTMLUListElement) {
    this.canvas = canvas;
    this.score = score;
    this.context = canvas.getContext("2d");
    this.spawnFruit();
  }

  public getFruit() {
    return Math.floor(Math.random() * this.fruits.length);
  }

  public getPlayerByID(id: number) {
    return this.players.find((player) => player.getID() === id);
  }

  public getFruitByIndex(index: number) {
    return this.fruits[index];
  }

  public getCanvasConfigs() {
    return {
      w: this.canvas.width,
      h: this.canvas.height,
    };
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public registerPlayer(player: Player) {
    this.players.push(player);
    this.playersData = {
      ...this.playersData,
      [player.getID()]: { points: 0, color: player.getColor() },
    };
    this.renderizeScore();
  }

  public unregisterPlayer(player: Player) {
    this.players = this.players.filter((p) => p.getID() !== player.getID());
    delete this.playersData[player.getID()];
    this.renderizeScore();
    this.renderizeSenary();
  }

  public spawnFruit() {
    const nFruit = new Fruit(
      this,
      Math.floor(Math.random() * this.getCanvasConfigs().w),
      Math.floor(Math.random() * this.getCanvasConfigs().h)
    );
    this.fruits.push(nFruit);
  }

  public generateFruits() {
    let fruits = this.players.length - this.fruits.length;

    if (fruits <= 0) {
      fruits = this.players.length;
    }

    for (let i = 0; i < fruits; i++) {
      this.spawnFruit();
    }
  }

  public renderizeScore() {
    this.score.innerHTML = "";
    const arrayPoints = Object.keys(this.playersData).map((key) => {
      const player = this.getPlayerByID(Number(key));

      return {
        name: key,
        color: this.playersData[key].color,
        points: this.playersData[key].points,
        train: player?.getTrainPoints() || 0,
      };
    });
    const pointsSort = arrayPoints.sort((a, b) => b.points - a.points);
    pointsSort.forEach((player) => {
      this.score.innerHTML += `
      <li>
        <span class="playerview"><span class="blockplayer" style="background-color: ${player.color}"></span>:</span>
        <span class="jt">
          <span class="points">${player.points}</span>
          <span class="train" style="color: #025b0b;">${player.train}</span>
          <img src="./download.svg" class="p_settings" id="${player.name}" data-actionplayer${player.name}="download" />
          <img src="./delete.svg" class="p_settings" id="${player.name}" data-actionplayer${player.name}="delete" />
        </span>
      </li>
      `;

      const playerDownload = document.querySelector(`[data-actionplayer${player.name}="download"]`);
      const playerDelete = document.querySelector(`[data-actionplayer${player.name}="delete"]`);

      if (playerDownload && playerDelete) {
        playerDownload.addEventListener("click", ({ currentTarget }) => {
          if (currentTarget instanceof HTMLImageElement) {
            const playerid = currentTarget.id;
            const player = this.getPlayerByID(parseInt(playerid));
            if (player) {
              player.getBrain()?.downloadBrain();
            }
          }
        });
        playerDelete.addEventListener("click", ({ currentTarget }) => {
          if (currentTarget instanceof HTMLImageElement) {
            const playerid = currentTarget.id;
            const player = this.getPlayerByID(parseInt(playerid));
            if (player) {
              player.logout();
            }
          }
        });
      }
    });
  }

  public checkCollisions() {
    this.fruits.forEach((fruit, index) => {
      this.players.forEach((player) => {
        player.addNeoron(fruit.getX(), fruit.getY());
      });

      const playerCol = this.players.find((player) => {
        return player.getX() === fruit.getX() && player.getY() === fruit.getY();
      });

      if (playerCol) {
        this.playersData[playerCol.getID()].points += 1;
        this.fruits.splice(index, 1);
        this.generateFruits();
        this.renderizeScore();

        const colisionPlayer = this.getPlayerByID(playerCol.getID());
        if (colisionPlayer) {
          colisionPlayer.setFruitIndex(this.getFruit());
        }
      }
    });
  }

  public renderizeSenary() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.players.forEach((player) => {
        if (this.context) {
          this.context.fillStyle = player.getColor();
          this.context.fillRect(player.getX(), player.getY(), 1, 1);
          this.checkCollisions();
        }
      });

      this.fruits.forEach((fruit) => {
        if (this.context) {
          this.context.fillStyle = "#9b9b9b";
          this.context.fillRect(fruit.getX(), fruit.getY(), 1, 1);
        }
      });
    }
  }
}
