<?php

namespace App\Utils;

use GuzzleHttp\Client;

class Scraper
{
    /**
    * Scrape the product price from the given URL.
    *
    * @param string $url
    * @return array{name: string, price: float}
    */
    public static function scrapeProduct(string $url): array
    {
        $scraperEndpoint = getenv('SCRAPER_API_URL');

        $client = new Client();
        $res = $client->request('POST', $scraperEndpoint, [
            'json' => ['url' => $url]
        ]);

        $data = json_decode($res->getBody(), true);

        return [
            'name'  => $data['name'],
            'price' => $data['price']
        ];
    }
}
