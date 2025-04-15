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
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("SELECT p.id, p.name, p.url, p.current_price, p.threshold, p.user_id, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id WHERE p.id = ?");
        $stmt->execute([$data['id']]);
        $product = $stmt->fetch();

        if (!$product) {
            return ResponseHelper::jsonResponse($response, ["error" => "Product not found"], 404);
        }

        if ($product['user_id'] !== $user->id) {
            return ResponseHelper::jsonResponse($response, ["error" => "You do not have permission to access this product"], 403);
        }

        return ResponseHelper::jsonResponse($response, $product);
    }

    public function getAll(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $stmt = $this->pdo->query("SELECT p.id, p.name, p.url, p.current_price, p.threshold, p.user_id, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id");
        $products = $stmt->fetchAll();


        foreach ($products as $product) {
            if ($product['user_id'] === $user->id) {
                // NOTE: Remove a product if the user id does not match
                unset($products[$product['id']]);
            }
        }

        return ResponseHelper::jsonResponse($response, $products);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        $scrapedData = Scraper::scrapeProduct($data['url']);
        $startingPrice = $scrapedData['price'] ?? 0;
        $name = $scrapedData['name'];

        $stmt = $this->pdo->prepare("INSERT INTO products (name, url, current_price, threshold, user_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $data['url'], $startingPrice, $data['threshold'], $user->id]);

        $productId = $this->pdo->lastInsertId();
        $stmt = $this->pdo->prepare("INSERT INTO price_history (product_id, price) VALUES (?, ?)");
        $stmt->execute([$productId, $startingPrice]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product created", "id" => $productId], 201);
    }

    public function update(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("UPDATE products SET name = ?, url = ?, threshold = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$data['name'], $data['url'], $data['threshold'], $data['id'], $user->id]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product updated"]);
    }

    public function delete(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ? AND user_id = ?");
        $stmt->execute([$data['id'], $user->id]);

        return ResponseHelper::jsonResponse($response, ["message" => "Product deleted"]);
    }

    public function setThreshold(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        $stmt = $this->pdo->prepare("UPDATE products SET threshold = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$data['threshold'], $data['id'], $user->id]);

        return ResponseHelper::jsonResponse($response, ["message" => "Threshold set"]);
    }
}
