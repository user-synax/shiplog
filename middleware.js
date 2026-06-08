export const runtime = "nodejs";

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/utils";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const session = await auth();

    if (pathname.startsWith("/dashboard")) {
        if (!session) {
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        if (!session) {
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
        const isAdmin = isAdminEmail(session.user?.email);
        if (!isAdmin) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
