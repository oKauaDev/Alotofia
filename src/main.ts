import "./style.css";
import Loader from "./utils/Loader";

const loader = Loader();

const canvas = document.querySelector<HTMLCanvasElement>(".canvas");
const score = document.querySelector<HTMLUListElement>("[data-score]");
const modal = document.querySelector<HTMLDivElement>(".settings_modal");
const formSetting = document.querySelector<HTMLFormElement>(`[data-settings="initialize"]`);
loader.hidden();

const colors = [
  "#ec5002",
  "#ecb002",
  "#ecf002",
  "#8cec02",
  "#02ec02",
  "#02ecb0",
  "#02ecf0",
  "#028cec",
  "#0202ec",
  "#5802ec",
  "#b002ec",
  "#f002ec",
  "#ec02e0",
  "#ec02b0",
  "#ec02f0",
];

if (formSetting) {
  formSetting.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const players = formData.get("players");
    const date_brain = formData.get("date_brain");

    //@ts-ignore
    window.inteligence = date_brain ? Number(date_brain) : null;

    if (canvas && score && modal) {
      loader.visible();
      loader.text("Importando classes...");
      const Game = (await import("./managers/Game")).default;
      const Player = (await import("./managers/Player")).default;

      loader.text("Criando jogo...");
      modal.classList.add("hidden");
      const game = new Game(canvas, score);
      const spanPlayers = async () => {
        const spawnedPlayers: unknown[] = [];
        for (let i = 0; i < Number(players); i++) {
          const player1 = new Player({
            game: game,
            id: i + 1,
            color: colors[i],
          });

          loader.text(`Treinando Jogador ${i + 1}...`);
          await player1.login();
          spawnedPlayers.push(player1);
        }

        spawnedPlayers.forEach((player, i) => {
          loader.text(`Iniciando Jogador ${i + 1}...`);
          (player as any).start();
        });

        loader.hidden();
      };

      spanPlayers();
    }
  });
}
