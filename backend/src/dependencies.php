<?php

namespace App;

use DI\Container;
use PDO;
use Slim\Factory\AppFactory;
use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Controllers\PriceHistoryController;
use App\Controllers\ScrapeController;

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

$app = AppFactory::createFromContainer($container);

return ['app' => $app, 'container' => $container];
