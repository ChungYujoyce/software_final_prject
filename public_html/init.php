<?php
date_default_timezone_set('Asia/Taipei');
$route = new Router(Request::uri());
$client = new GuzzleHttp\Client;
$fb = new \Facebook\Facebook([
    'http_client_handler' => new Guzzle6HttpClient($client),
    'app_id' => Config::FB_APP_ID,
    'app_secret' => Config::FB_APP_SECRET,
    'default_graph_version' => 'v2.10',
    //'default_access_token' => '{access-token}', // optional
]);