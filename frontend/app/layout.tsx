import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarPrice AI — A clearer view of car value",
  description:
    "Explore machine learning estimates for used cars in Morocco. An open-source XGBoost, FastAPI and Next.js project.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
