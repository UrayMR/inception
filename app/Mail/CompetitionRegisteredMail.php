<?php

namespace App\Mail;

use App\Models\Team;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class CompetitionRegisteredMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly string $team_name,
        public readonly string $competition_name,
        public readonly string $leader_name,
        public readonly string $status,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pendaftaran Tim {$this->team_name} Berhasil - {$this->competition_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.competition-registered',
            with: [
                'team_name' => $this->team_name,
                'leader_name' => $this->leader_name,
                'competition_name' => $this->competition_name,
                'status' => $this->statusLabel($this->status),
                'dashboard_url' => config('app.url') . '/settings',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Map the raw status value to a human-readable label shown in the email.
     */
    private function statusLabel(string $status): string
    {
        return match ($status) {
            'pending', 'waiting_verification' => 'Menunggu Verifikasi Berkas',
            'verified', 'approved' => 'Terverifikasi',
            'rejected' => 'Ditolak',
            default => ucfirst(str_replace('_', ' ', $status)),
        };
    }
}
