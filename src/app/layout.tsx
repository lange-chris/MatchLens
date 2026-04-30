import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatchPoint - AI CV Matcher",
  description: "Compare your CV with job ads and get a matching score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
