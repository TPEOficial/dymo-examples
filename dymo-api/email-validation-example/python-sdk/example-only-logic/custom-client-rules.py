from dymoapi import DymoAPI

dymo_client = DymoAPI({
    "api_key": "PRIVATE_TOKEN_HERE",
    "rules": {
        "email": {
            # These are the default rules defined for email validation.
            "deny": ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL", "NO_REACHABLE", "PROXIED_EMAIL"]
        }
    }
})

decision = dymo_client.is_valid_email("user@example.com")

if not decision.allow: raise Exception(f"Email not allowed. Reason: {decision.reasons[0]}.")

"""
    IMPORTANT: It is recommended to use the email provided by the Dymo API decision, 
    as it will bring the clean email without aliases or invalid characters that may 
    treat an email as several separate ones.
"""