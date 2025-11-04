/*
* This content should be found in the Better-Auth configuration file, which is usually located in src/lib/auth.ts or app/lib/auth.ts.
*/

import { betterAuth } from "better-auth";
import { dymoPhonePlugin } from "@dymo-api/better-auth";

export const auth = betterAuth({
    plugins: [
        dymoPhonePlugin({
            apiKey: "YOUR_API_KEY_HERE",
            phoneRules: {
                // These are the default rules defined for phone validation.
                deny: ["FRAUD", "INVALID"]
            }
        })
    ]
});