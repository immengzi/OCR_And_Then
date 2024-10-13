import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import NavBar from "@/app/_components/NavBar";
import FootBar from "@/app/_components/FootBar";
import {ThemeProvider} from "@/context/ThemeContext";
import {CurrentUserProvider} from "@/context/UserContext";

export const metadata: Metadata = {
    title: "TestpaperAuto",
    description: "Using Baidu Cloud OCR for text recognition and GPT for location correction, extract the text from the exam PDF and then further generate reference answers using GPT.",
    icons: {
/*        icon: [
            {
                url: '/icon/file-signature.svg',
                media: '(prefers-color-scheme: light)',
            },
            {
                // url: '/icon/file-signature-solid.svg',
                url: '/icon/file-signature.svg',
                media: '(prefers-color-scheme: dark)',
            },
        ],*/
        icon: '/icon/file-signature.svg',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider>
            <html lang="zh">
            <CurrentUserProvider>
                <body>
                <header>
                    <NavBar/>
                </header>
                <main className={"min-h-screen"}>
                    {children}
                </main>
                <FootBar/>
                </body>
            </CurrentUserProvider>
            </html>
        </ThemeProvider>
    );
}