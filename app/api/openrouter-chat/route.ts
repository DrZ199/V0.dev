import { NextRequest, NextResponse } from "next/server";
import { OPENROUTER_MODELS, DEFAULT_MODEL } from "@/configs/OpenRouterModels";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt, modelId = DEFAULT_MODEL } = await req.json();
    
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
        "X-Title": "Bolt New Clone"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that provides concise and accurate responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: selectedModel.maxTokens,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ error: "Failed to get response from OpenRouter" }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "No response from AI";

    return NextResponse.json({
      result: aiResponse,
      model: modelId,
      usage: data.usage
    });
  } catch (error) {
    console.error("Error in OpenRouter chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    models: OPENROUTER_MODELS,
    defaultModel: DEFAULT_MODEL
  });
}