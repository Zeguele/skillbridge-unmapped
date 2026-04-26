// Generates a portable skills profile via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROFILE_TOOL = {
  type: "function",
  function: {
    name: "build_profile",
    description: "Return a portable skills profile and labor-market analysis.",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "2-sentence plain-language summary." },
        isco: {
          type: "object",
          properties: { code: { type: "string" }, title: { type: "string" } },
          required: ["code", "title"], additionalProperties: false,
        },
        esco: {
          type: "object",
          properties: { label: { type: "string" } },
          required: ["label"], additionalProperties: false,
        },
        onet: {
          type: "object",
          properties: { code: { type: "string" }, title: { type: "string" } },
          required: ["code", "title"], additionalProperties: false,
        },
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string", enum: ["durable", "developing", "informal"] },
              description: { type: "string" },
              resilience: { type: "number" },
            },
            required: ["name", "type", "description", "resilience"],
            additionalProperties: false,
          },
        },
        portability: { type: "string", enum: ["High", "Medium", "Low"] },
        portabilityReason: { type: "string" },
        marketContext: { type: "string" },
        opportunities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              type: { type: "string", enum: ["formal", "self-employment", "gig/freelance", "training pathway"] },
              wageRange: { type: "string", description: "e.g. '$5-12/day' or '$200-400/month'" },
              sectorGrowth: { type: "string", enum: ["High", "Medium", "Low"] },
              barrier: { type: "string", enum: ["Low", "Medium", "High"] },
              description: { type: "string" },
              matchScore: { type: "number" },
            },
            required: ["title", "type", "wageRange", "sectorGrowth", "barrier", "description", "matchScore"],
            additionalProperties: false,
          },
        },
        signal1: { type: "string", description: "Wage floor + informal % interpretation. ILO ILOSTAT." },
        signal2: { type: "string", description: "Returns to education + skills. World Bank STEP / ILO task indices." },
        wittgensteinSignal: { type: "string", description: "Wittgenstein Centre 2025-2035 education projection insight for region." },
        policySkillsGap: { type: "string" },
        policyInterventions: { type: "string" },
        policyDataLimits: { type: "string" },
        recommendedTraining: {
          type: "array",
          description: "3-4 short, realistic training opportunities tailored to the user.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              why: { type: "string", description: "One sentence in second person ('you')." },
              duration: { type: "string" },
              format: { type: "string" },
              impact: { type: "string" },
            },
            required: ["title", "why", "duration", "format", "impact"],
            additionalProperties: false,
          },
        },
      },
      required: [
        "summary","isco","esco","onet","skills","portability","portabilityReason",
        "marketContext","opportunities","signal1","signal2","wittgensteinSignal",
        "policySkillsGap","policyInterventions","policyDataLimits","recommendedTraining",
      ],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { intake, countryStats, languagePromptName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Resolve target language: explicit override from client > intake.languagePref > English.
    const targetLanguage: string =
      (typeof languagePromptName === "string" && languagePromptName.trim()) ||
      (typeof intake?.languagePref === "string" && intake.languagePref.trim()) ||
      "English";

    const system = `You are a labor-market analyst building a portable skills profile for a young person.
Use plain, non-expert language. Be honest and grounded — opportunities must be realistic for the country, not aspirational.
Map skills to ILO ISCO-08, ESCO, and O*NET. Provide concrete wage ranges in USD using local context.

LANGUAGE — MANDATORY:
Write ALL output text in ${targetLanguage}. Every human-readable string in the tool call (summary, every skills[].description, skills[].name, every opportunities[].description, opportunities[].title, portabilityReason, marketContext, signal1, signal2, wittgensteinSignal, policySkillsGap, policyInterventions, policyDataLimits, recommendedTraining[].title, recommendedTraining[].why, recommendedTraining[].duration, recommendedTraining[].format, recommendedTraining[].impact) MUST be written in ${targetLanguage}.
Exception: taxonomy codes and titles (isco.code, isco.title, esco.label, onet.code, onet.title) MUST stay in English — they are international identifiers.
If ${targetLanguage} is Arabic, write in Modern Standard Arabic. If Hindi, write in Devanagari script.

CRITICAL VOICE RULES — ABSOLUTE, NO EXCEPTIONS:
The following YOUTH-FACING fields MUST be written in SECOND PERSON addressed directly to the user as "you" / "your" (translated naturally into ${targetLanguage}, e.g. "tu/vous" in French, "tú/usted" in Spanish, "você" in Portuguese, "أنت" in Arabic, "आप" in Hindi):
  - summary
  - every skills[].description
  - every opportunities[].description
  - portabilityReason

In those fields you MUST NOT:
  - use the person's name (it never appears in these strings)
  - use third-person pronouns (he, she, they, etc., or their equivalents in ${targetLanguage})
  - refer to them as "the user", "this person", "the candidate", "the youth", or any third-person noun
  - cite data sources, taxonomy codes, or use technical jargon

GRAMMAR — SUBJECT-VERB AGREEMENT (MANDATORY):
All youth-facing text must use grammatically correct second person in ${targetLanguage}. Verbs must agree with the second-person subject. Double-check every sentence in summary, skills[].description, opportunities[].description, and portabilityReason for subject-verb agreement before returning. Never mix third-person verb forms with the second-person subject.

Policymaker-only fields (signal1, signal2, wittgensteinSignal, policySkillsGap, policyInterventions, policyDataLimits) MUST stay in third-person analytical language with data citations. Do NOT use second person in those fields.

For recommendedTraining, suggest 3-4 specific, realistic training opportunities that would build on what the user already knows. Do not suggest university degrees or long programs — focus on short, accessible training that exists in their country and context. Each recommendation should feel like a natural next step, not a stretch. Write all text in second person, in ${targetLanguage}.

Numeric rules:
  - Return opportunity matchScore as whole integers from 0 to 100 (e.g. 75, NOT 0.75).
  - Skill resilience must also be a whole integer from 0 to 100.

Return ONLY a tool call to build_profile. No markdown, no prose.`;

    const user = `Person (the name below is INTERNAL CONTEXT ONLY — never write it in any youth-facing field):
Name: ${intake.name || "(anonymous)"}
Country: ${intake.country}
Language preference: ${targetLanguage}
Education: ${intake.education}${intake.fieldOfStudy ? ` (field: ${intake.fieldOfStudy})` : ""}
Experience: ${intake.experience || "(none provided)"}
Self-taught skills: ${intake.selfTaughtSkills.join(", ") || "(none)"}
Languages: ${intake.languages.join(", ") || "(none)"}
Digital tools: ${(intake.digitalSkills && intake.digitalSkills.length > 0) ? intake.digitalSkills.join(", ") : "(none reported)"}
Certifications/training: ${intake.hasCertifications && intake.certificationsDescription ? intake.certificationsDescription : "None reported"}
Other: ${intake.other || "(none)"}

Country labor market (use these exact figures in your reasoning):
- Youth unemployment: ${countryStats.youthUnemployment}%
- Informal economy: ${countryStats.informalEconomy}%
- GDP growth: ${countryStats.gdpGrowth}%
- Wage floor: $${countryStats.wageFloor}/hr
- High-growth sectors: ${countryStats.sectors.join(", ")}

Generate 3-4 realistic opportunities grounded in these sectors. For each skill assign a resilience score (0-100) reflecting automation/displacement resistance.

Reminder: write every output string in ${targetLanguage} (except taxonomy codes/titles, which stay in English). Every youth-facing string ("summary", every "skills[].description", every "opportunities[].description", "portabilityReason") must address the reader directly in second person — never use the name above, never use third-person pronouns.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [PROFILE_TOOL],
        tool_choice: { type: "function", function: { name: "build_profile" } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");
    const profile = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
