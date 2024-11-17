'use client';

import React from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {

    return (
        <>
            {children}
            <LoadingOverlay/>
        </>
    )
}