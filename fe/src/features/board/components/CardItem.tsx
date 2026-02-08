import { Card } from "../../../../../shared/types/card.types";

interface CardItemProps {
  card: Card;
}

export const CardItem = ({ card }: CardItemProps) => {
  return <div className="board-card-item">{card.name}</div>;
};
