import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { patient_id } = await req.json();
    if (!patient_id) throw new Error("patient_id is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch patient data
    const [medsRes, logsRes, symptomsRes] = await Promise.all([
      supabase.from("medications").select("*").eq("user_id", patient_id).eq("active", true),
      supabase.from("medication_logs").select("*").eq("user_id", patient_id).order("logged_at", { ascending: false }).limit(30),
      supabase.from("symptom_logs").select("*").eq("user_id", patient_id).order("logged_at", { ascending: false }).limit(20),
    ]);

    const medications = medsRes.data ?? [];
    const logs = logsRes.data ?? [];
    const symptoms = symptomsRes.data ?? [];

    // Calculate adherence
    const totalLogs = logs.length;
    const takenLogs = logs.filter((l: any) => l.taken).length;
    const adherenceRate = totalLogs > 0 ? takenLogs / totalLogs : 1;

    // Build AI prompt
    const prompt = `Analyze this patient's health data and provide recommendations.

MEDICATIONS: ${JSON.stringify(medications.map(m => ({ drug: m.drug_name, dosage: m.dosage, schedule: m.schedule })))}

RECENT MEDICATION LOGS (last 30): ${totalLogs} total, ${takenLogs} taken, ${totalLogs - takenLogs} missed. Adherence rate: ${(adherenceRate * 100).toFixed(0)}%

RECENT SYMPTOMS: ${JSON.stringify(symptoms.map(s => ({ text: s.symptom_text, severity: s.severity, date: s.logged_at })))}

Based on this data, call the tool to provide recommendations.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a clinical AI analyzing patient medication adherence and symptom patterns. Use the tool to return structured recommendations." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_recommendations",
            description: "Create structured health recommendations for the patient",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      recommendation_type: { type: "string", enum: ["adherence", "side_effect", "risk"] },
                      risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                      confidence_score: { type: "number", minimum: 0, maximum: 1 },
                      explanation: { type: "string" },
                    },
                    required: ["recommendation_type", "risk_level", "confidence_score", "explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["recommendations"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_recommendations" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { recommendations } = JSON.parse(toolCall.function.arguments);

    // Store recommendations
    for (const rec of recommendations) {
      await supabase.from("ai_recommendations").insert({
        patient_id,
        recommendation_type: rec.recommendation_type,
        risk_level: rec.risk_level,
        confidence_score: rec.confidence_score,
        explanation: rec.explanation,
      });

      // Create alert if high/critical risk
      if (rec.risk_level === "high" || rec.risk_level === "critical") {
        await supabase.from("alerts").insert({
          patient_id,
          severity: rec.risk_level,
          message: `AI ${rec.recommendation_type} alert: ${rec.explanation}`,
          status: "active",
        });
      }
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "ai_analysis",
      entity_type: "ai_recommendations",
      entity_id: patient_id,
      details: { recommendation_count: recommendations.length },
    });

    return new Response(JSON.stringify({ success: true, recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
