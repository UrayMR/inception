<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;

class GoogleSheetService
{
  protected Sheets $service;
  protected string $spreadsheetId;

  public function __construct()
  {
    $client = new Client();
    $client->setApplicationName('Inception Transaction Sync');
    $client->setScopes([Sheets::SPREADSHEETS]);

    $client->setAuthConfig(storage_path('app/private/inception-sheet-service-credential.json'));
    $client->setAccessType('offline');

    $this->service = new Sheets($client);

    $this->spreadsheetId = config('services.google_sheet.id');
  }

  public function appendData(string $range, array $values)
  {
    $body = new ValueRange();
    $body->setValues($values);

    $params = [
      'valueInputOption' => 'USER_ENTERED'
    ];

    return $this->service->spreadsheets_values->append(
      $this->spreadsheetId,
      $range,
      $body,
      $params
    );
  }
}
