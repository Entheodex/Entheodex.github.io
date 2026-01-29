import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Dose {
  id: number;
  substance: string;
  doseTime: string;
  quantity: string;
  unit: string;
}

export interface CreateDoseRequest {
  substance: string;
  doseTime: string;
  quantity?: string;
  unit?: string;
}

export function useDoses() {
  return useQuery<Dose[]>({
    queryKey: ["/api/doses"],
    queryFn: async () => {
      const res = await fetch("/api/doses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch doses");
      return res.json();
    },
  });
}

export function useCreateDose() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDoseRequest) => {
      const res = await fetch("/api/doses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to log dose");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/doses"] }),
  });
}

export function useDeleteDose() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/doses/${id}`, { 
        method: "DELETE", 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete dose");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/doses"] }),
  });
}
