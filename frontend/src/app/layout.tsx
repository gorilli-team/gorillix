import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gorillix",
  description: "AI-Powered Trading agent",
  icons: {
    icon: "/avatar_3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
