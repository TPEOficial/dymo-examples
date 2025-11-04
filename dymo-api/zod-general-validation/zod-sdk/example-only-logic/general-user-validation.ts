import { z } from "zod";
import DymoAPIZod from "@dymo-api/zod";

const dymoClient = new DymoAPIZod({ apiKey: "YOUR_API_KEY_HERE" });

const userSchema = z.object({
    email: dymoClient.emailSchema(),
    username: z.string().min(3),
    age: z.number().int().min(0)
});

(async () => {
    const validatedUser = await userSchema.parseAsync({
        email: "user@tpeoficial.com",
        username: "build",
        age: 10
    });

    console.log(validatedUser);
    /*
    {
      email: "user@tpeoficial.com", // normalized by Dymo API
      username: "build",
      age: 10
    }
    */
})();