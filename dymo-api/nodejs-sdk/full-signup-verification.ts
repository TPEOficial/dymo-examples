import DymoAPI from "dymo-api";

const dymo = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE"
});

async function checkSignUp({ 
    email, 
    phone, 
    ip 
}: { 
    email: string; 
    phone: string; 
    ip: string;
}): Promise<{ 
    pass: boolean;
    message?: string;
    realEmail?: string;
}> {
    try {
        const response = await dymo.isValidData({
            email,  // User's email address.
            phone,  // If requested by the user (recommended).
            ip,     // User IP.
            plugins: ["reachable"]
        });

        // Email cheks.
        if (!response.email.valid) return { pass: false, message: "Use a valid email." };
        if (response.email.fraud) return { pass: false, message: "Use your real email." };
        if (response.email.proxiedEmail) return { pass: false, message: "Use your real email." };
        if (response.email.freeSubdomain) return { pass: false, message: "Use your real email." };
        if (response.email.noReply) return { pass: false, message: "Use your real email." }; // Optional; the Reachable plugin already checks this internally.
        if (response.email.plugins.reachable === "invalid") return { pass: false, message: "Use your an existing email." };

        // Phone cheks.
        if (!response.phone.valid) return { pass: false, message: "Phone is not valid." };
        if (response.phone.fraud) return { pass: false, message: "Use your real phone." };

        // IP cheks.
        if (!response.ip.valid) return { pass: false, message: "IP is not valid." };
        if (response.ip.fraud) return { pass: false, message: "Use your real IP." };

        
        return { pass: true, realEmail: response.email.email };
    } catch (error) {
        console.error(error);
        return { pass: true };
    }
};