// import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { fetchNewDeck, drawCards } from "../API/getRequests";
import MapCards from "./MapCards";

export interface ICard {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

interface ITotalInfo {
  total: number;
  acePositions: Number[];
}

function GameArena() {
  const [playerTurn, setPlayerTurn] = useState(false);
  const [deckId, setDeckId] = useState<null | string>(null);

  const [playersCards, setPlayersCards] = useState<ICard[]>([]);
  const [totalPlayerInfo, setTotalPlayerInfo] = useState<ITotalInfo>({
    total: 0,
    acePositions: [],
  });

  const [computersCards, setComputersCards] = useState<ICard[]>([]);
  const [totalComputerInfo, setTotalComputerInfo] = useState<ITotalInfo>({
    total: 0,
    acePositions: [],
  });

  const [didPlayerWin, setDidPlayerWin] = useState<null | boolean>(null);
  const [didPlayerStand, setDidPlayerStand] = useState<boolean>(false);

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
        // setPlayerTurn(false);
      })();
    }
  }, [deckId, playerTurn]);

  useEffect(() => {
    (async () => {
      // create a deck
      const {
        data: { deck_id },
      } = await fetchNewDeck();

      // save the deck_id to state
      setDeckId(deck_id);
    })();
  }, []);

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
  const calcCardTotal = useCallback((cardsArr: ICard[], setStateFunc: React.Dispatch<React.SetStateAction<ITotalInfo>>) => {
    let total = 0;
    const acePositionArr: number[] = [];

      cardsArr.forEach(({ value }, index) => {
        // if the value is a number, simply add it to currTotal
         if (value === "QUEEN" || value ==="KING" || value === "JACK") {
          // if the value is a face card add 10
          total += 10;
        } else if (value === "ACE" ) {
          // if the value is an ace, by default is equal to 11
          total += 11;
          // acePosition.push(currIndex);
          acePositionArr.push(index);
        } else {
          const NumericVal = Number(value);
          total += NumericVal;
        }
      });

      setStateFunc((prevState) => ({
        ...prevState,
        total,
        acePositions: [...acePositionArr]
      }));
  }, []);

  useEffect(() => {
    // if playersCards were added recalculate the total
    if (playersCards.length > 0) {
      calcCardTotal(playersCards, setTotalPlayerInfo);
    }
  }, [calcCardTotal, playersCards]);

  useEffect(() => {
    // if computersCards were added recalculate the total
    if (computersCards.length > 0) {
      calcCardTotal(computersCards, setTotalComputerInfo);
    }
  }, [calcCardTotal, computersCards]);
  
  // check if a winner is present
  useEffect(() => {
    // if the player has a total of 21, the game is over and they win
    if (totalPlayerInfo.total === 21) {
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
            total: (prevState.total - 11) + 1,
            acePositions: prevState.acePositions.slice(0, -1),
          }))
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
            total: (prevState.total - 11) + 1,
            acePositions: prevState.acePositions.slice(0, -1),
          }))
      } else {
        // if not the computer automatically loses
        setDidPlayerWin(true);
      }
    } else if (didPlayerStand) {
      // if the player did stand and there is a tie OR the users cards total less than the computers cards, the computer wins
      if (totalPlayerInfo.total === totalComputerInfo.total || totalPlayerInfo.total < totalComputerInfo.total) {
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
  }, [didPlayerStand, totalComputerInfo.acePositions.length, totalComputerInfo.total, totalPlayerInfo.acePositions.length, totalPlayerInfo.total]);
  
  useEffect(() => {
    console.log(didPlayerWin);
  }, [didPlayerWin]);

  return (
    <div className="game-arena">
      <section className="game-panel panel-one">
        <h1>Computer</h1>
        <MapCards cards={computersCards} />
        <div>Total: {totalComputerInfo.total}</div>
      </section>
      <section className="game-panel panel-two">
        <div>User</div>
        <MapCards cards={playersCards} />
        <section className="btn-container">
          <button type="button" onClick={() => drawCard()} disabled={didPlayerStand || didPlayerWin !== null}>
            Hit
          </button>
          <button type="button" onClick={() => setDidPlayerStand(true)}>Stand</button>
          {/* This is reset button can be done by resetting state but I'm out of time */}
          <button type="button" onClick={() => {window.location.href="/"}}>Reset</button>
        </section>
        <div>Total: {totalPlayerInfo.total}</div>
      </section>
    </div>
  );
}

// by default aces can be given a value of 10

export default GameArena;
