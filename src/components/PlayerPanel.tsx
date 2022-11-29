import MapCards from "./MapCards";
import { ICard } from "../Types/Cards";

interface PlayerPanelProps {
  header: string;
  cards: ICard[];
  playerTotal: number;
  render?: () => JSX.Element; 
}

function PlayerPanel({ header, cards, playerTotal, render }: PlayerPanelProps) {
  
//     const playerControlPanel = header === "User" && (
//     <>
//       <GameResults
//         totalPlayerInfo={totalPlayerInfo}
//         totalComputerInfo={totalComputerInfo}
//         didPlayerStand={didPlayerStand}
//         didPlayerWin={didPlayerWin}
//         setDidPlayerWin={setDidPlayerWin}
//         setTotalPlayerInfo={setTotalPlayerInfo}
//         setTotalComputerInfo={setTotalComputerInfo}
//       />
//       <section className="btn-container">
//         <button
//           type="button"
//           onClick={() => drawCard()}
//           disabled={didPlayerStand || didPlayerWin !== null}
//         >
//           Hit
//         </button>
//         <button type="button" onClick={() => setDidPlayerStand(true)}>
//           Stand
//         </button>
//         {/* This is reset button can be done by resetting state but I'm out of time */}
//         <button
//           type="button"
//           onClick={() => {
//             window.location.href = "/";
//           }}
//         >
//           Reset
//         </button>
//       </section>
//     </>
//   );

  return (
    <section className="game-panel">
      <h1>{header}</h1>
      <MapCards cards={cards} />
      <div>Total: {playerTotal}</div>
      {/* {playerControlPanel} */}
      {header === "User" && render && render()}
    </section>
  );
}
export default PlayerPanel;
