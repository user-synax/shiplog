import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user.isPro) {
        return (
            <div className="min-h-full flex items-center justify-center p-6">
                <div
                    className="w-full max-w-md p-8 rounded-[30px] text-center"
                    style={{
                        background:
                            "linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)",
                    }}
                >
                    <h2
                        className={`${plusJakarta.className} text-3xl font-semibold tracking-[-0.03em] text-white mb-4`}
                    >
                        Unlock Analytics
                    </h2>
                    <p className="text-white/80 mb-6">
                        Upgrade to Pro to see detailed profile views, project
                        clicks, and more.
                    </p>
                    <Link
                        href="/dashboard/billing"
                        className="inline-flex px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "white", color: "#0f0f0f" }}
                    >
                        Upgrade to Pro
                    </Link>
                </div>
            </div>
        );
    }

    return <AnalyticsDashboard />;
}
