<?php

namespace App\Controllers;

use App\Utils\Scraper;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Utils\ResponseHelper;
use PDO;

class ProductController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function get(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("SELECT p.id, p.name, p.url, p.current_price, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id WHERE p.id = ?");
        $stmt->execute([$data['id']]);
        $product = $stmt->fetch();

        return ResponseHelper::jsonResponse($response, $product);
    }

    public function getAll(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->query("SELECT p.id, p.name, p.url, p.current_price, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id");
        $products = $stmt->fetchAll();

        return ResponseHelper::jsonResponse($response, $products);
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $scrapedData = Scraper::scrapeProduct($data['url']);
        $startingPrice = $scrapedData['price'] ?? 0;
        
        $stmt = $this->pdo->prepare("INSERT INTO products (name, url, current_price) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['url'], $startingPrice]);

        $productId = $this->pdo->lastInsertId();
        $stmt = $this->pdo->prepare("INSERT INTO price_history (product_id, price) VALUES (?, ?)");
        $stmt->execute([$productId, $startingPrice]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product created"], 201);
    }

    public function update(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("UPDATE products SET name = ?, url = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['url'], $data['id']]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product updated"]);
    }

    public function delete(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$data['id']]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product deleted"]);
    }
}
