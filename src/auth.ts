import { signInSchema } from "@/lib/zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                let user = null;

                const parsedCredentials = signInSchema.safeParse(credentials);
                if (!parsedCredentials.success) {
                    console.error("Invalid credentials:", parsedCredentials.error.errors);
                    return null;
                }

                const { username, password } = parsedCredentials.data;

                if (username === "admin" && password === "admin") {
                    user = {
                        id: '1',
                        name: 'Admin',
                        email: username,
                        role: "admin"
                    };
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        authorized({ request: { nextUrl }, auth }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;

            if (pathname.startsWith('/auth/signin') && isLoggedIn) {
                return Response.redirect(new URL('/admin/dashboard', nextUrl));
            }
            // if (pathname.startsWith("/page2") && role !== "admin") {
            //     return Response.redirect(new URL('/', nextUrl));
            // }
            return !!auth;
        },
    },
    pages: {
        signIn: "/auth/signin"
    }
})