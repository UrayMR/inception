<?php

namespace App\Enums;

enum TransactionMethod: string
{
  case qris = 'qris';
  case bank_transfer = 'bank_transfer';
}
