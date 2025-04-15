<?php

namespace App\Controllers;

use App\Utils\Scraper;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Utils\ResponseHelper;
use PDO;

class ScrapeController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function scrape(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->query("SELECT p.id, p.name, p.url, p.current_price, p.user_id, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id");
        $products = $stmt->fetchAll();

        foreach ($products as $product) {
            $data = Scraper::scrapeProduct($product['url']);

            if (isset($data['error'])) {
                // NOTE: Skip if failed
                continue;
            }

            if ($product['current_price'] != $data['price']) {
                $stmt = $this->pdo->prepare("UPDATE products SET current_price = ? WHERE id = ?");
                $stmt->execute([$data['price'], $product['id']]);
                
                $stmt = $this->pdo->prepare("INSERT INTO price_history (product_id, price) VALUES (?, ?)");
                $stmt->execute([$product['id'], $data['price']]);
            }
        }

        // NOTE: Return updated products
        $stmt = $this->pdo->query("SELECT p.id, p.name, p.url, p.current_price, ph.price_history FROM products p LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id) ph ON p.id = ph.product_id");
        $products = $stmt->fetchAll();

        return ResponseHelper::jsonResponse($response, $products);
    }
}
