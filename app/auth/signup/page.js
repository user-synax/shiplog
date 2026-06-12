import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpClient from "./SignUpClient";

export const metadata = {
    title: "Sign Up | Shiplog",
    description:
        "Create your free Shiplog account and start building your developer profile with projects, build logs, and coding streaks.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://shiplog.usersynax.dev/auth/signup",
        siteName: "Shiplog",
        title: "Sign Up | Shiplog",
        description:
            "Create your free Shiplog account and start building your developer profile with projects, build logs, and coding streaks.",
        images: ["/shiplog.png"],
    },
    twitter: {
        card: "summary",
        site: "@shiplog",
        creator: "@shiplog",
        title: "Sign Up | Shiplog",
        description:
            "Create your free Shiplog account and start building your developer profile with projects, build logs, and coding streaks.",
        images: ["/shiplog.png"],
    },
};

export default async function SignUpPage() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }

    return <SignUpClient />;
}
