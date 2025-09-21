import DymoAPI from "dymo-api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Initialize Dymo API client.
const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
    // If you wish, you can define different rules for each time you validate an email here or specify it in the function itself.
});

// Function to validate sign up data using Dymo.
async function checkSignUp({
    email,
    phone,
    ip,
    userAgent,
}: {
    email: string;
    phone: string;
    ip: string;
    userAgent: string;
}): Promise<{
    pass: boolean;
    message?: string;
    realEmail?: string;
}> {
    try {
        const response = await dymoClient.isValidData({
            email,
            phone,
            ip,
            userAgent,
            plugins: ["reachable"],
        });

        // Email checks.
        if (!response.email.valid) return { pass: false, message: "Use a valid email." };
        if (response.email.fraud) return { pass: false, message: "Use your real email." };
        if (response.email.proxiedEmail) return { pass: false, message: "Use your real email." };
        if (response.email.freeSubdomain) return { pass: false, message: "Use your real email." };
        if (response.email.noReply) return { pass: false, message: "Use your real email." };
        if (response.email.plugins.reachable === "invalid") return { pass: false, message: "Use an existing email." };

        // Phone checks.
        if (!response.phone.valid) return { pass: false, message: "Phone is not valid." };
        if (response.phone.fraud) return { pass: false, message: "Use your real phone." };

        // IP checks.
        if (!response.ip.valid) return { pass: false, message: "IP is not valid." };
        if (response.ip.fraud) return { pass: false, message: "Use your real IP." };

        // User agent checks.
        if (!response.userAgent.valid) return { pass: false, message: "User agent is not valid." };
        if (response.userAgent.fraud) return { pass: false, message: "Use your real user agent." };
        if (response.userAgent.bot) return { pass: false, message: "Use your real user agent." };

        return { pass: true, realEmail: response.email.email };
    } catch (error) {
        console.error(error);
        return { pass: true };
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                phone: { label: "Phone", type: "text" },

                // Fields not visible on the form, but required.
                ip: { label: "IP", type: "text" },
                userAgent: { label: "User Agent", type: "text" }
            },
            async authorize(credentials: Record<"email" | "password" | "phone" | "ip" | "userAgent", string> | undefined) {
                if (!credentials) return null;

                // Validate sign up data using Dymo.
                const result = await checkSignUp({
                    email: credentials.email,
                    phone: credentials.phone,
                    ip: credentials.ip,
                    userAgent: credentials.userAgent
                });

                if (!result.pass) throw new Error(result.message);

                // Check user credentials in your database.
                if (credentials.email === "test@tpeoficial.com" && credentials.password === "1234") return { id: "1", name: "Test User", email: credentials.email };

                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    }
});

export { handler as GET, handler as POST };