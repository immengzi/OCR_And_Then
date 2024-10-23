import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import NavBar from "@/app/_components/NavBar";
import FootBar from "@/app/_components/FootBar";
import {ThemeProvider} from "@/context/ThemeContext";
import {cookies} from "next/headers";
import {Alert} from "@/app/_components/Alert";

export const metadata: Metadata = {
    title: "TestpaperAuto",
    description: "Using Baidu Cloud OCR for text recognition and GPT for location correction, extract the text from the exam PDF and then further generate reference answers using GPT.",
    icons: {
        icon: '/icon/file-signature.svg',
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const cookieStore = cookies();
    const theme = cookieStore.get('theme')?.value ?? 'dark';

    return (
        <html lang="zh" data-theme={theme}>
        <body className="flex flex-col">
        <ThemeProvider theme={theme}>
            <header>
                <NavBar/>
            </header>
            <main className="flex flex-col justify-center items-center grow">
                <Alert/>
                {children}
            </main>
            <FootBar/>
        </ThemeProvider>
        </body>
        </html>
    );
}