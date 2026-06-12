export const runtime = "nodejs";

import Link from "next/link.js";
import { auth } from "../../auth.js";
import { isAdminEmail } from "../../lib/utils.js";

export default async function AdminLayout({ children }) {
    const session = await auth();
    const isAdmin = isAdminEmail(session?.user?.email);

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1
                        className="text-3xl font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        403 - Forbidden
                    </h1>
                    <p style={{ color: "var(--color-ink-muted)" }}>
                        You don&apos;t have access to this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-14 px-4">
            <nav
                className="flex gap-4 mb-8 pb-4 border-b"
                style={{ borderColor: "var(--color-hairline)" }}
            >
                <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg hover:opacity-80"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        color: "var(--color-ink)",
                    }}
                >
                    Dashboard
                </Link>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 rounded-lg hover:opacity-80"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        color: "var(--color-ink)",
                    }}
                >
                    Users
                </Link>
                <Link
                    href="/admin/promo"
                    className="px-4 py-2 rounded-lg hover:opacity-80"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        color: "var(--color-ink)",
                    }}
                >
                    Promo Codes
                </Link>
            </nav>
            {children}
        </div>
    );
}
