'use client';

import {useUserService} from "@/app/_services";
import {Spinner} from "@/app/_components/Spinner";

export default function Profile() {
    const userService = useUserService();
    const user = userService.currentUser;

    if (user) {
        return (
            <>
                <h1>Hi {user.username}!</h1>
                <p>You&apos;re logged in with Next.js & JWT!!</p>
            </>
        );
    } else {
        return <Spinner/>;
    }
}