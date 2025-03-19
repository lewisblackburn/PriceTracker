<?php

namespace App;

use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Controllers\PriceHistoryController;
use App\Middleware\AuthMiddleware;

return function ($app, $container) { 
    // Load controllers from the container
    $authController = $container->get(AuthController::class);
    $productController = $container->get(ProductController::class);
    $priceHistoryController = $container->get(PriceHistoryController::class);
    
    $secretKey = $container->get('secretKey');
    $authMiddleware = new AuthMiddleware($secretKey);


    $app->group('/api/auth', function ($group) use ($authController, $authMiddleware) {
        $group->post('/login', [$authController, 'login']);
        $group->post('/register', [$authController, 'register']);
        $group->get('/profile', [$authController, 'profile'])->add($authMiddleware);
    });

    $app->group('/api/products', function ($group) use ($productController, $authMiddleware) {
        $group->get('/get', [$productController, 'get']);
        $group->get('/getAll', [$productController, 'getAll']);
        
        $group->post('/create', [$productController, 'create'])->add($authMiddleware);
        $group->put('/update', [$productController, 'update'])->add($authMiddleware);
        $group->delete('/delete', [$productController, 'delete'])->add($authMiddleware);
    });

    $app->group('/api/price_history', function ($group) use ($priceHistoryController, $authMiddleware) {
        $group->get('/get', [$priceHistoryController, 'get']);
        $group->get('/getAll', [$priceHistoryController, 'getAll']);
        
        $group->post('/create', [$priceHistoryController, 'create'])->add($authMiddleware);
        $group->delete('/deleteLast', [$priceHistoryController, 'deleteLast'])->add($authMiddleware);
    });
};
