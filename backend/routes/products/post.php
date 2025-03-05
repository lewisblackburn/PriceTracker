<?php

use Slim\Psr7\Request;
use Slim\Psr7\Response;

global $app, $pdo;

$app->post('/api/products', function (Request $request, Response $response) use ($pdo) {
    $data = $request->getParsedBody();
    $stmt = $pdo->prepare("INSERT INTO products (name, url, current_price) VALUES (?, ?, ?)");
    $stmt->execute([$data['name'], $data['url'], $data['current_price']]);

    $response->getBody()->write(json_encode(["message" => "Product added"]));
    return $response->withHeader('Content-Type', 'application/json');
});
