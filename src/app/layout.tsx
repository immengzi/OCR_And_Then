import React from "react";
import type {Metadata} from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {ThemeProvider} from "@/context/ThemeContext";
import {cookies} from "next/headers";
import {Alert} from "@/components/ui/Alert";
import {init} from './init';

export const metadata: Metadata = {
    title: "TestpaperAuto",
    description: "An exam paper automation tool that uses OCR to obtain the structured content of exam paper files and selects subsequent processing steps to generate results.",
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
    init().catch(console.error);

    return (
        <html lang="zh" data-theme={theme}>
        <body className="flex flex-col">
        <ThemeProvider theme={theme}>
            <nav>
                <Navbar/>
            </nav>
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