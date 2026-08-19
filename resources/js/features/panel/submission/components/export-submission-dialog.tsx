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

    const handleExportSubmit = () => {
        if (selectedCompetitions.length === 0) {
            return;
        }

        setIsDownloading(true);

        const params = new URLSearchParams({
            competitions: selectedCompetitions.join(','),
        });

        window.location.href = `${submissions.export.url()}?${params.toString()}`;

        const handleFocus = () => {
            setIsDownloading(false);
            setIsOpen(false);
            window.removeEventListener('focus', handleFocus);
        };

        window.addEventListener('focus', handleFocus);

        setTimeout(() => {
            setIsDownloading(false);
            setIsOpen(false);
            window.removeEventListener('focus', handleFocus);
        }, 5000);
    };

    const isAllSelected =
        availableCompetitions.length > 0 &&
        selectedCompetitions.length === availableCompetitions.length;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
