import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import FootBar from "@/components/FootBar/FootBar";

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
        <body>
        <header>
            <NavBar/>
        </header>
        <main>
            {children}
        </main>
        <FootBar/>
        </body>
        </html>
);
}