<?php

namespace App\Controllers;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Firebase\JWT\JWT;
use App\Utils\ResponseHelper;
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

            return ResponseHelper::jsonResponse($response, ["token" => $token]);

        }

        return ResponseHelper::jsonResponse($response, ["error" => "Invalid credentials"], 401);
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) return ResponseHelper::jsonResponse($response, ["error" => "User already exists"], 400);
        
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $this->pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->execute([$data['email'], $hashedPassword]);

        $token = JWT::encode(['id' => $this->pdo->lastInsertId(), 'email' => $data['email']], $this->secretKey, 'HS256');

        return ResponseHelper::jsonResponse($response, ["token" => $token]);
    }

    public function profile(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        // NOTE: It has to be casted to an arary for the JSON response to be happy
        $user = (array) $user;
        return ResponseHelper::jsonResponse($response, $user);
    }
}
