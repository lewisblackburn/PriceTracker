<?php

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Firebase\JWT\JWT;

global $app, $pdo, $secretKey;

$app->post('/api/auth/login', function (Request $request, Response $response) use ($pdo, $secretKey) {
    $data = $request->getParsedBody();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['password'], $user['password'])) {
        $token = JWT::encode(['id' => $user['id'], 'email' => $user['email']], $secretKey, 'HS256');
        $response->getBody()->write(json_encode(["token" => $token]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    return $response->withStatus(401)->withJson(["error" => "Invalid credentials"]);
});
