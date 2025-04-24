<?php

namespace App\Utils;

use Slim\Psr7\Response;

class ResponseHelper
{
    /**
     * Helper function to create a JSON response.
     *
     * @param Response $response
     * @param array $data
     * @param int $status
     * @return Response
     */
    public static function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $payload = json_encode($data, JSON_THROW_ON_ERROR);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }
}
