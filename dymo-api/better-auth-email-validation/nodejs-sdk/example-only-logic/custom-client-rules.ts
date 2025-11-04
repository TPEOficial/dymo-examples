/*
* This content should be found in the Better-Auth API configuration file, which is usually located in app/api/auth/[..all]/route.ts for NextJS projects.
*/

import { auth } from "@/auth";
import DymoAPI from "dymo-api";
import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE",
    emailRules: {
        // These are the default rules defined for email validation.
        deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"]
    }
});

async function protect(req: NextRequest): Promise<any> {
    if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
        // Better-Auth reads the body, so we need to clone the request preemptively.
        const body = await req.clone().json();
        if (typeof body.email === "string") return await dymoClient.isValidEmail(body.email);
        return {
            allow: true,
            reasons: []
        };
    }
};

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

// Wrap the POST handler with Arcjet protections
export const POST = async (req: NextRequest) => {
    const decision = await protect(req);

    if (!decision.allow) {
        let message: string;
        if (decision.reasons.includes("INVALID")) message = "Email address format is invalid. Is there a typo?";
        else if (decision.reasons.includes("FRAUD")) message = "We do not allow disposable email addresses.";
        else if (decision.reasons.includes("NO_MX_RECORDS")) message = "Your email domain does not have an MX record. Is there a typo?";
        else message = "Invalid email.";
        return Response.json({ message }, { status: 400 });
    }

    return authHandlers.POST(req);
};