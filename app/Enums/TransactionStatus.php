<?php

namespace App\Enums;

enum TransactionStatus: string
{
  case pending = 'pending';
  case verified = 'verified';
  case rejected = 'rejected';
}
