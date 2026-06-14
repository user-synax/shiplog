import Link from "next/link";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WaveBackground from "../components/ui/WaveBackground";
import HeroButton from "@/components/aura/heroButton";
import PricingCard from "@/components/aura/heroPricingCard";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <div
            className={`${inter.className} min-h-screen`}
            style={{ backgroundColor: "var(--color-canvas)" }}
        >
            {/* Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] md:w-[80vw] max-w-6xl">
                <div
                    className="backdrop-blur-xl rounded-full px-6 py-3 flex items-center justify-between"
                    style={{
                        backgroundColor: "rgba(15,15,15,0.8)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img
                            src="/shiplog.png"
                            alt="Shiplog Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span
                            className={`${plusJakarta.className} text-2xl font-bold tracking-tight`}
                            style={{ color: "var(--color-ink)" }}
                        >
                            Shiplog
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/signin"
                            className="hidden md:inline-flex px-5 py-2 rounded-full text-sm font-medium transition-colors"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                color: "var(--color-ink)",
                            }}
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/auth/signin"
                            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-canvas)",
                            }}
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="py-36 px-6 relative overflow-hidden">
                    <WaveBackground
                        className="absolute inset-0 z-0"
                        backdropBlurAmount="2xl"
                    />
                    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                        <h1
                            className={`${plusJakarta.className} text-4xl sm:text-7xl md:text-7xl font-semibold tracking-tighter`}
                            style={{
                                color: "var(--color-ink)",
                                letterSpacing: "-0.04em",
                            }}
                        >
                            Your developer identity.
                            <br />
                            One living profile.
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl max-w-lg mx-auto"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Showcase projects, track daily build logs, and
                            maintain a streak — all in one beautiful public
                            profile.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/auth/signin"
                                className="w-full sm:w-auto rounded-full text-md font-semibold flex items-center justify-center gap-2"
                            >
                                <HeroButton />
                            </Link>
                        </div>

                        {/* Mock Profile Preview */}
                        <div className="mt-20 max-w-2xl mx-auto w-full px-1">
                            {/* Browser Top */}
                            <div
                                className="rounded-t-3xl border p-3 sm:p-4 backdrop-blur-xl"
                                style={{
                                    backgroundColor: "rgba(26,26,26,0.8)",
                                    borderColor: "var(--color-hairline)",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                        }}
                                    />
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                        }}
                                    />
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                        }}
                                    />

                                    <div className="flex-1 mx-2 sm:mx-4">
                                        <div
                                            className="rounded-full px-3 sm:px-4 py-2 text-xs text-center"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-surface-1)",
                                                color: "var(--color-ink-muted)",
                                                border: "1px solid var(--color-hairline)",
                                            }}
                                        >
                                            shiplog.dev/alex
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Browser Content */}
                            <div
                                className="rounded-b-3xl border-x border-b p-4 sm:p-8"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                    borderColor: "var(--color-hairline)",
                                }}
                            >
                                <div
                                    className="rounded-3xl border p-4 sm:p-8 relative overflow-hidden"
                                    style={{
                                        backgroundColor: "var(--color-canvas)",
                                        borderColor: "var(--color-hairline)",
                                    }}
                                >
                                    <div className="relative max-w-md mx-auto">
                                        {/* Avatar & Name */}
                                        <div className="text-center">
                                            <div className="relative inline-block">
                                                <img
                                                    src="https://api.dicebear.com/9.x/notionists/svg?seed=Alex"
                                                    alt="avatar"
                                                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2"
                                                    style={{
                                                        borderColor:
                                                            "var(--color-hairline)",
                                                        backgroundColor:
                                                            "var(--color-surface-1)",
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <h3
                                                    className={`${plusJakarta.className} text-xl sm:text-2xl font-semibold`}
                                                    style={{
                                                        color: "var(--color-ink)",
                                                    }}
                                                >
                                                    Alex Chen
                                                </h3>

                                                <p
                                                    className="text-sm mt-1"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    @alex
                                                </p>

                                                <p
                                                    className="text-sm mt-4 leading-relaxed"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    Full-stack developer
                                                    building cool things on the
                                                    internet.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Streak & Stats */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                                            <div
                                                className="rounded-2xl p-3 sm:p-4 text-center"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-surface-1)",
                                                }}
                                            >
                                                <p
                                                    className="text-xl sm:text-2xl font-bold"
                                                    style={{
                                                        color: "var(--color-ink)",
                                                    }}
                                                >
                                                    28
                                                </p>
                                                <p
                                                    className="text-xs mt-1"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    Day Streak 🔥
                                                </p>
                                            </div>
                                            <div
                                                className="rounded-2xl p-3 sm:p-4 text-center"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-surface-1)",
                                                }}
                                            >
                                                <p
                                                    className="text-xl sm:text-2xl font-bold"
                                                    style={{
                                                        color: "var(--color-ink)",
                                                    }}
                                                >
                                                    127
                                                </p>
                                                <p
                                                    className="text-xs mt-1"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    Build Logs
                                                </p>
                                            </div>
                                            <div
                                                className="rounded-2xl p-3 sm:p-4 text-center"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-surface-1)",
                                                }}
                                            >
                                                <p
                                                    className="text-xl sm:text-2xl font-bold"
                                                    style={{
                                                        color: "var(--color-ink)",
                                                    }}
                                                >
                                                    9
                                                </p>
                                                <p
                                                    className="text-xs mt-1"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    Projects
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2
                            className={`${plusJakarta.className} text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.04em] text-center mb-16`}
                            style={{ color: "var(--color-ink)" }}
                        >
                            Everything you need
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                            {/* Large Streak Card */}
                            <div
                                className="md:col-span-4 rounded-[30px] p-8 min-h-[320px] flex flex-col justify-between"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            >
                                <div>
                                    <span
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                        className="text-sm"
                                    >
                                        Streaks
                                    </span>

                                    <h3
                                        className={`${plusJakarta.className} text-3xl mt-3 tracking-[-0.03em]`}
                                        style={{ color: "var(--color-ink)" }}
                                    >
                                        Build daily, stay consistent
                                    </h3>
                                </div>

                                <div
                                    className="mt-8 rounded-2xl h-40 flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    Streak Preview
                                </div>
                            </div>

                            {/* Gradient Spotlight Card */}
                            <div
                                className="md:col-span-2 rounded-[30px] p-8 min-h-[320px] text-white flex flex-col justify-between"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)",
                                }}
                            >
                                <div>
                                    <span className="text-white/70 text-sm">
                                        Profiles
                                    </span>

                                    <h3
                                        className={`${plusJakarta.className} text-3xl mt-3 tracking-[-0.03em]`}
                                    >
                                        A living portfolio that updates daily
                                    </h3>
                                </div>

                                <p className="text-white/80">
                                    Your public profile stays fresh with every
                                    build log you post.
                                </p>
                            </div>

                            {/* Projects */}
                            <div
                                className="md:col-span-2 rounded-[30px] p-8 min-h-[260px]"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                        className="text-sm"
                                    >
                                        Projects
                                    </span>
                                </div>

                                <h3
                                    className={`${plusJakarta.className} text-2xl tracking-[-0.03em]`}
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    Showcase your best work
                                </h3>

                                <p
                                    className="mt-4"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    Pin favorite projects, add tech stacks, and
                                    link to demos & repos.
                                </p>
                            </div>

                            {/* Build Logs */}
                            <div
                                className="md:col-span-2 rounded-[30px] p-8 min-h-[260px]"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                        className="text-sm"
                                    >
                                        Logs
                                    </span>
                                </div>

                                <h3
                                    className={`${plusJakarta.className} text-2xl tracking-[-0.03em]`}
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    Daily build logs
                                </h3>

                                <p
                                    className="mt-4"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    Track progress, share wins, and document
                                    what you are currently working on.
                                </p>
                            </div>

                            {/* Gradient Spotlight 2 */}
                            <div
                                className="md:col-span-2 rounded-[30px] p-8 min-h-[260px] text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#ff7a3d 0%,#ff5577 100%)",
                                }}
                            >
                                <span className="text-white/70 text-sm">
                                    Pro
                                </span>

                                <h3
                                    className={`${plusJakarta.className} text-2xl mt-4 tracking-[-0.03em]`}
                                >
                                    Advanced analytics & custom domains
                                </h3>
                            </div>

                            {/* Goals */}
                            <div
                                className="md:col-span-3 rounded-[30px] p-8 min-h-[280px]"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                        className="text-sm"
                                    >
                                        Goals
                                    </span>
                                </div>

                                <h3
                                    className={`${plusJakarta.className} text-3xl tracking-[-0.03em]`}
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    Set and track your goals
                                </h3>

                                <p
                                    className="mt-4 max-w-sm"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    Stay focused with learning goals and track
                                    your progress over time.
                                </p>
                            </div>

                            {/* Achievements */}
                            <div
                                className="md:col-span-3 rounded-[30px] p-8 min-h-[280px]"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                        className="text-sm"
                                    >
                                        Achievements
                                    </span>
                                </div>

                                <h3
                                    className={`${plusJakarta.className} text-3xl tracking-[-0.03em]`}
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    Unlock achievements as you build
                                </h3>

                                <p
                                    className="mt-4 max-w-sm"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    Hit streak milestones, log your first
                                    project, and earn badges.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2
                            className={`${plusJakarta.className} text-2xl sm:text-3xl md:text-5xl font-semibold tracking-[-0.04em] mb-12 text-center`}
                            style={{ color: "var(--color-ink)" }}
                        >
                            Simple pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Free Plan */}
                            <div
                                className="rounded-2xl p-8"
                                style={{
                                    backgroundColor: "var(--color-surface-1)",
                                    border: "1px solid var(--color-hairline)",
                                }}
                            >
                                <div className="mb-6">
                                    <h3
                                        className={`${plusJakarta.className} text-2xl font-semibold mb-2`}
                                        style={{ color: "var(--color-ink)" }}
                                    >
                                        Free
                                    </h3>
                                    <p
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        Perfect for getting started
                                    </p>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span
                                            className={`${plusJakarta.className} text-4xl font-bold`}
                                            style={{
                                                color: "var(--color-ink)",
                                            }}
                                        >
                                            $0
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--color-ink-muted)",
                                            }}
                                        >
                                            /month
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li
                                        className="flex items-center gap-3"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                                            style={{
                                                borderColor:
                                                    "var(--color-hairline)",
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        Up to 5 projects
                                    </li>
                                    <li
                                        className="flex items-center gap-3"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                                            style={{
                                                borderColor:
                                                    "var(--color-hairline)",
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        Unlimited build logs
                                    </li>
                                    <li
                                        className="flex items-center gap-3"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                                            style={{
                                                borderColor:
                                                    "var(--color-hairline)",
                                            }}
                                        />
                                        Public profile
                                    </li>
                                    <li
                                        className="flex items-center gap-3"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                                            style={{
                                                borderColor:
                                                    "var(--color-hairline)",
                                            }}
                                        />
                                        No analytics
                                    </li>
                                </ul>
                                <Link
                                    href="/auth/signin"
                                    className="w-full py-3 px-4 rounded-full text-center font-semibold transition-colors"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    Get started
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div
                                className="relative overflow-hidden rounded-2xl p-8"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                }}
                            >
                                <PricingCard />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                className="py-8 px-6"
                style={{
                    backgroundColor: "var(--color-canvas)",
                    borderTop: "1px solid var(--color-hairline)",
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/shiplog.png"
                            alt="Shiplog Logo"
                            className="w-7 h-7 object-contain"
                        />
                        <span
                            className={`${plusJakarta.className} text-xl font-bold tracking-tight`}
                            style={{ color: "var(--color-ink)" }}
                        >
                            Shiplog
                        </span>
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link
                            href="#"
                            className="text-sm transition-colors"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            GitHub
                        </Link>
                        <Link
                            href="#"
                            className="text-sm transition-colors"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm transition-colors"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Terms
                        </Link>
                    </div>
                    <p
                        className="text-xs"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Built for developers
                    </p>
                </div>
            </footer>
        </div>
    );
}
