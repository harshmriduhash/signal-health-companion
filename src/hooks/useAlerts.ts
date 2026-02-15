import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AlertStatus = Database["public"]["Enums"]["alert_status"];

export function useAlerts(filters?: { status?: AlertStatus }) {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: async () => {
      let q = supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (filters?.status) q = q.eq("status", filters.status);
      const { data, error } = await q.limit(50);
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AlertStatus }) => {
      const update: any = { status };
      if (status === "resolved") update.resolved_at = new Date().toISOString();
      const { error } = await supabase.from("alerts").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
