import { Inter, League_Spartan } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const leagueSpartan = League_Spartan({ subsets: ["latin"], variable: "--font-league-spartan" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", inter.variable, leagueSpartan.variable)} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}