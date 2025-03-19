<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    private string $secretKey;

    public function __construct(string $secretKey)
    {
        $this->secretKey = $secretKey;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $headers = $request->getHeader('Authorization');
        $token = $headers[0] ?? '';

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            throw new HttpUnauthorizedException($request, 'Missing or invalid Authorization token.');
        }

    
        // NOTE: Remove the 'Bearer ' prefix before checking the token
        $jwt = substr($token, 7);
    
        try {
            $decoded = JWT::decode($jwt, new Key($this->secretKey, 'HS256'));
            $request = $request->withAttribute('user', $decoded);
        } catch (\Exception $e) {
            throw new HttpUnauthorizedException($request, 'Invalid or expired token.');
        }

        return $handler->handle($request);
    }
}
