import { Crown, Users, MessagesSquare, Check } from "lucide-react";
import Link from "next/link";

export default function PricingCard() {
    return (
        <article
            className="relative overflow-hidden rounded-2xl bg-gray-900 bg-cover bg-center text-white shadow-sm ring-1 ring-black/5 p-6"
            style={{
                backgroundImage:
                    "url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/046f0e74-64ae-4e71-ae2d-67940e33e9bc_1600w.jpg)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium leading-relaxed opacity-95">
                    Pro
                </div>

                <span
                    className="inline-flex items-center gap-1 rounded border border-white/70 px-2 py-1 text-xs uppercase opacity-95"
                    aria-label="Top pick"
                >
                    <Crown className="h-3.5 w-3.5" />
                    Most Popular
                </span>
            </div>

            {/* Title */}
            <div className="mt-3">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-2xl">
                    Built for seroius developers
                </h2>

                <p className="mt-1 text-sm text-white/85">
                    create and manage your beauitiful developer profile with ease and speed. Get access to all premium themes, analytics, and early access to new features.
                </p>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                    ₹99
                </span>

                <span className="text-sm text-white/90">/mo</span>
            </div>

            {/* Divider */}
            <div className="mt-5 h-px bg-white/50" />

            {/* Features */}
            <ul className="mt-4 space-y-2.5 text-sm text-white">
                {[
                    "30+ Premium themes",
                    "Full analytics & insights",
                    "Fast support from developer",
                    "Get early access to new features",
                ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Buttons */}
            <div className="mt-4 flex items-center gap-3">
                <Link
                    href="https://wa.me/+918826343179?text=Hi%20Shiplog%2C%20I%20am%20interested%20in%20the%20Pro%20plan.%20Could%20you%20please%20provide%20me%20with%20a%20promo%20code%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-white shadow-sm transition-colors hover:cursor-pointer hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        aria-label="Start Team plan"
                    >
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Get Promo Code</span>
                    </button>
                </Link>
            </div>
        </article>
    );
}
