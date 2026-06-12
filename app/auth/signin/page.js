import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignInClient from "./SignInClient";

export const metadata = {
    title: "Sign In | Shiplog",
    description:
        "Sign in to your Shiplog account to manage your developer profile, build logs, and projects.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://shiplog.usersynax.dev/auth/signin",
        siteName: "Shiplog",
        title: "Sign In | Shiplog",
        description:
            "Sign in to your Shiplog account to manage your developer profile, build logs, and projects.",
        images: ["/shiplog.png"],
    },
    twitter: {
        card: "summary",
        site: "@shiplog",
        creator: "@shiplog",
        title: "Sign In | Shiplog",
        description:
            "Sign in to your Shiplog account to manage your developer profile, build logs, and projects.",
        images: ["/shiplog.png"],
    },
};

export default async function SignInPage() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }

    return <SignInClient />;
}
