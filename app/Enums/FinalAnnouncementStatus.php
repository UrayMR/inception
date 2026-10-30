<?php

namespace App\Enums;

enum FinalAnnouncementStatus: string
{
  case ready = 'ready';
  case sent = 'sent';
  case failed = 'failed';
}
