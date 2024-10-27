'use client';

import React, {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";
import {Spinner} from "@/components/ui/Spinner";

export default function RoutesLayout({children}: {
    children: React.ReactNode
}) {
    const {isLoading, validateSession} = useAuth();

    useEffect(() => {
        validateSession()
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