import Loader from "../utils/Loader";

export const labels = ["left", "right", "bottom", "top"];

export function generateTrainModel() {
  function randomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateMove(xIA: number, yIA: number, xFRUT: number, yFRUT: number) {
    let label = "";

    if (xIA < xFRUT) {
      label = "right";
    } else if (xIA > xFRUT) {
      label = "left";
    } else if (yIA < yFRUT) {
      label = "bottom";
    } else if (yIA > yFRUT) {
      label = "top";
    }

    return {
      xIA,
      yIA,
      xFRUT,
      yFRUT,
      label,
    };
  }

  function generateTrainingData(numMoves: number) {
    const moves = [];
    for (let i = 0; i < numMoves; i++) {
      const xIA = randomInRange(0, 20);
      const yIA = randomInRange(0, 20);
      const xFRUT = randomInRange(0, 20);
      const yFRUT = randomInRange(0, 20);

      const move = generateMove(xIA, yIA, xFRUT, yFRUT);
      moves.push(move);
    }

    return moves;
  }

  //@ts-ignore
  const numMoves = window.inteligence ?? 10000;

  const loader = Loader();
  loader.text(`Iniciando treinamento com ${numMoves} pontos de inteligência...`);

  const trainingData = generateTrainingData(numMoves);

  return trainingData;
}

export const getTraining = () => {
  return {
    input: input(),
    output: output(),
  };
};

const input = () => moves.map((color) => [color.xIA, color.yIA, color.xFRUT, color.yFRUT]);

const output = () => {
  let result = moves.map((color) => labels.indexOf(color.label));
  return result;
};

export const moves = generateTrainModel();
