import { ICard } from "./GameArena";

interface IMapCardsProps {
  cards: ICard[];
}

const MapCards = ({ cards }: IMapCardsProps) => {
  const mappedCards = cards.map(({ image, value, suit }, key) => (
    <li key={`mapped-card-${value}-${key}`}>
      <img src={image} alt={value} />
      <div>Suit: {suit}</div>
      <div>Value: {value}</div>
    </li>
  ));

  return <ul>{mappedCards}</ul>;
};

export default MapCards;
