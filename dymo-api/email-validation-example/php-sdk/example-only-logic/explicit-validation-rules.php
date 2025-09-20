<?php

require "vendor/autoload.php";

use TPEOficial\DymoAPI;

$dymoClient = new DymoAPI([
    "api_key" => "PRIVATE_TOKEN_HERE",
    "rules" => [
        email => [
            // These are the default rules defined for email validation.
            deny => ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL", "NO_REACHABLE", "PROXIED_EMAIL"]
        ]
    ]
]);

$decision = $dymoClient->isValidEmail("user@example.com", [ "deny" => ["NO_REACHABLE"] ]);

if (!$decision->allow) throw new Exception("Email not allowed. Reason: {$decision->reasons[0]}.");

?>