import { NextResponse } from "next/server";
import { generateMockData } from "@/lib/mockBankingData";
import { generateAIInsights } from "@/lib/aiSummary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = generateMockData();
  const insights = generateAIInsights(data);

  return NextResponse.json({
    ...data,
    aiInsights: insights,
  });
}
