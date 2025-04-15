<?php

namespace App\Utils;

use GuzzleHttp\Client;

class Scraper
{
    /**
    * Scrape the product price from the given URL.
    *
    * @param string $url
    * @return array{price: float}
    */
    public static function scrapeProduct(string $url): array
    {
        $client = new Client();
        $res = $client->request('POST', 'http://localhost:4000/scrape', [
            'json' => [
                'url' => $url
            ]
        ]);

        $data = json_decode($res->getBody(), true);

        return [
            'name' => $data['name'],
            'price' => $data['price']
        ];
    }
}
