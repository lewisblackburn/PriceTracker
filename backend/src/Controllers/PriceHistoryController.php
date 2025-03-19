<?php

namespace App\Controllers;

use Exception;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Utils\ResponseHelper;
use PDO;

class PriceHistoryController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function get(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $stmt = $this->pdo->prepare("SELECT product_id, JSON_ARRAYAGG(price) AS price_history FROM price_history WHERE product_id = ? GROUP BY product_id");
        $stmt->execute([$data['product_id']]);
        $priceHistory = $stmt->fetch();

        return ResponseHelper::jsonResponse($response, $priceHistory);
    }

    public function getAll(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->query("SELECT id, JSON_ARRAYAGG(price) AS price_history FROM price_history GROUP BY product_id");
        $priceHistories = $stmt->fetchAll();

        return ResponseHelper::jsonResponse($response, $priceHistories);
    }
  
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        try {
            $this->pdo->beginTransaction();
            
            // Create a new price history record
            $stmt = $this->pdo->prepare("INSERT INTO price_history (product_id, price) VALUES (?, ?)");
            $stmt->execute([$data['product_id'], $data['price']]);

            // Update the existing product's current price
            $stmt = $this->pdo->prepare("UPDATE products SET current_price = ? WHERE id = ?");
            $stmt->execute([$data['price'], $data['product_id']]);

            $this->pdo->commit();
        } catch (Exception $e) {
            // If one of the transactions fail, rollback
            $this->pdo->rollBack();
            throw $e; 
        }

        return ResponseHelper::jsonResponse($response, ["message" => "Price history added"], 201);
    }

    public function deleteLast(Request $request, Response $response): Response
    {
        
        // TODO: make transaction
        $data = $request->getParsedBody();

        // NOTE: If there is only one price history record, we should not delete it
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM price_history WHERE product_id = ?");
        $stmt->execute([$data['product_id']]);
        $count = $stmt->fetchColumn();

        if ($count == 1) return ResponseHelper::jsonResponse($response, ["error" => "Cannot delete the last price history record"], 400);
        
        $stmt = $this->pdo->prepare("DELETE FROM price_history WHERE product_id = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$data['product_id']]);

        // Update the product's current price
        $stmt = $this->pdo->prepare("SELECT price FROM price_history WHERE product_id = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$data['product_id']]);
        $price = $stmt->fetchColumn();

        $stmt = $this->pdo->prepare("UPDATE products SET current_price = ? WHERE id = ?");
        $stmt->execute([$price, $data['product_id']]);

        return ResponseHelper::jsonResponse($response, ["message" => "Price history deleted"]);
    }
}
