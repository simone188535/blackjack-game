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
  lastReadCardIndex: number;
}

function GameArena() {
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

  // const calcCardTotal = (totalInfoObj: ITotalInfo, arr: ICard[]) => {
  //   // start array at lastReadCardIndex
  //   let currIndex = totalInfoObj.lastReadCardIndex;
  //   console.log(currIndex);
  //   const acePosition: Number[] = [];

  //   const arrFromStartingPoint = arr.slice(currIndex);
  //   let currTotal = totalInfoObj.total;

  //   arrFromStartingPoint.forEach(({ value }) => {
  //     // if the value is a number, simply add it to currTotal
  //      if (value === "QUEEN" || value ==="KING" || value === "JACK") {
  //       console.log('Face');
  //       // if the value is a face card add 10
  //       currTotal += 10;
  //     } else if (value === "ACE" ) {
  //       console.log('Ace');
  //       // if the value is an ace, by default is equal to 11
  //       currTotal += 11;
  //       acePosition.push(currIndex);
  //     } else {
  //       const NumericVal = Number(value);
  //       currTotal += NumericVal;
  //     }
  //     currIndex += 1;
  //   });

  //   return { currTotal, acePosition, currIndex };

  //   // // update state for the provided obj

  //   // setStateToChange((prevState) => ({
  //   //   ...prevState,
  //   //   total: currTotal,
  //   //   acePositions: [...prevState.acePositions, ...acePosition],
  //   //   lastReadCardIndex: currIndex,
  //   // }));
  // };

  const calcCardTotal = useCallback((cardsArr: ICard[], setStateFunc: React.Dispatch<React.SetStateAction<ITotalInfo>>) => {
    let total = 0;
      cardsArr.forEach(({ value }) => {
        // if the value is a number, simply add it to currTotal
         if (value === "QUEEN" || value ==="KING" || value === "JACK") {
          console.log('Face');
          // if the value is a face card add 10
          total += 10;
        } else if (value === "ACE" ) {
          console.log('Ace');
          // if the value is an ace, by default is equal to 11
          total += 11;
          // acePosition.push(currIndex);
        } else {
          const NumericVal = Number(value);
          total += NumericVal;
        }
      });

      setStateFunc((prevState) => ({
        ...prevState,
        total
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


  // useEffect(() => {
  //   // if cards were added recalculate the total

  //   // if the most current playersCards was not read, recalculate the total
  //   // if (playersCards.length !== totalPlayerInfo.lastReadCardIndex) {
  //     const {
  //       currTotal: currTotalPlayer,
  //       acePosition: acePositionPlayer,
  //       currIndex: currIndexPlayer,
  //     } = calcCardTotal(totalPlayerInfo, playersCards);

  //     // // update state for the provided obj

      // setTotalPlayerInfo((prevState) => ({
      //   ...prevState,
      //   total: currTotalPlayer,
      //   acePositions: [...prevState.acePositions, ...acePositionPlayer],
      //   lastReadCardIndex: currIndexPlayer,
      // }));
  //   // }

  //   // if the most current card was not read, recalculate the total
  //   // if (computersCards.length !== totalComputerInfo.lastReadCardIndex) {
  //   //   const {} = calcCardTotal(totalComputerInfo, computersCards);

  //     // // update state for the provided obj

  //     // setTotalComputerInfo((prevState) => ({
  //     //   ...prevState,
  //     //   total: currTotal,
  //     //   acePositions: [...prevState.acePositions, ...acePosition],
  //     //   lastReadCardIndex: currIndex,
  //     // }));
  //   // }
  // }, [playersCards, totalPlayerInfo]);

  useEffect(() => {
    console.log("playersCards", playersCards);
  }, [playersCards]);

    useEffect(() => {
    console.log("totalPlayerInfo", totalPlayerInfo);
  }, [totalPlayerInfo]);

  // useEffect(() => {
  //   console.log("playersCards", playersCards);
  //   console.log("computersCards", computersCards);
  // }, [computersCards, playersCards]);

  // useEffect(() => {
  //   console.log("totalPlayerInfo", totalPlayerInfo);
  //   console.log("totalComputerInfo", totalComputerInfo);
  // }, [totalComputerInfo, totalPlayerInfo]);

  // const calcTotals = (currentUser: ITotalInfo, cards: ICard[]) => {

  //   // calculate the current total using the last read card index

  // }

  // useEffect(() => {
  //   // if the computer or the user have a number larger than 21, check if they have aces, if so subtract the 10 from the value and add 1
  // }, []);

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
          <button type="button" onClick={() => drawCard()}>
            Hit
          </button>
          <button type="button">Stand</button>
        </section>
        <div>Total: {totalPlayerInfo.total}</div>
      </section>
    </div>
  );
}

// by default aces can be given a value of 10

export default GameArena;
