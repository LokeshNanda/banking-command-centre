import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are an expert banking analyst assistant for an Enterprise Banking Command Centre. You help executives understand their dashboard data.

When answering:
- Be concise and action-oriented
- Use the provided dashboard data to support your answers
- Avoid jargon; explain banking terms when needed
- Suggest specific areas to investigate when relevant
- Reference actual numbers from the data when available`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages = [], apiKey, dashboardData } = body as {
      message: string;
      messages?: { role: "user" | "assistant"; content: string }[];
      apiKey: string;
      dashboardData: Record<string, unknown>;
    };

    if (!apiKey?.trim()) {
      return NextResponse.json(
        { error: "OpenAI API key is required. Add your key in Settings." },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: apiKey.trim() });

    const dataContext = JSON.stringify(dashboardData, null, 2);
    const systemContent = `${SYSTEM_PROMPT}

Current dashboard data (use this to answer questions):
${dataContext}`;

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemContent },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 1024,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content ?? "No response generated.";
    return NextResponse.json({ reply });
  } catch (err) {
    const error = err as Error & { status?: number };
    const message = error.message ?? "Failed to get AI response";
    const status = error.status === 401 ? 401 : 500;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
