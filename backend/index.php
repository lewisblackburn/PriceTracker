<?php
require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

// Initialise 
require __DIR__ . '/db.php';
require __DIR__ . '/dependencies.php';
require __DIR__ . '/middleware.php';

// Routes
require __DIR__ . '/routes/auth.php';
require __DIR__ . '/routes/products.php';
require __DIR__ . '/routes/scrape.php';

$app->run();
