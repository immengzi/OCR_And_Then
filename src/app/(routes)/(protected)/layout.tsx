'use client';

import React from "react";
import {useAuth} from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {
    const {user} = useAuth();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                {user ? children : <h1>Not authorized</h1>}
            </QueryClientProvider>
        </>
    );
}