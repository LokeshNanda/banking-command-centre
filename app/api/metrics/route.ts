import { NextRequest, NextResponse } from "next/server";
import { generateMockData } from "@/lib/mockBankingData";
import { generateAIInsights, generateDashboardInsights } from "@/lib/aiSummary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DASHBOARD_SLUGS = [
  "credit-risk",
  "liquidity",
  "customer-profitability",
  "fraud",
  "growth",
  "collections",
  "treasury",
  "branch-network",
  "compliance",
  "operational-risk",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dashboard = searchParams.get("dashboard");
  const timeRange = searchParams.get("timeRange") ?? "today";

  const data = generateMockData();
  const insights = generateAIInsights(data);

  const response: Record<string, unknown> = {
    ...data,
    aiInsights: insights,
    timeRange,
  };

  if (dashboard && DASHBOARD_SLUGS.includes(dashboard)) {
    response.dashboardInsights = generateDashboardInsights(dashboard, data);
  }

  return NextResponse.json(response);
}
