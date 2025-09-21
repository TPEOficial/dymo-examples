import DymoAPI from "dymo-api";
import NextAuth, { type User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Initialize Dymo API client.
const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
    // If you wish, you can define different rules for each time you validate an email here or specify it in the function itself.
});

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    callbacks: {
        async signIn({ user }: { user: User; }) {
            // Validate the email with Dymo API.
            const decision = await dymoClient.isValidEmail(user.email!);
            if (!decision.allow) {
                console.error("Dymo validation failed:", decision.reasons[0]);
                return false; // Block OAuth login.
            }
            
            // Allow login if validation passes.
            return true;
        },
    }
});

export { handler as GET, handler as POST };