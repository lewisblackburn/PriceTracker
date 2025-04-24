<?php

namespace App\Controllers;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Utils\ResponseHelper;
use PDO;

class ThresholdController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function threshold(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $stmt = $this->pdo->query("SELECT id, name, current_price, threshold, user_id from products");
        $products = $stmt->fetchAll();

        foreach ($products as $product) {
            $threshold = floatval($product['threshold']);
            $currentPrice = floatval($product['current_price']);

            if ($currentPrice <= $threshold) {
                // NOTE: if notification already exists, skip
                $stmt = $this->pdo->prepare("SELECT * FROM notifications WHERE user_id = ? AND type = ? AND title = ? AND message = ? AND is_read = 0"); 
                $stmt->execute([$product['user_id'], 'product', $product['name'], 'The product ' . $product['name'] . ' is below or equal to the threshold']);
                $notification = $stmt->fetch();

                if (!$notification) {
                    $stmt = $this->pdo->prepare("INSERT INTO notifications (user_id, type, title, message, url) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$product['user_id'], 'product', $product['name'], 'The product ' . $product['name'] . ' is below or equal to the threshold', '/products/' . $product['id']]);
                }
            }  
        }

        return ResponseHelper::jsonResponse($response, ["message" => "Threshold's checked"]);
    }
}
