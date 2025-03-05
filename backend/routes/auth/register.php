<?php

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Firebase\JWT\JWT;

global $app, $pdo, $secretKey;

$app->post('/api/auth/register', function (Request $request, Response $response) use ($pdo) {
    $data = $request->getParsedBody();
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->execute([$data['email'], $hashedPassword]);

    $response->getBody()->write(json_encode(["message" => "User registered"]));
    return $response->withHeader('Content-Type', 'application/json');
});

