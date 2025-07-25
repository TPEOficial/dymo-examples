from dymoapi import DymoAPI

dymo = DymoAPI({
    "api_key": "PRIVATE_TOKEN_HERE"
})

def check_sign_up(email: str, phone: str) -> dict:
    try:
        response = dymo.is_valid_data({
            "email": email,  # User's email address.
            "phone": phone   # If requested by the user (recommended).
        })

        # Email checks.
        if not response.email.valid: return { "pass": False, "message": "Use a valid email." }
        if response.email.fraud: return { "pass": False, "message": "Use your real email." }
        if response.email.proxiedEmail: return { "pass": False, "message": "Use your real email." }

        # Phone checks.
        if not response.phone.valid: return { "pass": False, "message": "Phone is not valid." }
        if response.phone.fraud: return { "pass": False, "message": "Use your real phone." }

        return { "pass": True, "realEmail": response.email.email }

    except Exception as e:
        print(f"Error during signup check: {e}")
        return { "pass": True }