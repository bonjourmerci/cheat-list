import { Header } from "@/components/header";
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
				className={`${monoFont.variable} antialiased font-mono min-h-screen`}
			>
				<Header />
				{children}
			</body>
		</html>
	);
}
