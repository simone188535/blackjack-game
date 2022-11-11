// import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { fetchNewDeck, drawCards } from "../API/getRequests";

interface ICard {
  code: string;
  image: string;
  value: number;
  suit: string;
}

interface ICardsInfo {
  playerCards: {
    cards: ICard[];
    total: number;
  };
  computerCards: {
    cards: ICard[];
    total: number;
  };
}

function GameArena() {
  const [playerTurn, setPlayerTurn] = useState(false);
  const [deckId, setDeckId] = useState<null | string>(null);
  const [cardsInfo, setCardsInfo] = useState<ICardsInfo>({
    playerCards: {
      cards: [],
      total: 0,
    },
    computerCards: {
      cards: [],
      total: 0,
    },
  });

  const drawCard = useCallback(() => {
    if (!deckId) return;
    // if the current player neither play has cards, draw 2 cards, else draw 1
    const drawAppropriateNumOfCards = (currPlayerCardArr: ICard[]) =>
      currPlayerCardArr.length === 0
        ? drawCards(deckId, 2)
        : drawCards(deckId, 1);

    if (!playerTurn) {
      // computer draws cards
      drawAppropriateNumOfCards(cardsInfo.computerCards.cards);
      setPlayerTurn(true);
    } else {
      // player draws cards
      drawAppropriateNumOfCards(cardsInfo.playerCards.cards);
    }
  }, [
    cardsInfo.computerCards.cards,
    cardsInfo.playerCards.cards,
    deckId,
    playerTurn,
  ]);

  useEffect(() => {
    (async () => {
      // create a deck
      const {
        data: { deck_id },
      } = await fetchNewDeck();

      // save the deck_id to state
      setDeckId(deck_id);

      // draw cards
      drawCard();
    })();
  }, [drawCard]);

  return <div className="">Hello</div>;
}

export default GameArena;
