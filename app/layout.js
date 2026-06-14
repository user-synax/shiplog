import { SessionProvider } from "next-auth/react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const giestSansInter = Inter({
    subsets: ["latin"],
    variable: "--font-giest-sans-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
});

export const metadata = {
    title: {
        default: "Shiplog | Developer Identity Platform",
        template: "%s | Shiplog",
    },
    description:
        "Shiplog is the developer identity platform for building your professional portfolio. Showcase projects, track daily build logs, maintain coding streaks, and share your journey with a beautiful public profile.",
    keywords: [
        "developer portfolio",
        "build logs",
        "developer profile",
        "coding streak",
        "project showcase",
        "developer identity",
        "programming portfolio",
        "software developer portfolio",
        "daily coding",
        "developer website",
        "coding portfolio",
    ],
    authors: [{ name: "Shiplog" }],
    creator: "Shiplog",
    publisher: "Shiplog",
    robots: "index, follow",
    formatDetection: {
        telephone: false,
        address: false,
        email: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://shiplog.usersynax.dev",
        siteName: "Shiplog",
        title: "Shiplog | Developer Identity Platform",
        description:
            "Shiplog is the developer identity platform for building your professional portfolio. Showcase projects, track daily build logs, maintain coding streaks, and share your journey with a beautiful public profile.",
        images: [
            {
                url: "https://shiplog.usersynax.dev/shiplog.png",
                width: 1200,
                height: 630,
                alt: "Shiplog - Developer Identity Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@shiplog",
        creator: "@shiplog",
        title: "Shiplog | Developer Identity Platform",
        description:
            "Shiplog is the developer identity platform for building your professional portfolio. Showcase projects, track daily build logs, maintain coding streaks, and share your journey.",
        images: ["https://shiplog.usersynax.dev/shiplog.png"],
    },
    verification: {
        google: "mtSQQTLUoP5DvYa7RCE6CnrEoUYfmWX0FdkkYzDO8Po",
    },
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                rel: "android-chrome-192x192",
                url: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                rel: "android-chrome-512x512",
                url: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    },
    alternates: {
        canonical: "https://shiplog.usersynax.dev",
    },
};

// Structured Data JSON-LD component
function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shiplog",
        url: "https://shiplog.usersynax.dev",
        description:
            "Developer identity platform for building your professional portfolio. Showcase projects, track daily build logs, maintain coding streaks.",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://shiplog.usersynax.dev/{search_term_string}",
            "query-input": "required name=search_term_string",
        },
        publisher: {
            "@type": "Organization",
            name: "Shiplog",
            logo: {
                "@type": "ImageObject",
                url: "https://shiplog.usersynax.dev/shiplog.png",
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${giestSansInter.variable} ${plusJakartaSans.variable}`}
        >
            <head>
                <StructuredData />
            </head>
            <body className="min-h-screen">
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
