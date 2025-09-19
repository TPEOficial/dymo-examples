<?php

require "vendor/autoload.php";

use TPEOficial\DymoAPI;

function checkSignUp(string $email, string $phone, string $ip, string $userAgent): array {
    $dymoClient = new DymoAPI([
        "api_key" => "PRIVATE_TOKEN_HERE"
    ]);

    try {
        $response = $dymoClient->isValidData([
            "email" => $email,         // User's email address.
            "phone" => $phone,         // If requested by the user (recommended).
            "ip" => $ip,               // User IP.
            "userAgent" => $userAgent  // User agent.
        ]);

        // Email checks.
        if (!$response->email->valid) return ["pass" => false, "message" => "Use a valid email."];
        if ($response->email->fraud) return ["pass" => false, "message" => "Use your real email."];
        if ($response->email->proxiedEmail) return ["pass" => false, "message" => "Use your real email."];
        if ($response->email->freeSubdomain) return ["pass" => false, "message" => "Use your real email."];

        // Phone checks.
        if (!$response->phone->valid) return ["pass" => false, "message" => "Phone is not valid."];
        if ($response->phone->fraud) return ["pass" => false, "message" => "Use your real phone."];

        // IP checks.
        if (!$response->ip->valid) return ["pass" => false, "message" => "IP is not valid."];
        if ($response->ip->fraud) return ["pass" => false, "message" => "Use your real IP."];

        // User agent checks.
        if (!$response->userAgent->valid) return ["pass" => false, "message" => "User agent is not valid."];
        if ($response->userAgent->fraud) return ["pass" => false, "message" => "Use your real user agent."];
        if ($response->userAgent->fraud) return ["pass" => false, "message" => "Use your real user agent."];

        return ["pass" => true, "realEmail" => $response->email->email];
    } catch (Exception $e) {
        error_log("Error during signup check: " . $e->getMessage());
        return ["pass" => true];
    }
}