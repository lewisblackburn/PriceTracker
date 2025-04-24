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
        $stmt     = $this->pdo->query("SELECT id, name, current_price, threshold, user_id FROM products");
        $products = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($products as $product) {
            // NOTE: Convert the different values to the correct type
            $currentPrice = (float) filter_var($product['current_price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $threshold    = (float) filter_var($product['threshold'],    FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

            // NOTE: If the current price is below or equal to the threshold, send a notification
            if ($currentPrice <= $threshold) {
                $message = sprintf(
                    'The product "%s" is below or equal to the threshold (%.2f)',
                    $product['name'],
                    $threshold
                );

                $check = $this->pdo->prepare(
                    "SELECT 1
                    FROM notifications
                    WHERE user_id  = :user_id
                        AND type     = :type
                        AND title    = :title
                        AND message  = :message
                        AND is_read  = 0
                    LIMIT 1"
                );
                $check->execute([
                    ':user_id' => $product['user_id'],
                    ':type'    => 'product',
                    ':title'   => $product['name'],
                    ':message' => $message,
                ]);

                // NOTE: If the notification doesn't exist, insert it
                if ($check->rowCount() === 0) {
                    $insert = $this->pdo->prepare(
                        "INSERT INTO notifications (user_id, type, title, message, url)
                            VALUES (:user_id, :type, :title, :message, :url)"
                    );
                    $insert->execute([
                        ':user_id' => $product['user_id'],
                        ':type'    => 'product',
                        ':title'   => $product['name'],
                        ':message' => $message,
                        ':url'     => '/products/' . $product['id'],
                    ]);
                }
            }
        }

        return ResponseHelper::jsonResponse($response, ['message' => "Thresholds checked"]);
    }
}
