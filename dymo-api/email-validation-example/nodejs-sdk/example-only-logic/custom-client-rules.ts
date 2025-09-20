import DymoAPI from "dymo-api";

const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE",
    rules: {
        email: {
            // These are the default rules defined for email validation.
            deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL", "NO_REACHABLE", "PROXIED_EMAIL"]
        }
    }
});

(async () => {
    const decision = await dymoClient.isValidEmail("user@example.com");

    if (!decision.allow) throw new Error(`Email not allowed. Reason: ${decision.reasons[0]}`);
})();