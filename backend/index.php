<?php
// NOTE: This means that I don't have to manually require all the files in the src dir
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Load the app, container, and controllers 
$loaded = require __DIR__ . '/src/dependencies.php';
$app = $loaded['app'];
$container = $loaded['container'];

$middleware = require __DIR__ . '/src/middleware.php';
$middleware($app);

$routes = require __DIR__ . '/src/routes.php';
$routes($app, $container);  

$app->run();
