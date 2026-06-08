"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    Home,
    Briefcase,
    FileText,
    Layers,
    Trophy,
    BarChart3,
    CreditCard,
    Settings,
    Menu,
    X,
    Shield,
} from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { getDefaultAvatarUrl } from "@/lib/utils";

const navLinks = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
    { href: "/dashboard/logs", label: "Build Logs", icon: FileText },
    { href: "/dashboard/stack", label: "Stack & Goals", icon: Layers },
    {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: BarChart3,
        isPro: true,
    },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNavLink = { href: "/admin", label: "Admin", icon: Shield };

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            if (session) {
                const res = await fetch("/api/user/me");
                const data = await res.json();
                if (!data.user?.username) {
                    router.push("/onboarding");
                }
                setUser(data.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [session, router]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    backgroundColor: "var(--color-canvas)",
                    color: "var(--color-ink-muted)",
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: "var(--color-canvas)" }}
        >
            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full border-r z-40"
                style={{
                    backgroundColor: "var(--color-canvas)",
                    borderColor: "var(--color-hairline)",
                }}
            >
                <div className="p-6">
                    <h1
                        className="text-xl font-bold tracking-tight"
                        style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                            color: "var(--color-ink)",
                        }}
                    >
                        Shiplog
                    </h1>
                </div>

                <TooltipProvider>
                    <nav className="flex-1 px-4 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.href}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                                            style={{
                                                backgroundColor: isActive
                                                    ? "var(--color-accent-red)"
                                                    : "transparent",
                                                color: isActive
                                                    ? "var(--color-ink)"
                                                    : "var(--color-ink-muted)",
                                                border: isActive
                                                    ? "1px solid var(--color-hairline)"
                                                    : "1px solid transparent",
                                            }}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">
                                                {link.label}
                                            </span>
                                            {link.isPro && (
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full ml-auto"
                                                    style={{
                                                        backgroundColor:
                                                            "var(--color-surface-2)",
                                                        color: "var(--color-ink)",
                                                        border: "1px solid var(--color-hairline)",
                                                    }}
                                                >
                                                    Pro
                                                </span>
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        sideOffset={10}
                                    >
                                        {link.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                        {user?.isAdmin && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={adminNavLink.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                                        style={{
                                            backgroundColor:
                                                pathname.startsWith("/admin")
                                                    ? "var(--color-accent-red)"
                                                    : "transparent",
                                            color: pathname.startsWith("/admin")
                                                ? "var(--color-ink)"
                                                : "var(--color-ink-muted)",
                                            border: pathname.startsWith(
                                                "/admin",
                                            )
                                                ? "1px solid var(--color-hairline)"
                                                : "1px solid transparent",
                                        }}
                                    >
                                        <adminNavLink.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            {adminNavLink.label}
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={10}>
                                    {adminNavLink.label}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </nav>
                </TooltipProvider>

                <div
                    className="p-4 border-t"
                    style={{ borderColor: "var(--color-hairline)" }}
                >
                    {session?.user && (
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full overflow-hidden"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                    border: "1px solid var(--color-hairline)",
                                }}
                            >
                                <img
                                    src={
                                        user?.avatarUrl ||
                                        session.user.avatarUrl ||
                                        session.user.image ||
                                        getDefaultAvatarUrl(
                                            session.user.username,
                                        )
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-medium truncate"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {session.user.name}
                                </p>
                                <p
                                    className="text-xs truncate"
                                    style={{
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    @{session.user.username || "user"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Header */}
            <div
                className="md:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 border-b"
                style={{
                    backgroundColor: "var(--color-canvas)",
                    borderColor: "var(--color-hairline)",
                }}
            >
                <Link
                    href="/dashboard"
                    className="text-xl font-bold tracking-tight"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                    }}
                >
                    Shiplog
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ color: "var(--color-ink)" }}
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 border-r z-50 md:hidden transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{
                    backgroundColor: "var(--color-canvas)",
                    borderColor: "var(--color-hairline)",
                }}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1
                        className="text-xl font-bold tracking-tight"
                        style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                            color: "var(--color-ink)",
                        }}
                    >
                        Shiplog
                    </h1>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ color: "var(--color-ink)" }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-4 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                                style={{
                                    backgroundColor: isActive
                                        ? "var(--color-accent-red)"
                                        : "transparent",
                                    color: isActive
                                        ? "var(--color-ink)"
                                        : "var(--color-ink-muted)",
                                    border: isActive
                                        ? "1px solid var(--color-hairline)"
                                        : "1px solid transparent",
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {link.label}
                                </span>
                                {link.isPro && (
                                    <span
                                        className="text-xs px-2 py-1 rounded-full ml-auto"
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                            color: "var(--color-ink)",
                                            border: "1px solid var(--color-hairline)",
                                        }}
                                    >
                                        Pro
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                    {user?.isAdmin && (
                        <Link
                            href={adminNavLink.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                            style={{
                                backgroundColor: pathname.startsWith("/admin")
                                    ? "var(--color-accent-red)"
                                    : "transparent",
                                color: pathname.startsWith("/admin")
                                    ? "var(--color-ink)"
                                    : "var(--color-ink-muted)",
                                border: pathname.startsWith("/admin")
                                    ? "1px solid var(--color-hairline)"
                                    : "1px solid transparent",
                            }}
                        >
                            <adminNavLink.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {adminNavLink.label}
                            </span>
                        </Link>
                    )}
                </nav>

                <div
                    className="p-4 border-t mt-auto"
                    style={{ borderColor: "var(--color-hairline)" }}
                >
                    {session?.user && (
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full overflow-hidden"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                    border: "1px solid var(--color-hairline)",
                                }}
                            >
                                <img
                                    src={
                                        user?.avatarUrl ||
                                        session.user.avatarUrl ||
                                        session.user.image ||
                                        getDefaultAvatarUrl(
                                            session.user.username,
                                        )
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-medium truncate"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {session.user.name}
                                </p>
                                <p
                                    className="text-xs truncate"
                                    style={{
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    @{session.user.username || "user"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
