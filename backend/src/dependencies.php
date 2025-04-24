<?php

namespace App;

use DI\Container;
use PDO;
use Slim\Factory\AppFactory;
use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Controllers\PriceHistoryController;
use App\Controllers\ThresholdController;
use App\Controllers\ScrapeController;
use App\Controllers\NotificationsController;
$container = new Container();

$container->set('db', function () {
    $host     = $_ENV['DB_HOST'];
    $name     = $_ENV['DB_NAME'];
    $user     = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASSWORD'];

    return new PDO(
        "mysql:host={$host};dbname={$name};charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
});

$container->set('secretKey', function () {
    return $_ENV['APP_SECRET'];
});


$container->set(AuthController::class, function ($container) {
    return new AuthController(
        $container->get('db'), 
        $container->get('secretKey')
    );
});

$container->set(ProductController::class, function ($container) {
    return new ProductController(
        $container->get('db')
    );
});

$container->set(PriceHistoryController::class, function ($container) {
    return new PriceHistoryController(
        $container->get('db')
    );
});

$container->set(ScrapeController::class, function ($container) {
    return new ScrapeController(
        $container->get('db')
    );
});

$container->set(ThresholdController::class, function ($container) {
    return new ThresholdController(
        $container->get('db')
    );
});

$container->set(NotificationsController::class, function ($container) {
    return new NotificationsController(
        $container->get('db')
    );
});

$app = AppFactory::createFromContainer($container);

return ['app' => $app, 'container' => $container];
