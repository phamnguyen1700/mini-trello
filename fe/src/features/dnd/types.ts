import type { CardStatus } from "../../../../shared/types";

export type ColumnId = CardStatus;

export interface Column {
  id: ColumnId;
  title: string;
  cardIds: string[];
}

export interface DragPayload {
  cardId: string;
  fromColumnId?: ColumnId;
}


