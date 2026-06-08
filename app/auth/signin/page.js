import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignInClient from "./SignInClient";

export default async function SignInPage() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }

    return <SignInClient />;
}
