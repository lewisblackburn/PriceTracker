<?php

use Slim\Psr7\Request;
use Slim\Psr7\Response;

global $app, $pdo;

$app->get('/api/products', function (Request $request, Response $response) use ($pdo) {
    $stmt = $pdo->query("SELECT * FROM products");
    $response->getBody()->write(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
    return $response->withHeader('Content-Type', 'application/json');
});

