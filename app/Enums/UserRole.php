<?php

namespace App\Enums;

enum UserRole: string
{
    case admin = 'admin';
    case accountant = 'accountant';
    case participant = 'participant';
}
