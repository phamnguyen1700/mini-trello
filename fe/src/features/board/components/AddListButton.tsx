import { Plus } from "lucide-react";

interface AddListButtonProps {
  onClick: () => void;
}

export const AddListButton = ({ onClick }: AddListButtonProps) => {
  return (
    <div className="board-add-list" onClick={onClick}>
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        <span>Add another list</span>
      </div>
    </div>
  );
};
