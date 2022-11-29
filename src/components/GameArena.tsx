import { useState, useEffect, useCallback, useRef } from "react";
import { ICard } from "../Types/Cards";
import { fetchNewDeck, drawCards } from "../API/getRequests";
import MapCards from "./MapCards";

interface ITotalInfo {
  total: number;
  acePositions: number[];
  lastReadCardIndex: number;
}

function GameArena() {
  const isMountedRef = useRef(false);

  const [playerTurn, setPlayerTurn] = useState(false);
  const [deckId, setDeckId] = useState<null | string>(null);

  const [playersCards, setPlayersCards] = useState<ICard[]>([]);
  const [totalPlayerInfo, setTotalPlayerInfo] = useState<ITotalInfo>({
    total: 0,
    acePositions: [],
    lastReadCardIndex: 0,
  });

  const [computersCards, setComputersCards] = useState<ICard[]>([]);
  const [totalComputerInfo, setTotalComputerInfo] = useState<ITotalInfo>({
    total: 0,
    acePositions: [],
    lastReadCardIndex: 0,
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
        setPlayersCards((prevState) => [...prevState, ...cards]);
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

      setComputersCards(computersCards);

      // player draws cards
      const {
        data: { cards: playerCards },
      } = await drawCards(deckId, 2);

      setPlayersCards(playerCards);

      // change turns
      setPlayerTurn(true);
    })();
  }, [deckId]);

  /* 
  In the future, this calculation can be memoized, instead of calculating the total from the
  beginning of the array, the position of the last element can be saved and the array can 
  iterate from that position rather than the beginning
  */
  const calcCardTotal = useCallback(
    (
      totalInfoObj: ITotalInfo,
      cardsArr: ICard[],
      setStateFunc: React.Dispatch<React.SetStateAction<ITotalInfo>>
    ) => {
      let newLastReadIndex = totalInfoObj.lastReadCardIndex;
      let newTotal = totalInfoObj.total;
      const acePositionArr: number[] = totalInfoObj.acePositions;

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

      setStateFunc({
        total: newTotal,
        acePositions: [...acePositionArr],
        lastReadCardIndex: newLastReadIndex,
      });
    },
    []
  );

  useEffect(() => {
    // if playersCards were added and the most recent card was not calculated recalculate the total
    if (
      playersCards.length > 0 &&
      totalPlayerInfo.lastReadCardIndex !== playersCards.length
    ) {
      calcCardTotal(totalPlayerInfo, playersCards, setTotalPlayerInfo);
    }

    // if computersCards were added and the most recent card was not calculated recalculate the total
    if (
      computersCards.length > 0 &&
      totalComputerInfo.lastReadCardIndex !== computersCards.length
    ) {
      calcCardTotal(totalComputerInfo, computersCards, setTotalComputerInfo);
    }
  }, [
    calcCardTotal,
    playersCards,
    totalPlayerInfo,
    computersCards,
    totalComputerInfo,
  ]);

  // check if a winner is present
  useEffect(() => {
    // if the player and the computer both get 21, the player loses
    if (totalPlayerInfo.total === 21 && totalComputerInfo.total === 21) {
      setDidPlayerWin(false);
    } else if (totalPlayerInfo.total === 21) {
      // if the player has a total of 21, the game is over and they win
      setDidPlayerWin(true);
    } else if (totalComputerInfo.total === 21) {
      // if the computer has a total of 21, the game is over and it wins
      setDidPlayerWin(false);
    } else if (totalPlayerInfo.total > 21) {
      // if the user has a score of over 21, check to see if they have aces
      if (totalPlayerInfo.acePositions.length > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalPlayerInfo((prevState) => ({
          ...prevState,
          total: prevState.total - 11 + 1,
          acePositions: prevState.acePositions.slice(0, -1),
        }));
      } else {
        // if not the user automatically loses
        setDidPlayerWin(false);
      }
    } else if (totalComputerInfo.total > 21) {
      // if the Computer has a score of over 21 (2 aces), check to see if they have aces
      if (totalComputerInfo.acePositions.length > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalComputerInfo((prevState) => ({
          ...prevState,
          total: prevState.total - 11 + 1,
          acePositions: prevState.acePositions.slice(0, -1),
        }));
      } else {
        // if not the computer automatically loses
        setDidPlayerWin(true);
      }
    } else if (didPlayerStand) {
      // if the player did stand and there is a tie OR the users cards total less than the computers cards, the computer wins
      if (
        totalPlayerInfo.total === totalComputerInfo.total ||
        totalPlayerInfo.total < totalComputerInfo.total
      ) {
        setDidPlayerWin(false);
      }

      // if the player has more points than the computer, the pplayer wins
      if (totalPlayerInfo.total > totalComputerInfo.total) {
        setDidPlayerWin(true);
      } else {
        // if the player and computer tie or the player has few points than the computer, the player loses
        setDidPlayerWin(false);
      }
    }
  }, [
    didPlayerStand,
    totalComputerInfo.acePositions.length,
    totalComputerInfo.total,
    totalPlayerInfo.acePositions.length,
    totalPlayerInfo.total,
  ]);

  const winLoseText = () => {
    if (didPlayerWin === null) return <></>;
    return <div>{didPlayerWin ? "You Won" : "You Lose"}</div>;
  };

  return (
    <>
      {winLoseText()}
      <div className="game-arena">
        <section className="game-panel panel-one">
          <h1>Computer</h1>
          <MapCards cards={computersCards} />
          <div>Total: {totalComputerInfo.total}</div>
        </section>
        <section className="game-panel panel-two">
          <h1>User</h1>
          <MapCards cards={playersCards} />
          <div>Total: {totalPlayerInfo.total}</div>
          {winLoseText()}
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
        </section>
      </div>
    </>
  );
}

// by default aces can be given a value of 10

export default GameArena;
