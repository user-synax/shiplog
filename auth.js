import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db";
import User from "./models/User";
import bcrypt from "bcryptjs";
import { isAdminEmail } from "./lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    return null;
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    username: user.username,
                    isAdmin: isAdminEmail(user.email),
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    trustHost: true,
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async signIn({ profile, account }) {
            if (account.provider === "google") {
                await dbConnect();
                const existingUser = await User.findOne({
                    email: profile.email,
                });
                if (!existingUser) {
                    await User.create({
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture,
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, profile }) {
            await dbConnect();
            // Check admin status
            const emailToCheck = user?.email || token.email;
            token.isAdmin = isAdminEmail(emailToCheck);

            if (user) {
                token.id = user.id;
                token.username = user.username;
            } else if (token.email) {
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.username = dbUser.username;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.isAdmin = token.isAdmin;
            }
            return session;
        },
    },
});
