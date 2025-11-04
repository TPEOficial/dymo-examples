/*
* This content should be found in the Better-Auth configuration file, which is usually located in src/lib/auth.ts or app/lib/auth.ts.
*/

import { betterAuth } from "better-auth";
import { dymoEmailPlugin } from "@dymo-api/better-auth";

export const auth = betterAuth({
    plugins: [
        dymoEmailPlugin({
            apiKey: "YOUR_API_KEY_HERE",
            emailRules: {
                // These are the default rules defined for email validation.
                deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"]
            }
        })
    ]
});