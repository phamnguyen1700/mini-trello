export type CardStatus = "icebox" | "backlog" | "ongoing" | "review" | "done";

export interface Card {
  id: string;
  boardId: string;
  name: string;
  description?: string;
  status: CardStatus;
  position: number;
  tasks_count: number;
  list_member: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCardDto {
  name: string;
  description?: string;
}

export interface UpdateCardDto {
  name?: string;
  description?: string;
}

export interface MoveCardDto {
  status: CardStatus;
  position: number;
}
