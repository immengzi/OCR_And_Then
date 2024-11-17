'use client';

import {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";

let didInit = false;

export default function SessionValidator() {
    const {validateSession} = useAuth();

    useEffect(() => {
        if (!didInit) {
            didInit = true;
            validateSession();
        }
    }, []);

    return null;
}
