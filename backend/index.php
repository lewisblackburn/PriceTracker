<?php
// NOTE: This means that I don't have to manually require all the files in the src dir
require __DIR__ . '/vendor/autoload.php';

// Load the app, container, and controllers 
$loaded = require __DIR__ . '/src/dependencies.php';
$app = $loaded['app'];
$container = $loaded['container'];

require __DIR__ . '/src/middleware.php';

$app->run();
