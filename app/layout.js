import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider.tsx"
const font = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "PREP-AI | Next-Gen Technical & Coding Interview Prep",
    template: "%s | PREP-AI",
  },
  description:
    "Master your technical, algorithmic, and system design interviews with PREP-AI. Instant code analysis, detailed feedback, and real-time AI scoring.",
  keywords: ["PREP-AI", "coding interview", "technical interview", "AI mock interview", "software engineer interview"],
};


export default function RootLayout({ children }) {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_c3RhYmxlLXR1bmEtODM4LmNsZXJrLmFjY291bnRzLmRldiQ";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${font.className} bg-slate-950 text-slate-100 min-h-screen antialiased`} suppressHydrationWarning>
        <ClerkProvider publishableKey={publishableKey}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

