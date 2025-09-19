import DymoAPI from "dymo-api";

const dymo = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
});

async function checkSignUp({
    email,
    phone
}: {
    email: string;
    phone: string;
}): Promise<{
    pass: boolean;
    message?: string;
    realEmail?: string;
}> {
    try {
        const response = await dymo.isValidData({
            email,  // User's email address.
            phone   // If requested by the user (recommended).
        });

        // Email checks.
        if (!response.email.valid) return { pass: false, message: "Use a valid email." };
        if (response.email.fraud) return { pass: false, message: "Use your real email." };
        if (response.email.proxiedEmail) return { pass: false, message: "Use your real email." };

        // Phone checks.
        if (!response.phone.valid) return { pass: false, message: "Phone is not valid." };
        if (response.phone.fraud) return { pass: false, message: "Use your real phone." };

        return { pass: true, realEmail: response.email.email };
    } catch (error) {
        console.error(error);
        return { pass: true };
    }
};