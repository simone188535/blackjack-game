import axios from "axios";
import { ICard } from "../components/GameArena";

const fetchNewDeck = () =>
  axios<{ deck_id: string }>(`https://deckofcardsapi.com/api/deck/new/shuffle/`);

const drawCards = (deckId: string, numberOfCards: number = 1) =>
  axios<{cards: ICard[]}>(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numberOfCards}`
  );

export { fetchNewDeck, drawCards };
