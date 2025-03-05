<?php

namespace App\Controllers;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PDO;

class ProductController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAll(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response->getBody()->write(json_encode($products));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("INSERT INTO products (name, url, current_price) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['url'], $data['current_price']]);

        $response->getBody()->write(json_encode(["message" => "Product added"]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
