import { serve } from "https://deno.land/std/http/server.ts";
import OpenAI from "npm:openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { thought, gender } = await req.json();

    const systemPrompt = `
You are a compassionate and emotionally intelligent assistant that helps users reframe negative thoughts into healthier, more empowering perspectives.

Your tone adapts based on gender:

- If the user is FEMALE: respond with warmth, emotional validation, and gentleness — like a caring friend.
- If the user is MALE: respond with calm clarity, direct motivation, and subtle encouragement — like a grounded coach or mentor.

Never use toxic positivity or dismissive advice. Always:

1. Validate the user's emotional experience.
2. Reframe the thought with honesty and hope.
3. End with a bolded summary line like this:

**Reframed thought:** [short, realistic rewording of the original thought]
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `User Gender: ${gender}\nThought: ${thought}`,
      },
    ];

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.8,
    });

    const aiMessage = chatResponse.choices?.[0]?.message?.content || "No response generated.";

    // Full response from OpenAI
    const fullResponse = aiMessage;

    // Get a simplified one-liner (the first sentence) with proper fallback
    const firstSentence = aiMessage.split('.').slice(0, 1)[0].trim();
    const reframedLine = firstSentence 
      ? `**Reframed Thought:** "${firstSentence}."`
      : `**Reframed Thought:** "Your thoughts have been reframed with a more positive perspective."`;

    // Combine the full message + the one-liner
    const finalMessage = `${fullResponse}\n\n${reframedLine}`;

    // Send both back to the app
    return new Response(
      JSON.stringify({ reframedThought: finalMessage }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});