<?php

namespace App\Exports;

use App\Models\AssignmentSubmission;
use App\Models\Competition;
use Illuminate\Support\Collection; // <--- Pastikan di-import
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection; // <--- Tambahkan interface ini
use Maatwebsite\Excel\Concerns\WithExportTemplate;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class SubmissionsExport implements FromCollection, WithExportTemplate, WithEvents // <--- Daftarkan FromCollection di sini
{
    use Exportable;

    protected ?string $competitionId;
    protected ?Competition $competition = null;

    public function __construct(?string $competitionId = null)
    {
        $this->competitionId = $competitionId;

        if ($this->competitionId) {
            $this->competition = Competition::find($this->competitionId);
        }
    }

    public function exportTemplate(): string
    {
        return storage_path('app/templates/template-export-submission.xlsx');
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

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // 1. Ambil data submission dari database (memanfaatkan collection() yang sudah ada)
                $submissions = $this->collection();

                $competitionName = $this->competition ? $this->competition->name : 'Semua Kompetisi';
                $createdAt = now()->format('d F Y, H:i') . ' WIB';

                // 2. Isi info header template
                $sheet->setCellValue('C4', $competitionName);
                $sheet->setCellValue('C5', $createdAt);

                $criteria = $this->getCriteriaByCompetition($competitionName);
                $startColumnIndex = 4; // Kolom D (index 4)

                // 3. Render Header Kriteria Penilaian Menyamping di Baris 7
                if (count($criteria) > 0) {
                    foreach ($criteria as $index => $criterion) {
                        $colLetter = Coordinate::stringFromColumnIndex($startColumnIndex + $index);
                        $cellCoord = $colLetter . '7';

                        $sheet->setCellValue($cellCoord, $criterion);

                        $sheet->getColumnDimension($colLetter)->setWidth(40);
                        $sheet->getStyle($cellCoord)->getAlignment()->setWrapText(true);
                        $sheet->getStyle($cellCoord)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
                        $sheet->getStyle($cellCoord)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    }

                    // Format Painter Header dari D7 ke kolom kriteria sebelah kanannya
                    if (count($criteria) > 1) {
                        $sourceStyle = $sheet->getStyle('D7');
                        $lastColumnLetter = Coordinate::stringFromColumnIndex($startColumnIndex + count($criteria) - 1);
                        $sheet->duplicateStyle($sourceStyle, "E7:{$lastColumnLetter}7");
                    }
                }

                // 4. PRINT DATA TIM KE SHEET SECARA MANUAL (Mulai Baris 8)
                $startRow = 8;
                foreach ($submissions as $index => $submission) {
                    $currentRow = $startRow + $index;

                    // Tulis No, Nama Tim, dan Link Drive
                    $sheet->setCellValue('A' . $currentRow, $index + 1);

                    $sheet->setCellValue('B' . $currentRow, $submission->team?->team_name ?? '-');
                    $sheet->getStyle('B' . $currentRow)->getAlignment()->setWrapText(true);
                    $sheet->getColumnDimension('B')->setWidth(32);

                    $sheet->setCellValue('C' . $currentRow, $submission->submission_link);
                    $sheet->getStyle('C' . $currentRow)->getAlignment()->setWrapText(true);
                    $sheet->getColumnDimension('C')->setWidth(78);

                    // Alignment Kolom A (No) rata tengah
                    $sheet->getStyle('A' . $currentRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                    // Set Row Height untuk baris saat ini 
                    $sheet->getRowDimension($currentRow)->setRowHeight(22);

                    // Tentukan baris referensi template untuk zebra striping (Genap ikuti 8, Ganjil ikuti 9)
                    $templateRow = ($currentRow % 2 === 0) ? 8 : 9;

                    // Duplikasi style untuk kolom A, B, C dari baris template yang bersesuaian
                    foreach (['A', 'B', 'C'] as $col) {
                        $sourceCell = $col . $templateRow;
                        $targetCell = $col . $currentRow;
                        if ($sheet->cellExists($sourceCell)) {
                            $sheet->duplicateStyle($sheet->getStyle($sourceCell), $targetCell);
                        }
                    }

                    // 5. Render Dropdown Skala (1-5) dan Format Painter Style per Baris
                    for ($i = 0; $i < max(1, count($criteria)); $i++) {
                        $colLetter = Coordinate::stringFromColumnIndex($startColumnIndex + $i);
                        $cellCoord = $colLetter . $currentRow;

                        // Pasang dropdown validasi 1-5
                        $validation = $sheet->getCell($cellCoord)->getDataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowDropDown(true);
                        $validation->setFormula1('"1,2,3,4,5"');

                        // Rata tengah nilai dropdown
                        $sheet->getStyle($cellCoord)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                        // Format Painter dinamis berdasarkan pola baris genap/ganjil template (D8 atau D9)
                        $sourceCell = 'D' . $templateRow;
                        if ($sheet->cellExists($sourceCell)) {
                            $sheet->duplicateStyle($sheet->getStyle($sourceCell), $cellCoord);
                        }
                    }
                }
            },
        ];
    }

    private function getCriteriaByCompetition(string $competitionName): array
    {
        $name = strtolower($competitionName);

        if (str_contains($name, 'ui/ux') || str_contains($name, 'uiux')) {
            return [
                'Identifikasi Masalah & Inovasi (25%)',
                'User Interface (UI) (25%)',
                'User Experience (UX) (30%)',
                'Metode Desain (20%)',
                'Kelengkapan Proposal Sesuai Format',
            ];
        } elseif (str_contains($name, 'data science') || str_contains($name, 'datascience')) {
            return [
                'Data Pipeline & Baseline Model (15%)',
                'Time Series Rigor & Hyperparameter Tuning (20%)',
                'Pemodelan & Hyperparameter Tuning (15%)',
                'Structure & Visual (15%)',
                'EDA & Logic (20%)',
                'XAI Interpretation (15%)',
            ];
        } elseif (str_contains($name, 'business plan') || str_contains($name, 'businessplan')) {
            return [
                // A. BMC (25%)
                'Inovasi Model Bisnis',
                'Keterpaduan Elemen BMC',
                'Kelayakan Implementasi',
                'Potensi Pengembangan',
                'Kesesuaian SDGs',
                'Kualitas Penyusunan (BMC)',

                // B. VPC (20%)
                'Customer Profile',
                'Value Map',
                'Problem-Solution Fit',
                'Unique Value Proposition',
                'Kualitas Penyusunan (VPC)',

                // C. Proposal (55%)
                'Latar Belakang',
                'Solusi dan Inovasi',
                'Analisis Pasar',
                'Rencana Operasional',
                'Analisis Keuangan',
                'Manajemen Risiko',
                'Pemanfaatan Teknologi',
                'Dampak SDGs',
                'Sistematika Penulisan',
            ];
        } elseif (str_contains($name, 'hackathon')) {
            return [
                'Technical Implementation (25%)',
                'Functionality & Working Product (25%)',
                'Problem-Solution Fit (15%)',
                'Innovation (15%)',
                'UX / Usability (10%)',
                'AI / Technology Utilization (10%)',
            ];
        }

        return ['Nilai'];
    }
}
