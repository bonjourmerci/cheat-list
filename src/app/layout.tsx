
import { Title } from "@/components/title";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheat List",
  description: "Cheat List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${monoFont.variable} antialiased font-mono`}
      >
        <main className="min-h-screen flex flex-col">
          <div className="max-w-md mx-auto p-8 w-full flex flex-col gap-8">
            <Title />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
