import MapCards from "./MapCards";
import { ICard } from "../Types/Cards";

interface PlayerPanelProps {
  header: string;
  cards: ICard[];
  playerTotal: number;
  render?: () => JSX.Element; 
}

function PlayerPanel({ header, cards, playerTotal, render }: PlayerPanelProps) {

  return (
    <section className="game-panel">
      <h1>{header}</h1>
      <MapCards cards={cards} />
      <div>Total: {playerTotal}</div>
      {header === "User" && render && render()}
    </section>
  );
}
export default PlayerPanel;
