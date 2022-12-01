import { drawCards } from "../API/getRequests";
import { ITotalInfo } from "../Types/TotalInfo";

interface PlayerControlPanelProps {
    setTotalPlayerInfo: React.Dispatch<React.SetStateAction<ITotalInfo>>;
    setDidPlayerStand: React.Dispatch<React.SetStateAction<boolean>>;
    didPlayerStand: boolean;
    didPlayerWin: null | boolean;
    deckId: null | string;
  }


  function PlayerControlPanel({
    setTotalPlayerInfo,
    setDidPlayerStand,
    didPlayerStand,
    didPlayerWin,
    deckId,
  }: PlayerControlPanelProps) {
  
    const isDisabled = didPlayerStand || didPlayerWin !== null;
    
    const drawCard = () => {
      if (deckId) {
        // else it is players turn to pick a card
        (async () => {
          const {
            data: { cards },
          } = await drawCards(deckId);
          // add card to playersCards
          setTotalPlayerInfo((prevState) => ({
            ...prevState,
            player: {
              ...prevState.player,
              cards: [...prevState.player.cards, ...cards],
            },
          }));
          // the player is done drawing a card
        })();
      }
    };
  
    return (
      <section className="btn-container">
        <button
          type="button"
          onClick={() => drawCard()}
          disabled={isDisabled}
        >
          Hit
        </button>
        <button type="button" onClick={() => setDidPlayerStand(true)} disabled={isDisabled}>
          Stand
        </button>
        {/* This is reset button can be done by resetting state but I'm out of time */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Reset
        </button>
      </section>
    );
  }

  export default PlayerControlPanel;