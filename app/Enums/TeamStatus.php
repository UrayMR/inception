<?php

namespace App\Enums;

enum TeamStatus: string
{
  case active = 'active';
  case rejected = 'rejected';
  case registered = 'registered';
}
