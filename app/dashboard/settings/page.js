"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import SettingsForm from "./SettingsForm";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (session) {
                const res = await fetch("/api/user/me");
                const data = await res.json();
                setUser(data.user);
                setLoading(false);
            }
        };
        fetchUser();
    }, [session]);

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ color: "var(--color-ink-muted)" }}
            >
                Loading...
            </div>
        );
    }

    return <SettingsForm initialUser={user} />;
}
