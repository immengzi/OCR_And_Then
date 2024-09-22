import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";

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
                    <Navbar/>
                </header>
                <main>
                    <div className={"container px-32"}>
                        {children}
                    </div>
                </main>
                <footer>

                </footer>
            </body>
        </html>
    );
}