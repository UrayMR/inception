import { Form } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    LockKeyhole,
    RefreshCw,
    ShieldAlert,
    Copy,
    Check,
    Download,
    AlertTriangle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useClipboard } from '@/hooks/use-clipboard';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const formSubmitRef = useRef<HTMLButtonElement | null>(null);
    const [copiedText, copy] = useClipboard();
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    // Handler Copy All
    const handleCopyAll = () => {
        if (recoveryCodesList.length) {
            copy(recoveryCodesList.join('\n'));
        }
    };

    // Handler Download All TXT
    const handleDownloadTxt = () => {
        if (!recoveryCodesList.length) {
            return;
        }

        const fileContent = `INCEPTION 2026 - 2FA RECOVERY CODES\n-----------------------------------\nSetiap kode hanya dapat digunakan 1 kali.\nSimpan file ini di tempat yang aman!\n\n${recoveryCodesList.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n`;
        const blob = new Blob([fileContent], {
            type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inception-2fa-recovery-codes.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;
    const isAllCopied = copiedText === recoveryCodesList.join('\n');

    return (
        <>
            <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2.5 text-base font-medium text-zinc-100">
                                <LockKeyhole
                                    className="h-4 w-4 text-zinc-400"
                                    aria-hidden="true"
                                />
                                2FA Recovery Codes
                            </CardTitle>
                            <CardDescription className="text-xs text-zinc-400">
                                Kode pemulihan ini digunakan jika Anda
                                kehilangan akses ke perangkat 2FA. Simpan di
                                tempat yang aman dan rahasia.
                            </CardDescription>
                        </div>

                        <span className="hidden shrink-0 rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-zinc-400 uppercase sm:inline-block">
                            SECRET_VAULT
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* 🟢 Baris Tombol Atas: Hanya View/Hide & Regenerate */}
                    <div className="flex items-center justify-between select-none">
                        <Button
                            type="button"
                            onClick={toggleCodesVisibility}
                            aria-expanded={codesAreVisible}
                            aria-controls="recovery-codes-section"
                            className="h-9 cursor-pointer border border-zinc-800 bg-zinc-900/60 px-4 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                        >
                            <RecoveryCodeIconComponent
                                className="mr-2 h-4 w-4 text-zinc-400"
                                aria-hidden="true"
                            />
                            {codesAreVisible ? 'Hide' : 'View'} recovery codes
                        </Button>

                        {canRegenerateCodes && (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="h-9 cursor-pointer border border-rose-500/30 bg-rose-950/20 px-3.5 text-xs font-medium text-rose-300 transition-all hover:border-rose-500/60 hover:bg-rose-900/40 hover:text-rose-100"
                                >
                                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
                                    Regenerate codes
                                </Button>

                                <Form
                                    {...regenerateRecoveryCodes.form()}
                                    options={{ preserveScroll: true }}
                                    onSuccess={fetchRecoveryCodes}
                                    className="hidden"
                                >
                                    {({ processing }) => (
                                        <button
                                            ref={formSubmitRef}
                                            type="submit"
                                            disabled={processing}
                                        />
                                    )}
                                </Form>
                            </>
                        )}
                    </div>

                    {/* Area Konten Kode Tersembunyi */}
                    <div
                        id="recovery-codes-section"
                        className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                        aria-hidden={!codesAreVisible}
                    >
                        <div className="space-y-3 pt-2">
                            {errors?.length ? (
                                <AlertError errors={errors} />
                            ) : (
                                <>
                                    {/* Grid Kode */}
                                    <div
                                        ref={codesSectionRef}
                                        className="relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5"
                                        role="list"
                                        aria-label="Recovery codes"
                                    >
                                        {recoveryCodesList.length ? (
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {recoveryCodesList.map(
                                                    (code, index) => {
                                                        const isCopied =
                                                            copiedText === code;

                                                        return (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() =>
                                                                    copy(code)
                                                                }
                                                                title="Klik untuk menyalin"
                                                                className="group flex cursor-pointer items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/80 px-3.5 py-2.5 font-mono text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-white active:scale-98"
                                                            >
                                                                <span className="tracking-widest">
                                                                    {code}
                                                                </span>
                                                                <span className="ml-2 text-zinc-500 group-hover:text-zinc-300">
                                                                    {isCopied ? (
                                                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                                    ) : (
                                                                        <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                                                    )}
                                                                </span>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {Array.from(
                                                    { length: 8 },
                                                    (_, index) => (
                                                        <div
                                                            key={index}
                                                            className="h-9 animate-pulse rounded-lg border border-zinc-800/50 bg-zinc-900/40"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 🟢 Baris Tombol Aksi Bawah (Salin & Download All) */}
                                    <div className="flex items-center justify-end gap-2 pt-1 select-none">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCopyAll}
                                            className="h-9 cursor-pointer border border-zinc-800 bg-zinc-900/40 px-3.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                        >
                                            {isAllCopied ? (
                                                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                                            )}
                                            <span className="font-mono text-[11px]">
                                                {isAllCopied
                                                    ? 'Copied All'
                                                    : 'Copy All'}
                                            </span>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleDownloadTxt}
                                            className="h-9 cursor-pointer border border-zinc-800 bg-zinc-900/40 px-3.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                        >
                                            <Download className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                                            <span className="font-mono text-[11px]">
                                                Download All (.txt)
                                            </span>
                                        </Button>
                                    </div>

                                    {/* Warning Box */}
                                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 backdrop-blur-xs">
                                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                        <p
                                            id="regenerate-warning"
                                            className="text-xs leading-relaxed text-amber-200/80 select-none"
                                        >
                                            Setiap kode hanya bisa digunakan 1
                                            kali. Membuat kode baru akan
                                            membatalkan seluruh kode lama di
                                            atas.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AlertDialog Konfirmasi Regenerate */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="border-purple-900/40 bg-zinc-950 text-zinc-100 sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-base font-semibold text-rose-400">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                            Buat Ulang Kode Pemulihan?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs leading-relaxed text-zinc-400">
                            Tindakan ini akan membatalkan seluruh kode pemulihan
                            yang ada saat ini. Pastikan Anda segera menyimpan
                            set kode baru yang akan dihasilkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="cursor-pointer border-purple-900/50 bg-transparent text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsConfirmOpen(false);
                                formSubmitRef.current?.click();
                            }}
                            className="cursor-pointer bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
                        >
                            Ya, Buat Kode Baru
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
