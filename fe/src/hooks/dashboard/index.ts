import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/services/dashboard";
import { toast } from "react-hot-toast";

export const useBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: boardService.getAll,
  });
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => boardService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardService.create,
    onSuccess: () => {
      toast.success("Board created!");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create board",
      );
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardService.delete,
    onSuccess: () => {
      toast.success("Board deleted!");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete board",
      );
    },
  });
};
