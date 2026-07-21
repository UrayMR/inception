<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class CompetitionRegisteredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly string $team_name,
        public readonly string $competition_type,
        public readonly string $competition_name,
        public readonly string $leader_name,
        public readonly string $transaction_status,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pendaftaran Kompetisi {$this->competition_name} - INCEPTION 2026",
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
                'competition_type' => $this->competition_type,
                'leader_name' => $this->leader_name,
                'competition_name' => $this->competition_name,
                'status_label' => $this->statusLabel($this->transaction_status),
                'url' => $this->getUrl(),
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
     * Get the URL for the email button based on the transaction status.
     * @return string
     */
    private function getUrl(): string
    {
        if ($this->transaction_status === 'rejected') {
            return route('competitions.register');
        }

        return route('settings.index');
    }

    /**
     * Map the raw status value to a human-readable label shown in the email.
     */
    private function statusLabel(string $transaction_status): string
    {
        $cleanStatus = strtolower(trim($transaction_status));

        return match ($cleanStatus) {
            'pending'  => 'Menunggu Verifikasi Berkas',
            'verified' => 'Terverifikasi',
            'rejected' => 'Ditolak',
            default    => ucfirst($transaction_status),
        };
    }
}
