import React from "react";
import type {Metadata} from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import SessionValidator from "@/components/layout/SessionValidator";
import Footer from "@/components/layout/Footer";
import {ThemeProvider} from "@/context/ThemeContext";
import {cookies} from "next/headers";
import {Alert} from "@/components/ui/Alert";
import {init} from './init';

export const metadata: Metadata = {
    title: "OCR And Then",
    description: "A Next.js web application for OCR and more operations.",
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
        <SessionValidator/>
        <ThemeProvider theme={theme}>
            <nav>
                <Navbar/>
            </nav>
            <main className="flex flex-col grow">
                <Alert/>
                {children}
            </main>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}