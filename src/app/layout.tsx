import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";
import FootBar from "@/components/footbar/footbar";

export const metadata: Metadata = {
    title: "TestpaperAuto",
    description: "Using Baidu Cloud OCR for text recognition and GPT for location correction, extract the text from the exam PDF and then further generate reference answers using GPT.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
        <body className={"bg-black text-sm text-white"}>
        <header>
            <NavBar/>
        </header>
        <main>
            <div className={"container px-32"}>
                {children}
            </div>
        </main>
        <footer>
            <FootBar/>
        </footer>
        </body>
        </html>
);
}