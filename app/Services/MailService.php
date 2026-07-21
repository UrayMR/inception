<?php

namespace App\Services;

use App\Mail\CompetitionRegisteredMail;
use Illuminate\Support\Facades\Mail;

class MailService
{
  /**
   * Send a competition registered mail to the specified email address.
   *
   * @param CompetitionRegisteredMail $mail The mail instance to be sent.
   * @param string $to The recipient's email address.
   */
  public function send(CompetitionRegisteredMail $mail, string $to): void
  {
    defer(function () use ($mail, $to) {
      Mail::to($to)->send($mail);
    });
  }
}
