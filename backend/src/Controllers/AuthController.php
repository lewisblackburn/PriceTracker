<?php

namespace App\Controllers;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Firebase\JWT\JWT;
use PDO;

class AuthController
{
    private PDO $pdo;
    private string $secretKey;

    public function __construct(PDO $pdo, string $secretKey)
    {
        $this->pdo = $pdo;
        $this->secretKey = $secretKey;
    }

    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data['password'], $user['password'])) {
            $token = JWT::encode(['id' => $user['id'], 'email' => $user['email']], $this->secretKey, 'HS256');
            $response->getBody()->write(json_encode(["token" => $token]));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(["error" => "Invalid credentials"]));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $this->pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->execute([$data['email'], $hashedPassword]);

        $response->getBody()->write(json_encode(["message" => "User registered"]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
