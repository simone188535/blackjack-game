import { useState, useEffect, useCallback, useRef } from "react";
import { ICard } from "../Types/Cards";
import { ITotalInfo, ITotalInfoKey } from "../Types/TotalInfo";
import { fetchNewDeck, drawCards } from "../API/getRequests";
import GameResults from "./GameResults";
import PlayerPanel from "./PlayerPanel";

function GameArena() {
  const isMountedRef = useRef(false);

  const [playerTurn, setPlayerTurn] = useState(false);
  const [deckId, setDeckId] = useState<null | string>(null);

  // const [playersCards, setPlayersCards] = useState<ICard[]>([]);
  // const [totalPlayerInfo, setTotalPlayerInfo] = useState<ITotalInfo>({
  //   total: 0,
  //   acePositions: [],
  //   lastReadCardIndex: 0,
  // });

  // const [computersCards, setComputersCards] = useState<ICard[]>([]);
  // const [totalComputerInfo, setTotalComputerInfo] = useState<ITotalInfo>({
  //   total: 0,
  //   acePositions: [],
  //   lastReadCardIndex: 0,
  // });

  const [totalPlayerInfo, setTotalPlayerInfo] = useState<ITotalInfo>({
    player: { total: 0, acePositions: [], lastReadCardIndex: 0, cards: [] },
    computer: { total: 0, acePositions: [], lastReadCardIndex: 0, cards: [] },
  });

  const [didPlayerWin, setDidPlayerWin] = useState<null | boolean>(null);
  const [didPlayerStand, setDidPlayerStand] = useState<boolean>(false);

  // on init create deck and set deck id
  useEffect(() => {
    if (isMountedRef.current) return;

    /* 
      this has been added to prevent this hook from fetching a DeckId twice
       because of React.StrictMode
      */
    isMountedRef.current = true;

    (async () => {
      // create a deck
      const {
        data: { deck_id },
      } = await fetchNewDeck();

      // save the deck_id to state
      setDeckId(deck_id);
    })();
  }, []);

  const drawCard = useCallback(() => {
    if (deckId && playerTurn) {
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
            cards: [...prevState.player.cards, ...cards]
          },
        }));
        // the player is done drawing a card
      })();
    }
  }, [deckId, playerTurn]);

  // once a deck id is present, draw 2 cards for both the computer and player
  useEffect(() => {
    if (!deckId) return;

    // initial cards for computer and player
    (async () => {
      // computer draws cards
      const {
        data: { cards: computersCards },
      } = await drawCards(deckId, 2);

      // player draws cards
      const {
        data: { cards: playerCards },
      } = await drawCards(deckId, 2);

      // add first 2 cards for player and computer
      setTotalPlayerInfo((prevState) => ({
        ...prevState,
        computer: {
          ...prevState.computer,
          cards: computersCards
        },
        player: {
          ...prevState.player,
          cards: playerCards
        },
      }));

      // change turns
      setPlayerTurn(true);
    })();
  }, [deckId]);

  useEffect(() => {
    /* 
  This calculation is memoized, instead of calculating the total from the
  beginning of the array, the position of the last element can be saved and the array can 
  iterate from that position rather than the beginning
  */
    const calcCardTotal = (objKey: ITotalInfoKey, cardsArr: ICard[]) => {
      let newLastReadIndex = totalPlayerInfo[objKey].lastReadCardIndex;
      let newTotal = totalPlayerInfo[objKey].total;
      const acePositionArr: number[] = totalPlayerInfo[objKey].acePositions;

      cardsArr.slice(newLastReadIndex).forEach(({ value }) => {
        // if the value is a number, simply add it to currTotal
        if (value === "QUEEN" || value === "KING" || value === "JACK") {
          // if the value is a face card add 10
          newTotal += 10;
        } else if (value === "ACE") {
          // if the value is an ace, by default is equal to 11
          newTotal += 11;
          acePositionArr.push(newLastReadIndex);
        } else {
          const NumericVal = Number(value);
          newTotal += NumericVal;
        }
        newLastReadIndex += 1;
      });

      setTotalPlayerInfo((prevState) => ({
        ...prevState,
        [objKey]: {
          ...prevState[objKey],
          total: newTotal,
          acePositions: [...acePositionArr],
          lastReadCardIndex: newLastReadIndex,
        },
      }));
    };

    // if playersCards were added and the most recent card was not calculated recalculate the total
    const playerCards = totalPlayerInfo.player.cards;
    const computerCards = totalPlayerInfo.computer.cards;

    if (
      playerCards.length > 0 &&
      totalPlayerInfo.player.lastReadCardIndex !== playerCards.length
    ) {
      calcCardTotal("player", playerCards);
    }

    // if computersCards were added and the most recent card was not calculated recalculate the total
    if (
      computerCards.length > 0 &&
      totalPlayerInfo.computer.lastReadCardIndex !== computerCards.length
    ) {
      calcCardTotal("computer", computerCards);
    }
  }, [totalPlayerInfo]);

  return (
    <div className="game-arena">
      <PlayerPanel
        header="Computer"
        cards={totalPlayerInfo.computer.cards}
        playerTotal={totalPlayerInfo.computer.total}
      />
      <PlayerPanel
        header="User"
        cards={totalPlayerInfo.player.cards}
        playerTotal={totalPlayerInfo.player.total}
        render={() => (
          <>
            <GameResults
              totalPlayerInfo={totalPlayerInfo}
              // totalComputerInfo={totalComputerInfo}
              didPlayerStand={didPlayerStand}
              didPlayerWin={didPlayerWin}
              setDidPlayerWin={setDidPlayerWin}
              setTotalPlayerInfo={setTotalPlayerInfo}
              // setTotalComputerInfo={setTotalComputerInfo}
            />
            <section className="btn-container">
              <button
                type="button"
                onClick={() => drawCard()}
                disabled={didPlayerStand || didPlayerWin !== null}
              >
                Hit
              </button>
              <button type="button" onClick={() => setDidPlayerStand(true)}>
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
          </>
        )}
      />
    </div>
  );
}

// by default aces can be given a value of 10

export default GameArena;
