import { Plus } from "lucide-react";

export const AddListButton = () => {
  return (
    <div className="board-add-list">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        <span>Add another list</span>
      </div>
    </div>
  );
};
