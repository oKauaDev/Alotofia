import Player from "./Player";
import * as tf from "@tensorflow/tfjs";
import { labels as moves, getTraining, labels } from "../ia/data";

export default class PlayerBrain {
  private player: Player;
  private model: tf.Sequential | tf.LayersModel | undefined;
  private interval: NodeJS.Timeout | undefined;

  constructor(player: Player) {
    this.player = player;
  }

  public getPlayer() {
    return this.player;
  }

  private createModel() {
    const model = tf.sequential();

    model.add(
      tf.layers.conv1d({
        inputShape: [1, 4],
        filters: 15,
        kernelSize: 1,
      })
    );

    model.add(
      tf.layers.dense({
        units: moves.length,
        activation: "softmax",
      })
    );

    this.getPlayer().addTrainPoints(moves.length);

    const learningRate = 0.25;
    const optimizer = tf.train.sgd(learningRate);

    model.compile({
      optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }

  private async firstTrain() {
    if (!this.model) {
      this.model = this.createModel();
    }

    let trainingData = getTraining();

    let input = tf.tensor3d(trainingData.input.map((item) => [item]));
    let output = tf
      .oneHot(tf.tensor1d(trainingData.output, "int32"), labels.length)
      .cast("float32")
      .expandDims(1);

    await this.model.fit(input, output, { epochs: 1, shuffle: true, validationSplit: 0.1 });
  }

  public async trainByMove(xIA: number, yIA: number, xFRUT: number, yFRUT: number, move: string) {
    if (!this.model) {
      console.error("O modelo ainda não foi treinado!");
      return;
    }

    try {
      let input = tf.tensor3d([[[xIA, yIA, xFRUT, yFRUT]]]);
      let output = tf
        .oneHot(tf.tensor1d([move], "int32"), labels.length)
        .cast("float32")
        .expandDims(1);

      await this.model.fit(input, output, { epochs: 1, shuffle: true, validationSplit: 0.1 });
      this.getPlayer().addTrainPoints();
    } catch (e) {
      console.error("Erro ao treinar o modelo:", e);
    }
  }

  private async predict(px: number, py: number, nx: number, ny: number) {
    if (!this.model) {
      console.error("O modelo ainda não foi treinado!");
      return;
    }

    let input = tf.tensor3d([[[px, py, nx, ny]]]);
    let results = this.model.predict(input);
    if (Array.isArray(results)) {
      const result = results[0];
      let argMax = result.argMax(2);
      let index = argMax.dataSync()[0];
      let label = labels[index];
      return label as "left" | "right" | "bottom" | "top";
    } else {
      let argMax = results.argMax(2);
      let index = argMax.dataSync()[0];
      let label = labels[index];
      return label as "left" | "right" | "bottom" | "top";
    }
  }

  public downloadBrain() {
    if (!this.model) {
      console.error("O modelo ainda não foi treinado!");
      return;
    }

    this.model.save(`downloads://${this.player.getID()}_alotofia_model`);
  }

  public async learn() {
    await this.firstTrain();
  }

  public stop() {
    if (this.interval) {
      this.model = undefined;
      clearInterval(this.interval);
    }
  }

  public start() {
    this.interval = setInterval(async () => {
      const fruitIndex = this.player.getFruitIndex();
      const fruit = this.player.getGame().getFruitByIndex(fruitIndex);
      if (fruit) {
        const move = await this.predict(
          this.player.getX(),
          this.player.getY(),
          fruit.getX(),
          fruit.getY()
        );
        console.log(move);
        if (move) {
          switch (move) {
            case "left":
              this.player.left();
              break;
            case "right":
              this.player.right();
              break;
            case "bottom":
              this.player.bottom();
              break;
            case "top":
              this.player.top();
              break;
          }
        }
      }
    }, 200);
  }
}
