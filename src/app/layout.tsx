import type { Metadata } from "next";
import "./globals.css";
import { Comfortaa } from "next/font/google";
import { RightSvg, LeftSvg } from "@/assets";
import { LoadingBar, Header } from "@/shared";

const fontComfortaa = Comfortaa({
  subsets: ["cyrillic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "🍹 Drink It Up",
  description: "Пейте со вкусом! 🍹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={fontComfortaa.className}>
      <body className="bg-background h-screen text-white">
        <LeftSvg className="absolute left-0 bottom-0 z-0 hidden md:block" fill="var(--banana)"/>
        <RightSvg className="absolute right-0 bottom-0 z-0 hidden md:block" fill="var(--banana)"/>

        <div className='h-full md:p-8 md:grid md:grid-cols-[max-content_1fr_max-content] md:grid-rows-[max-content_1fr] md:gap-8'>
          <Header className='col-start-2 rounded-none md:rounded-xl mb-8 md:mb-none' />
          {children}
        </div>
      </body>
    </html>
  );
}
