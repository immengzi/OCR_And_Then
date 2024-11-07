'use client';

import React, {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

let didInit = false;
export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {
    const {validateSession} = useAuth();

    useEffect(() => {
        if (!didInit) {
            didInit = true;
            // 只在每次应用加载时执行一次
            validateSession();
        }
    }, [])

    return (
        <>
            {children}
            <LoadingOverlay/>
        </>
    )
}