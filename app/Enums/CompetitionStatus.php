<?php

namespace App\Enums;

enum CompetitionStatus: string
{
  case closed = 'closed';
  case open = 'open';
  case ongoing = 'ongoing';
  case completed = 'completed';
}
