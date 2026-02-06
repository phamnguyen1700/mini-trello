export type CardStatus = 'icebox' | 'backlog' | 'ongoing' | 'review' | 'done';

export interface Card {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: CardStatus;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  status: CardStatus;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
}

export interface MoveCardDto {
  status: CardStatus;
  position: number;
}
