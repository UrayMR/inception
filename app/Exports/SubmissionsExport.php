<?php

namespace App\Exports;

use App\Models\AssignmentSubmission;
use App\Models\Competition;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithExportTemplate;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class SubmissionsExport implements FromCollection, WithExportTemplate, WithEvents
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
        $config = $this->getTemplateConfig($this->getCompetitionName());

        return storage_path('app/templates/' . $config['template_file']);
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

    protected function getCompetitionName(): string
    {
        return $this->competition ? $this->competition->name : '';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $submissions = $this->collection();
                $competitionName = $this->competition ? $this->competition->name : 'Semua Kompetisi';
                $createdAt = now()->format('d F Y, H:i') . ' WIB';

                $sheet->setCellValue('C4', $competitionName);
                $sheet->setCellValue('C5', $createdAt);

                $config = $this->getTemplateConfig($competitionName);

                $dataStartRow = $config['data_start_row'];
                $formulaStartIdx = Coordinate::columnIndexFromString($config['formula_start_col']);
                $formulaEndIdx = Coordinate::columnIndexFromString($config['formula_end_col']);
                $dropdownColumns = $config['dropdown_columns'];

                foreach ($submissions as $index => $submission) {
                    $currentRow = $dataStartRow + $index;

                    $formulaSourceRow = $dataStartRow;

                    $styleRow = ($index % 2 === 0) ? $dataStartRow : $dataStartRow + 1;

                    $sheet->setCellValue('A' . $currentRow, $index + 1);
                    $sheet->getStyle('A' . $currentRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                    $sheet->setCellValue('B' . $currentRow, $submission->team?->team_name ?? '-');
                    $sheet->getStyle('B' . $currentRow)->getAlignment()->setWrapText(true);

                    $sheet->setCellValue('C' . $currentRow, $submission->submission_link);
                    $sheet->getStyle('C' . $currentRow)->getAlignment()->setWrapText(true);

                    $sheet->getRowDimension($currentRow)->setRowHeight(22);

                    if ($currentRow !== $styleRow) {
                        foreach (['A', 'B', 'C'] as $col) {
                            $sourceCell = $col . $styleRow;
                            if ($sheet->cellExists($sourceCell)) {
                                $sheet->duplicateStyle($sheet->getStyle($sourceCell), $col . $currentRow);
                            }
                        }
                    }

                    // Auto-fill formulas and styles for configured columns
                    for ($colIdx = $formulaStartIdx; $colIdx <= $formulaEndIdx; $colIdx++) {
                        $colLetter = Coordinate::stringFromColumnIndex($colIdx);
                        $formulaSourceCoord = $colLetter . $formulaSourceRow;
                        $styleSourceCoord = $colLetter . $styleRow;
                        $targetCoord = $colLetter . $currentRow;

                        if ($sheet->cellExists($formulaSourceCoord)) {
                            $value = $sheet->getCell($formulaSourceCoord)->getValue();

                            if ($value !== null) {
                                if (is_string($value) && str_starts_with($value, '=')) {
                                    // Shift formula references to the current row
                                    $shifted = $this->shiftFormulaRows($value, $currentRow - $formulaSourceRow);
                                    $sheet->setCellValue($targetCoord, $shifted);
                                } else {
                                    // Copy constant value
                                    $sheet->setCellValue($targetCoord, $value);
                                }
                            }
                        }

                        if ($currentRow !== $styleRow && $sheet->cellExists($styleSourceCoord)) {
                            $sheet->duplicateStyle($sheet->getStyle($styleSourceCoord), $targetCoord);
                        }

                        $sheet->getStyle($targetCoord)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    }

                    // Set dropdown validation for configured columns
                    foreach ($dropdownColumns as $col => $listFormula) {
                        $validation = $sheet->getCell($col . $currentRow)->getDataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowDropDown(true);
                        $validation->setFormula1('"' . $listFormula . '"');
                    }
                }
            },
        ];
    }

    /**
     *  Shift formula references in a string by a given row offset.
     *  Absolute references are not shifted.
     *  Relative references are shifted by the given offset.
     */
    private function shiftFormulaRows(string $formula, int $offset): string
    {
        if ($offset === 0) {
            return $formula;
        }

        return preg_replace_callback(
            '/(\$?)([A-Z]{1,3})(\$?)(\d+)/',
            function ($m) use ($offset) {
                [$full, $colAbs, $col, $rowAbs, $row] = $m;

                if ($rowAbs === '$') {
                    return $full;
                }

                return $colAbs . $col . $rowAbs . ((int) $row + $offset);
            },
            $formula
        );
    }

    private function getTemplateConfig(string $competitionName): array
    {
        $name = strtolower($competitionName);
        $mainScale = '1,2,3,4,5';
        $subScale = '0,1,2,3,4,5,6,7,8';

        if (str_contains($name, 'ui/ux') || str_contains($name, 'uiux')) {
            return [
                'template_file' => 'template-export-uiux.xlsx',
                'data_start_row' => 9,
                'formula_start_col' => 'D',
                'formula_end_col' => 'R',
                'dropdown_columns' => [
                    'E' => $mainScale,
                    'H' => $mainScale,
                    'K' => $mainScale,
                    'N' => $mainScale,
                    'Q' => $subScale, // Jumlah Kurangnya Sub Bab
                ],
            ];
        }

        if (str_contains($name, 'data science') || str_contains($name, 'datascience')) {
            return [
                'template_file' => 'template-export-datascience.xlsx',
                'data_start_row' => 9,
                'formula_start_col' => 'D',
                'formula_end_col' => 'V',
                'dropdown_columns' => [
                    'E' => $mainScale,
                    'H' => $mainScale,
                    'K' => $mainScale,
                    'N' => $mainScale,
                    'Q' => $mainScale,
                    'T' => $mainScale,
                ],
            ];
        }

        if (str_contains($name, 'business plan') || str_contains($name, 'businessplan')) {
            return [
                'template_file' => 'template-export-businessplan.xlsx',
                'data_start_row' => 10,
                'formula_start_col' => 'D',
                'formula_end_col' => 'BO',
                'dropdown_columns' => [
                    'E' => $mainScale,
                    'H' => $mainScale,
                    'K' => $mainScale,
                    'N' => $mainScale,
                    'Q' => $mainScale,
                    'T' => $mainScale,
                    'X' => $mainScale,
                    'AA' => $mainScale,
                    'AD' => $mainScale,
                    'AG' => $mainScale,
                    'AJ' => $mainScale,
                    'AN' => $mainScale,
                    'AQ' => $mainScale,
                    'AT' => $mainScale,
                    'AW' => $mainScale,
                    'AZ' => $mainScale,
                    'BC' => $mainScale,
                    'BF' => $mainScale,
                    'BI' => $mainScale,
                    'BL' => $mainScale,
                ],
            ];
        }

        // Default: hackathon
        return [
            'template_file' => 'template-export-hackathon.xlsx',
            'data_start_row' => 9,
            'formula_start_col' => 'D',
            'formula_end_col' => 'V',
            'dropdown_columns' => [
                'E' => $mainScale,
                'H' => $mainScale,
                'K' => $mainScale,
                'N' => $mainScale,
                'Q' => $mainScale,
                'T' => $mainScale,
            ],
        ];
    }
}
