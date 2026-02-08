"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { BoardFeature } from "@/features/board";

interface BoardDetailFeatureProps {
  boardId: string;
}

export const BoardDetailFeature = ({ boardId }: BoardDetailFeatureProps) => {
  return (
    <MainLayout>
      <BoardFeature boardId={boardId} />
    </MainLayout>
  );
};
