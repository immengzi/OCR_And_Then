'use client';

import React from "react";
import {useAuth} from "@/hooks/use-auth";

export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {
    const {user} = useAuth();

    return (
        <>
            {user ? children : <h1>Not authorized</h1>}
        </>
    );
}