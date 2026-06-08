import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpClient from "./SignUpClient";

export default async function SignUpPage() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }

    return <SignUpClient />;
}
