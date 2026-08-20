import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import submissions from '@/routes/panel/submissions';
import type { Option } from '@/types';

interface ExportSubmissionDialogProps {
    competitions: Option[];
}

export function ExportSubmissionDialog({
    competitions,
}: ExportSubmissionDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
        [],
    );
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const availableCompetitions = competitions.filter(
        (c) => c.otherValues?.hasSubmissions,
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCompetitions(availableCompetitions.map((c) => c.value));
        } else {
            setSelectedCompetitions([]);
        }
    };

    const handleCheckboxChange = (value: string, checked: boolean) => {
        if (checked) {
            setSelectedCompetitions((prev) => [...prev, value]);
        } else {
            setSelectedCompetitions((prev) =>
                prev ? prev.filter((item) => item !== value) : [],
            );
        }
    };

    const extractFilename = (
        contentDisposition: string | null,
        fallback: string,
    ) => {
        if (!contentDisposition) {
            return fallback;
        }

        const utf8Match = contentDisposition.match(
            /filename\*=UTF-8''([^;]+)/i,
        );

        if (utf8Match?.[1]) {
            return decodeURIComponent(utf8Match[1]);
        }

        const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

        if (plainMatch?.[1]) {
            return plainMatch[1];
        }

        return fallback;
    };

    const handleExportSubmit = async () => {
        if (selectedCompetitions.length === 0 || isDownloading) {
            return;
        }

        setError(null);
        setIsDownloading(true);

        try {
            const params = new URLSearchParams({
                competitions: selectedCompetitions.join(','),
            });
            const url = `${submissions.export.url()}?${params.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`Export gagal (status ${response.status})`);
            }

            const blob = await response.blob();

            const filename = extractFilename(
                response.headers.get('Content-Disposition'),
                'submissions-export.xlsx',
            );

            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(objectUrl);

            setSelectedCompetitions([]);
            setIsOpen(false);
        } catch (err) {
            console.error('Gagal export submission:', err);
            setError('Gagal mengunduh data export. Silakan coba lagi.');
        } finally {
            setIsDownloading(false);
        }
    };

    const isAllSelected =
        availableCompetitions.length > 0 &&
        selectedCompetitions.length === availableCompetitions.length;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (isDownloading) {
                    return;
                }

                setIsOpen(open);

                if (!open) {
                    setError(null);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Data Submission</DialogTitle>
                    <DialogDescription>
                        Pilih kompetisi yang Anda ingin export data
                        pengumpulannya.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2 border-b pb-3">
                        <Checkbox
                            id="select-all-competitions"
                            checked={isAllSelected}
                            disabled={availableCompetitions.length === 0}
                            onCheckedChange={(checked) =>
                                handleSelectAll(checked === true)
                            }
                        />
                        <label
                            htmlFor="select-all-competitions"
                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Pilih Semua Kompetisi
                        </label>
                    </div>

                    <div className="grid max-h-60 gap-3 overflow-y-auto">
                        {competitions.map((comp) => (
                            <div
                                key={comp.value}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`comp-${comp.value}`}
                                    checked={selectedCompetitions.includes(
                                        comp.value,
                                    )}
                                    disabled={!comp.otherValues?.hasSubmissions}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(
                                            comp.value,
                                            checked === true,
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`comp-${comp.value}`}
                                    className={`text-sm leading-none font-normal ${
                                        comp.otherValues?.hasSubmissions
                                            ? 'cursor-pointer'
                                            : 'cursor-not-allowed'
                                    }`}
                                >
                                    {comp.label}
                                    {!comp.otherValues?.hasSubmissions && (
                                        <span className="text-xs text-muted-foreground">
                                            (Tidak ada data)
                                        </span>
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDownloading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleExportSubmit}
                        disabled={
                            selectedCompetitions.length === 0 || isDownloading
                        }
                    >
                        {isDownloading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
