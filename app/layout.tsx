import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { OpenAIKeyProvider } from "@/contexts/OpenAIKeyContext";

export const metadata: Metadata = {
  title: "Banking Command Centre | Enterprise Intelligence",
  description: "Executive-grade banking intelligence for risk, liquidity, and growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased text-slate-100 min-h-screen dark:text-slate-100 light:text-slate-900">
        <ThemeProvider>
          <ToastProvider>
            <OpenAIKeyProvider>
              {children}
            </OpenAIKeyProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
