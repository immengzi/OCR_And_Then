import React from "react";
import type {Metadata} from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {ThemeProvider} from "@/context/ThemeContext";
import {cookies} from "next/headers";
import {Alert} from "@/components/ui/Alert";
import {init} from './init';

// 在根布局组件中初始化
init().catch(console.error);
export const metadata: Metadata = {
    title: "TestpaperAuto",
    description: "Using Baidu Cloud OCR for text recognition and GPT for location correction, extract the text from the exam PDF and then further generate reference answers using GPT.",
    icons: [
        {
            rel: 'icon',
            url: '/icon/square-pen.ico',
            media: '(prefers-color-scheme: dark)',
        },
        {
            rel: 'icon',
            url: '/icon/square-pen-light.ico',
            media: '(prefers-color-scheme: light)',
        }
    ],
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const cookieStore = cookies();
    const theme = cookieStore.get('theme')?.value ?? 'dark';

    return (
        <html lang="zh" data-theme={theme}>
        <body className="flex flex-col">
        <ThemeProvider theme={theme}>
            <header>
                <Navbar/>
            </header>
            <main className="flex flex-col justify-center items-center grow">
                <Alert/>
                {children}
            </main>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}