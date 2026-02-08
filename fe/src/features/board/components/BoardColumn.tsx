import { Plus, Clipboard, MoreHorizontal } from "lucide-react";
import { Card } from "../../../../../shared/types/card.types";
import { CardItem } from "./CardItem";

interface BoardColumnProps {
  title: string;
  cards: Card[];
  showMenu?: boolean;
}

export const BoardColumn = ({ title, cards, showMenu }: BoardColumnProps) => {
  return (
    <div className="board-column">
      <div className="board-column-header">
        <span>{title}</span>
        {showMenu && (
          <MoreHorizontal className="w-4 h-4 cursor-pointer text-slate-400" />
        )}
      </div>

      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}

      <div className="board-add-card">
        <Plus className="w-4 h-4" />
        <span>Add a card</span>
        <Clipboard className="w-3.5 h-3.5 ml-auto" />
      </div>
    </div>
  );
};
