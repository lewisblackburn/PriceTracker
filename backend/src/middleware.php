<?php

namespace App;

return function ($app) {
    $app->addBodyParsingMiddleware();
    $app->addRoutingMiddleware();

    $app->add(function ($request, $handler) {
        $response = $handler->handle($request);

        if ($request->getMethod() === 'OPTIONS') {
            return $response
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->withStatus(200);
        }

        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    });

    $app->addErrorMiddleware(true, true, true);
};
