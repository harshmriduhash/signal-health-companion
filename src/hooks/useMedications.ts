import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMedications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["medications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user!.id)
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTodayLogs() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["medication_logs", user?.id, today],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("logged_at", `${today}T00:00:00`)
        .lte("logged_at", `${today}T23:59:59`);
      if (error) throw error;
      return data;
    },
  });
}

export function useLogMedication() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ medicationId, taken }: { medicationId: string; taken: boolean }) => {
      const { error } = await supabase.from("medication_logs").insert({
        medication_id: medicationId,
        user_id: user!.id,
        taken,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medication_logs"] });
    },
  });
}

export function useAddMedication() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (med: { drug_name: string; dosage: string; schedule: string }) => {
      const { error } = await supabase.from("medications").insert({
        ...med,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}
