from dymoapi import DymoAPI

dymo = DymoAPI({
    "api_key": "PRIVATE_TOKEN_HERE"
})

def check_sign_up(email: str, phone: str, ip: str) -> dict:
    try:
        response = dymo.is_valid_data({
            "email": email,  # User's email address.
            "phone": phone,  # If requested by the user (recommended).
            "ip": ip,        # User IP.
            "plugins": ["reachable"]
        })

        # Email checks.
        if not response.email.valid: return { "pass": False, "message": "Use a valid email." }
        if response.email.fraud: return { "pass": False, "message": "Use your real email." }
        if response.email.proxiedEmail: return { "pass": False, "message": "Use your real email." }
        if response.email.freeSubdomain: return { "pass": False, "message": "Use your real email." }
        if response.email.noReply: return { "pass": False, "message": "Use your real email." }  # Optional; the Reachable plugin already checks this internally.
        if response.email.plugins.reachable == "invalid": return { "pass": False, "message": "Use an existing email." }

        # Phone checks.
        if not response.phone.valid: return { "pass": False, "message": "Phone is not valid." }
        if response.phone.fraud: return { "pass": False, "message": "Use your real phone." }

        # IP checks.
        if not response.ip.valid: return { "pass": False, "message": "IP is not valid." }
        if response.ip.fraud: return { "pass": False, "message": "Use your real IP." }

        return { "pass": True, "realEmail": response.email.email }

    except Exception as e:
        print(f"Error during signup check: {e}")
        return { "pass": True }