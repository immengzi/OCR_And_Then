'use client';

import {useAuth} from "@/hooks/use-auth";

export default function Profile() {
    const {user} = useAuth();

    if (user) {
        return (
            <>
                <h1>Hi {user.username}!</h1>
                <p>You&apos;re logged in with Next.js & JWT!!</p>
            </>
        );
    } else {
        return (
            <>
                <h1>Hi there!</h1>
                <p>You&apos;re not logged in.</p>
            </>
        );
    }
}