import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Montserrat } from "next/font/google";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SHESHA ADMIN",
  description: "Shesha admin portal",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.className}`} suppressHydrationWarning>
      <body className="bg-gradient-to-br from-asparagus to-olivine text-champagne">
        <ErrorBoundary>
          <main className="min-h-screen">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
