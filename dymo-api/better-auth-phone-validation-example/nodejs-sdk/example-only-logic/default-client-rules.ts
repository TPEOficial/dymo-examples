/*
* This content should be found in the Better-Auth API configuration file, which is usually located in app/api/auth/[..all]/route.ts for NextJS projects.
*/

import { auth } from "@/auth";
import DymoAPI from "dymo-api";
import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
});

async function protect(req: NextRequest): Promise<any> {
    if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
        // Better-Auth reads the body, so we need to clone the request preemptively.
        const body = await req.clone().json();
        if (typeof body.phoneNumber === "string") return await dymoClient.isValidPhone(body.phoneNumber);
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
        if (decision.reasons.includes("INVALID")) message = "Phone number format is invalid. Is there a typo?";
        else if (decision.reasons.includes("FRAUD")) message = "We do not allow fraud phone numbers.";
        else message = "Invalid phone number.";
        return Response.json({ message }, { status: 400 });
    }

    return authHandlers.POST(req);
};