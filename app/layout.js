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
    title: "Shiplog | Developer Identity Platform",
    description:
        "Developer identity platform for building your professional profile. Showcase projects, track daily build logs, and maintain a streak — all in one beautiful public profile.",
    keywords: [
        "developer portfolio",
        "build logs",
        "developer profile",
        "coding streak",
        "project showcase",
    ],
    authors: [{ name: "Shiplog" }],
    creator: "Shiplog",
    publisher: "Shiplog",
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
            "Developer identity platform for building your professional profile. Showcase projects, track daily build logs, and maintain a streak — all in one beautiful public profile.",
        images: [
            {
                url: "/shiplog.png",
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
            "Developer identity platform for building your professional profile. Showcase projects, track daily build logs, and maintain a streak — all in one beautiful public profile.",
        images: ["/shiplog.png"],
    },
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${giestSansInter.variable} ${plusJakartaSans.variable}`}
        >
            <body className="min-h-screen">
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
