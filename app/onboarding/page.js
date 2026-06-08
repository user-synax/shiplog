import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session) {
        redirect("/auth/signin");
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (user?.username) {
        redirect("/dashboard");
    }

    return <OnboardingForm />;
}
