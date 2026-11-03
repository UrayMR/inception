<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class TeamExport implements Export, WithMultipleSheets
{
  public function sheets(): array
  {
    return [
      new Sheets\TeamSheet(),
      new Sheets\TeamMemberSheet(),
      new Sheets\TeamTransactionSheet(),
      new Sheets\TeamSubmissionSheet(),
    ];
  }
}
