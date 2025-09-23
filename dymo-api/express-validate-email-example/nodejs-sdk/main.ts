import express from "express";
import DymoAPI from "dymo-api";

const app = express();

app.use(express.urlencoded({ extended: false }));

const dymoClient = new DymoAPI({
    apiKey: "PRIVATE_TOKEN_HERE",
    // rules: {
    //     email: {
    //         // These are the default rules defined for email validation.
    //         deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"]
    //     }
    // }
});

app.post("/", async (req: express.Request, res: express.Response) => {
    const decision = await dymoClient.isValidEmail(req.body.email);
    console.log("Dymo decision", decision);

    if (!decision.allow) {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Forbidden" }));
    } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Hello World", email: decision.email }));
    }
});

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
});