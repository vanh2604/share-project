import {getServerSession} from "next-auth/next";
import {NextAuthOptions, User} from "next-auth";
import {AdapterUser} from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import {SessionInterface, UserProfile} from "../common.types";
import jsonwebtoken from 'jsonwebtoken'
import {JWT} from "next-auth/jwt";
import {createUser, getUser} from "./apollo-client";


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
            );

            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session,token,user }) {
            const email = session?.user?.email
            try {
                const {data} = await getUser(email) as {data: {user?: UserProfile}}
                return {
                    ...session, user: {
                        ...session.user,
                        ...data.user
                    },
                    accessToken : token.accessToken
                }
            } catch (e) {
                console.log(e)
                return session
            }
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async signIn({ user }: {
            user: AdapterUser | User
        }) {
            try {
                const userExists = await getUser(user?.email as string) as {data:{user ?: UserProfile}}
                if(!userExists.data.user) {
                    await createUser(user.name, user.email, user.image)
                }
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
    },
};

export const getCurrentUser = async () => {
    return await getServerSession(authOptions) as SessionInterface
}