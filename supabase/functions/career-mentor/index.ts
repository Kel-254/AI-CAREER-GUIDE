// Import the OpenAI client for Deno
import OpenAI from "https://deno.land/x/openai@v4.7.1/mod.ts";

// Ensure Deno types are recognized
/// <reference lib="deno.unstable" />

// Initialize the OpenAI client using your secret key stored in Supabase
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// The function entry point
Deno.serve(async (req: Request) => {
  try {
    const { question, profile } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Missing question in request body." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build a custom prompt using user profile
    const prompt = `
    You are a friendly AI career mentor. 
    The user's profile: ${JSON.stringify(profile)}.
    Question: ${question}.
    Provide a clear and professional answer.
    `;

    // Ask OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = response.choices[0]?.message?.content || "No answer generated.";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in career-mentor function:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
