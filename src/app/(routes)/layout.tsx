'use client';

import React, {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";
import {Spinner} from "@/components/ui/Spinner";

let didInit = false;
export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {
    const {isLoading, validateSession} = useAuth();

    useEffect(() => {
        if (!didInit) {
            didInit = true;
            // 只在每次应用加载时执行一次
            validateSession();
        }
    }, [])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            {children}
        </>
    )
}