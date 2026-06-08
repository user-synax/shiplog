"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function SignUpClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setIsLoading(false);
                return;
            }

            // After successful sign-up, sign in the user
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(
                    "Account created but failed to sign in. Please sign in manually.",
                );
                setIsLoading(false);
                return;
            }

            window.location.href = "/onboarding";
        } catch (err) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <div
            className={`${inter.className} min-h-screen flex items-center justify-center px-4 py-12`}
            style={{ backgroundColor: "var(--color-canvas)" }}
        >
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className={`${plusJakarta.className} text-3xl font-bold tracking-tight`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Shiplog
                    </Link>
                </div>

                <div
                    className="rounded-[20px] p-8"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <h1
                        className={`${plusJakarta.className} text-2xl font-bold mb-2`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Create an account
                    </h1>
                    <p
                        style={{ color: "var(--color-ink-muted)" }}
                        className="mb-8"
                    >
                        Start building your developer identity today.
                    </p>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#0099ff]/50"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    border: "1px solid var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#0099ff]/50"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    border: "1px solid var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#0099ff]/50"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    border: "1px solid var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-canvas)",
                            }}
                        >
                            {isLoading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div
                            className="flex-1 h-px"
                            style={{ backgroundColor: "var(--color-hairline)" }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            or continue with
                        </span>
                        <div
                            className="flex-1 h-px"
                            style={{ backgroundColor: "var(--color-hairline)" }}
                        />
                    </div>

                    <button
                        onClick={() =>
                            signIn("google", { callbackUrl: "/dashboard" })
                        }
                        className="w-full py-3 px-4 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                        style={{
                            backgroundColor: "var(--color-surface-2)",
                            color: "var(--color-ink)",
                            border: "1px solid var(--color-hairline)",
                        }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <p
                        className="text-center mt-6 text-sm"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            style={{ color: "var(--color-accent-blue)" }}
                            className="hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
