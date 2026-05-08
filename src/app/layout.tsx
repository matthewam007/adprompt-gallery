import type { Metadata } from "next";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdPrompt Gallery",
  description: "A hand-picked library of prompts behind ads worth studying.",
  icons: {
    icon: "/icon.svg",
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
        <CustomCursor />
      </body>
    </html>
  );
}
