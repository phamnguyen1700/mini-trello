import { use } from "react";
import { BoardDetailFeature } from "@/features/board/[id]";

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <BoardDetailFeature boardId={id} />;
}
