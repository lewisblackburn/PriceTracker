<?php
use DI\Container;
use Slim\Factory\AppFactory;

$container = new Container();

$container->set('db', function () {
    return new PDO(
        "mysql:host=localhost;dbname=price_tracker", 
        "tracker_user", 
        "tracker_user_password", 
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
});

$container->set('secretKey', function () {
    return "vQkOkReCcVruFfa1VHrMl2HHtcjIECF5JCmvteeqYqo=";
});

$container->set(\App\Controllers\AuthController::class, function ($container) {
    return new \App\Controllers\AuthController(
        $container->get('db'), 
        $container->get('secretKey')
    );
});

$container->set(\App\Controllers\ProductController::class, function ($container) {
    return new \App\Controllers\ProductController(
        $container->get('db'), 
    );
});

$app = AppFactory::createFromContainer($container);

// Routes
$authController = $container->get(\App\Controllers\AuthController::class);
$app->post('/api/auth/login', [$authController, 'login']);
$app->post('/api/auth/register', [$authController, 'register']);

$productController = $container->get(\App\Controllers\ProductController::class);
$app->get('/api/products/getAll', [$productController, 'getAll']);
$app->post('/api/products/create', [$productController, 'create']);

return ['app' => $app, 'container' => $container];
