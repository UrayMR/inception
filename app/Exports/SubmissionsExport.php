<?php

namespace App\Exports;

use App\Models\AssignmentSubmission;
use App\Models\Competition;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SubmissionsExport implements FromCollection, WithMapping, WithHeadings, WithStyles
{
    use Exportable;

    protected int $rowNumber = 0;
    protected ?string $competitionId;
    protected ?Competition $competition = null;

    public function __construct(?string $competitionId = null)
    {
        $this->competitionId = $competitionId;

        if ($this->competitionId) {
            $this->competition = Competition::find($this->competitionId);
        }
    }

    public function collection(): Collection
    {
        $query = AssignmentSubmission::query()
            ->with(['assignment.competition', 'team'])
            ->latest();

        if ($this->competitionId) {
            $query->whereHas('assignment', function ($q) {
                $q->where('competition_id', $this->competitionId);
            });
        }

        return $query->get();
    }

    /**
     * @var AssignmentSubmission $submission
     */
    public function map($submission): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $submission->assignment?->competition?->name ?? '-',
            $submission->assignment?->name ?? '-',
            $submission->team?->team_name ?? '-',
            $submission->submission_link,
        ];
    }

    public function headings(): array
    {
        $competitionName = $this->competition ? $this->competition->name : 'Semua Kompetisi';
        $createdAt = now()->format('d-m-Y H:i:s');

        return [
            // Row 1: Judul Pengumpulan Tugas
            ["Pengumpulan Tugas {$competitionName}"],

            // Row 2: Waktu pembuatan file
            ["Sheets created at: {$createdAt}"],

            // Row 3: Baris kosong sebagai jarak pemisah (opsional, tapi bikin rapi)
            [],

            // Row 4: Header Kolom Tabel
            [
                'No',
                'Nama Kompetisi',
                'Judul Assignment',
                'Nama Tim',
                'Submission Link',
            ],
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Membuat Baris 1 (Judul Utama) menjadi Bold dan agak besar
            1 => ['font' => ['bold' => true, 'size' => 14]],

            // Membuat Baris 2 (Created at) menjadi Italic / miring
            2 => ['font' => ['italic' => true, 'size' => 10]],

            // Membuat Baris 4 (Header Kolom Tabel) menjadi Bold
            4 => ['font' => ['bold' => true]],
        ];
    }
}
