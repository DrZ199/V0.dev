import { NextRequest, NextResponse } from "next/server";
import { OPENROUTER_MODELS } from "@/configs/OpenRouterModels";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt, modelId = "meta-llama/llama-2-70b-chat" } = await req.json();
    
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const selectedModel = OPENROUTER_MODELS.find(model => model.id === modelId);
    
    if (!selectedModel) {
      return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Bolt New Clone - Code Generation"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "system",
            content: "You are an expert React developer. Generate clean, modern, and functional React code with Tailwind CSS styling. Return your response in valid JSON format as specified in the user's prompt."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: selectedModel.maxTokens,
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ error: "Failed to get response from OpenRouter" }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "{}";

    try {
      const parsedResponse = JSON.parse(aiResponse);
      return NextResponse.json({
        ...parsedResponse,
        model: modelId,
        usage: data.usage
      });
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return NextResponse.json({ error: "Invalid JSON response from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in OpenRouter code generation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}