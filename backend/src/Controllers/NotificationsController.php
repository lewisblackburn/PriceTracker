<?php

namespace App\Controllers;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Utils\ResponseHelper;
use PDO;

class NotificationsController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAll(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $userId = $user->id ?? null;

        if (!$userId) {
            return ResponseHelper::jsonResponse($response, ["error" => "Unauthorized"], 401);
        }

        // NOTE: Get unread notifications ordered by newest first
        $stmt = $this->pdo->prepare("SELECT id, type, title, message, url, is_read, created_at FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll();

        return ResponseHelper::jsonResponse($response, $notifications);
    }

    public function markAsRead(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $userId = $user->id ?? null;
        if (!$userId) {
            return ResponseHelper::jsonResponse($response, ["error" => "Unauthorized"], 401);
        }

        $data = $request->getParsedBody();
        $notificationId = $data['notification_id'] ?? null;
        echo $notificationId;
        if (!$notificationId) {
            return ResponseHelper::jsonResponse($response, ["error" => "Notification ID required"], 400);
        }

        $stmt = $this->pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$notificationId, $userId]);

        return ResponseHelper::jsonResponse($response, ["message" => "Notification marked as read"]);
    }
}
