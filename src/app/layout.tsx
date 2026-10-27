import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import cx from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orphe Groove Project",
  description: "This is a prototype for Orphe or Groove.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cx("min-h-screen", inter.className)}>
        <header className="h-10 flex items-center justify-center bg-gray-800 fixed top-0 w-full">
          <h1 className="font-bold text-lg text-white">
            <Link href="/">Orphe proto</Link>
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
