<?php

function base64UrlEncode($data)
{
    $urlSafeData = strtr(base64_encode($data), '+/', '-_');
    return rtrim($urlSafeData, '='); 
} 

function base64UrlDecode($data)
{
    $urlUnsafeData = strtr($data, '-_', '+/');
    $paddedData = str_pad($urlUnsafeData, strlen($data) % 4, '=', STR_PAD_RIGHT);
    return base64_decode($paddedData);
}

function generateJWT(        
    array $payload,
    $secret
) {
    $headerEncoded = base64UrlEncode(json_encode(["alg"=> "HS256", "typ" => "JWT"]));
    $payloadEncoded = base64UrlEncode(json_encode($payload));

    // Delimit with period (.)
    $dataEncoded = "$headerEncoded.$payloadEncoded";
    $rawSignature = hash_hmac('sha256', $dataEncoded, $secret, true);
    $signatureEncoded = base64UrlEncode($rawSignature);

    // Delimit with second period (.)
    $jwt = "$dataEncoded.$signatureEncoded";

    return $jwt;
}

function verifyJWT($jwt, $secret)
{
    list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);

    $dataEncoded = "$headerEncoded.$payloadEncoded";
    $signature = base64UrlDecode($signatureEncoded);
    $rawSignature = hash_hmac('sha256', $dataEncoded, $secret, true);

    return hash_equals($rawSignature, $signature);
}

function payloadJWT($jwt) {    
    list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);
    return json_decode(base64_decode($payloadEncoded), true);
}

?>