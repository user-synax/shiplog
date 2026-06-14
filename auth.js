import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
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
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "repo read:user user:email",
                },
            },
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
            await dbConnect();

            if (account.provider === "google") {
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
            } else if (account.provider === "github") {
                const existingUser = await User.findOne({
                    email: profile.email,
                });
                if (!existingUser) {
                    await User.create({
                        email: profile.email,
                        name: profile.name || profile.login,
                        image: profile.avatar_url,
                        username: profile.login,
                        github: {
                            connected: true,
                            username: profile.login,
                            accessToken: account.access_token,
                            refreshToken: account.refresh_token,
                            tokenExpiresAt: account.expires_at
                                ? new Date(account.expires_at * 1000)
                                : null,
                            userId: profile.id.toString(),
                            avatarUrl: profile.avatar_url,
                        },
                    });
                } else {
                    await User.updateOne(
                        { email: profile.email },
                        {
                            $set: {
                                "github.connected": true,
                                "github.username": profile.login,
                                "github.accessToken": account.access_token,
                                "github.refreshToken": account.refresh_token,
                                "github.tokenExpiresAt": account.expires_at
                                    ? new Date(account.expires_at * 1000)
                                    : null,
                                "github.userId": profile.id.toString(),
                                "github.avatarUrl": profile.avatar_url,
                            },
                        },
                    );
                }
            }
            return true;
        },
        async jwt({ token, user, account, profile }) {
            await dbConnect();
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
                    token.githubConnected = dbUser.github?.connected;
                }
            }

            if (account && profile) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.isAdmin = token.isAdmin;
                session.user.githubConnected = token.githubConnected;
            }
            return session;
        },
    },
});
