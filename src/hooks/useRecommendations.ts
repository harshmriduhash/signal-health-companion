import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useRecommendations(patientId?: string) {
  const { user } = useAuth();
  const id = patientId ?? user?.id;

  return useQuery({
    queryKey: ["recommendations", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_recommendations")
        .select("*")
        .eq("patient_id", id!)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
}
