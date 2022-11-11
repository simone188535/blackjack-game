import axios from "axios";

const fetchNewDeck = () => axios<{deck_id: string;}>(`https://deckofcardsapi.com/api/deck/new/`);

const drawCards = (deckId: string, numberOfCards: number = 1) => axios(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numberOfCards}`);

export {fetchNewDeck, drawCards}