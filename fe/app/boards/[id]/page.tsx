"use client";

import { useParams } from "next/navigation";
import { BoardDetailFeature } from "@/features/board/[id]";

export default function BoardPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  return <BoardDetailFeature boardId={id} />;
}
