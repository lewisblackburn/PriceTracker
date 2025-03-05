<?php

use Slim\Psr7\Request;
use Slim\Psr7\Response;

global $app;

$app->post('/api/scrape', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(["message" => "Products updated"]));
    return $response->withHeader('Content-Type', 'application/json');
});
