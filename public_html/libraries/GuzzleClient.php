<?php
class Guzzle6HttpClient implements Facebook\HttpClients\FacebookHttpClientInterface
{
    private $client;

    public function __construct(GuzzleHttp\Client $client)
    {
        $this->client = $client;
    }

    public function send($url, $method, $body, array $headers, $timeOut)
    {
        $request = new GuzzleHttp\Psr7\Request($method, $url, $headers, $body);
        $response = $this->client->send($request, ['timeout' => $timeOut]);
        
        $responseHeaders = $response->getHeaders();
        foreach ($responseHeaders as $key => $values) {
            $responseHeaders[$key] = implode(', ', $values);
        }
        
        $responseBody = $response->getBody()->getContents();
        $httpStatusCode = $response->getStatusCode();

        return new Facebook\Http\GraphRawResponse(
                        $responseHeaders,
                        $responseBody,
                        $httpStatusCode);
    }
}