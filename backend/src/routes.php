<?php

namespace App;

use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Controllers\PriceHistoryController;
use App\Controllers\ScrapeController;
use App\Controllers\ThresholdController;
use App\Controllers\NotificationsController;
use App\Middleware\AuthMiddleware;

return function ($app, $container) { 
    // Load controllers from the container
    $authController = $container->get(AuthController::class);
    $productController = $container->get(ProductController::class);
    $priceHistoryController = $container->get(PriceHistoryController::class);
    $scrapeController = $container->get(ScrapeController::class);
    $thresholdController = $container->get(ThresholdController::class);
    $notificationsController = $container->get(NotificationsController::class);
    $secretKey = $container->get('secretKey');
    $authMiddleware = new AuthMiddleware($secretKey);

    $app->options('/{routes:.+}', function ($request, $response) {
        return $response;
    });


    $app->group('/api/auth', function ($group) use ($authController, $authMiddleware) {
        $group->post('/login', [$authController, 'login']);
        $group->post('/register', [$authController, 'register']);
        $group->get('/profile', [$authController, 'profile'])->add($authMiddleware);
    });

    $app->group('/api/products', function ($group) use ($productController, $authMiddleware) {
        $group->post('/get', [$productController, 'get'])->add($authMiddleware);
        $group->get('/getAll', [$productController, 'getAll'])->add($authMiddleware);
        $group->post('/setThreshold', [$productController, 'setThreshold'])->add($authMiddleware);
        $group->post('/create', [$productController, 'create'])->add($authMiddleware);
        $group->put('/update', [$productController, 'update'])->add($authMiddleware);
        $group->delete('/delete', [$productController, 'delete'])->add($authMiddleware);
    });

    $app->group('/api/price_history', function ($group) use ($priceHistoryController, $authMiddleware) {
        $group->get('/get', [$priceHistoryController, 'get'])->add($authMiddleware);
        $group->get('/getAll', [$priceHistoryController, 'getAll'])->add($authMiddleware);
        
        $group->post('/create', [$priceHistoryController, 'create'])->add($authMiddleware);
        $group->delete('/deleteLast', [$priceHistoryController, 'deleteLast'])->add($authMiddleware);
    });

    $app->group('/api/notifications', function ($group) use ($notificationsController, $authMiddleware) {
        $group->get('/getAll', [$notificationsController, 'getAll'])->add($authMiddleware);
        $group->post('/markAsRead', [$notificationsController, 'markAsRead'])->add($authMiddleware);
    });

    $app->post('/api/scrape', [$scrapeController, 'scrape']);
    $app->post('/api/threshold', [$thresholdController, 'threshold']);
};
