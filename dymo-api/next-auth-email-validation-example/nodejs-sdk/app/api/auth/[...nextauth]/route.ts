import DymoAPI from "dymo-api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Initialize Dymo API client.
const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
    // If you wish, you can define different rules for each time you validate an email here or specify it in the function itself.
});

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials?.email || !credentials?.password) return null;

                // Validate the email with Dymo API.
                const decision = await dymoClient.isValidEmail(credentials.email);
                if (!decision.allow) throw new Error(`Email not allowed. Reason: ${decision.reasons[0]}.`);

                /*
                * IMPORTANT: It is recommended to use the email provided by the Dymo API decision, 
                * as it will bring the clean email without aliases or invalid characters that may 
                * treat an email as several separate ones.
                */

                // Check user credentials in your database.
                if (decision.email === "test@tpeoficial.com" && credentials.password === "1234") return { id: "1", name: "Test User", email: credentials.email };

                // Return null if authentication fails.
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    }
});

export { handler as GET, handler as POST };