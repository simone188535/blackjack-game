// import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { fetchNewDeck, drawCards } from "../API/getRequests";

export interface ICard {
  code: string;
  image: string;
  // value: number;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

function GameArena() {
  const [playerTurn, setPlayerTurn] = useState(false);
  const [deckId, setDeckId] = useState<null | string>(null);
  const [playerDrawCard, setPlayerDrawCard] = useState(false);
  const [playersCards, setPlayersCards] = useState<ICard[]>([]);
  const [computersCards, setComputersCards] = useState<ICard[]>([]);

  const drawCard = useCallback(() => {
    if (!deckId) return;

    // if the current player neither play has cards, draw 2 cards, else draw 1
    if (computersCards.length === 0 && !playerTurn) {
      (async () => {
        // computer draws cards
        const {
          data: { cards },
        } = await drawCards(deckId, 2);

        setComputersCards(cards);

        // change turns
        setPlayerTurn(true);
        setPlayerDrawCard(true);
      })();
    }

    if (playersCards.length === 0 && playerTurn && playerDrawCard) {
      (async () => {
        const {
          data: { cards },
        } = await drawCards(deckId, 2);

        setPlayersCards(cards);
        // the player is done drawing a card
        setPlayerTurn(false);
      })();
    } else if(playerTurn && playerDrawCard) {
      // else it is players turn to pick a card
      (async () => {
        const {
          data: { cards },
        } = await drawCards(deckId);
        console.log(cards);
        // add card to playersCards
        setPlayersCards(prevState => [...prevState, ...cards]);
        // the player is done drawing a card
        setPlayerTurn(false);
      })();
    }
  }, [deckId, computersCards.length, playerTurn, playersCards.length, playerDrawCard]);


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

  useEffect(() => {
    console.log("playersCards", playersCards);
    console.log("computersCards", computersCards);
  }, [computersCards, playersCards]);

  return <div className="">Hello</div>;
}

export default GameArena;
