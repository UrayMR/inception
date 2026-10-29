<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BulkAnnouncementMail extends Mailable implements ShouldQueue
{
  use Queueable, SerializesModels;

  public function __construct(
    public readonly string $competitionName,
    public readonly string $teamName,
    public readonly bool $isBlacklisted,
  ) {}

  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'Pengumuman Hacking Day INCEPTION 2026',
    );
  }

  public function content(): Content
  {
    return new Content(
      view: 'emails.bulk-announcement',
    );
  }

  /**
   * @return array<int, Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
