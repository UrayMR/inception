import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <div className="w-full space-y-5">
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    {/* QR Code Container */}
                    <div className="mx-auto flex max-w-md justify-center">
                        <div className="relative aspect-square w-60 rounded-2xl border border-purple-500/30 bg-[#0d071a]/90 p-4 shadow-[0_0_30px_rgba(177,59,255,0.15)] backdrop-blur-md">
                            <div className="flex h-full w-full items-center justify-center">
                                {qrCodeSvg ? (
                                    <div
                                        className="aspect-square w-full rounded-xl bg-white p-2 shadow-inner [&_svg]:size-full"
                                        dangerouslySetInnerHTML={{
                                            __html: qrCodeSvg,
                                        }}
                                        style={{
                                            filter:
                                                resolvedAppearance === 'light'
                                                    ? 'invert(1) brightness(1.2)'
                                                    : undefined,
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-purple-400">
                                        <Spinner className="h-6 w-6" />
                                        <span className="font-mono text-xs text-purple-300/70">
                                            Memuat QR Code...
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={onNextStep}
                        className="group relative h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-97"
                        style={{
                            background:
                                'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                            color: '#F3E8FF',
                            boxShadow: '0 0 25px rgba(177,59,255,0.35)',
                        }}
                    >
                        <span className="relative z-10">{buttonText}</span>
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Button>

                    {/* Divider */}
                    <div className="relative my-4 flex w-full items-center justify-center">
                        <div className="absolute inset-0 top-1/2 h-px w-full bg-purple-900/40" />
                        <span className="relative bg-[#0f051d] px-3 font-mono text-[11px] tracking-wider text-purple-300/60 uppercase">
                            atau masukkan kode manual
                        </span>
                    </div>

                    {/* Manual Setup Key Input & Copy */}
                    <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-purple-900/50 bg-[#0d071a]/80 shadow-inner">
                        {!manualSetupKey ? (
                            <div className="flex h-11 w-full items-center justify-center p-3 text-purple-400">
                                <Spinner className="h-4 w-4" />
                            </div>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    readOnly
                                    value={manualSetupKey}
                                    className="h-11 w-full bg-transparent px-4 font-mono text-xs tracking-wider text-purple-200 outline-none selection:bg-purple-500 selection:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => copy(manualSetupKey)}
                                    className="flex cursor-pointer items-center gap-1.5 border-l border-purple-900/50 px-4 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-900/30 hover:text-white"
                                >
                                    <IconComponent className="h-4 w-4" />
                                    <span className="font-mono text-[10px] uppercase">
                                        {copiedText === manualSetupKey
                                            ? 'Tersalin'
                                            : 'Salin'}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
            className="w-full space-y-6"
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <div className="w-full space-y-6">
                    <div
                        ref={pinInputContainerRef}
                        className="flex flex-col items-center space-y-3"
                    >
                        <InputOTP
                            id="otp"
                            name="code"
                            maxLength={OTP_MAX_LENGTH}
                            onChange={setCode}
                            disabled={processing}
                            pattern={REGEXP_ONLY_DIGITS}
                            autoFocus
                        >
                            <InputOTPGroup className="gap-2">
                                {Array.from(
                                    { length: OTP_MAX_LENGTH },
                                    (_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="h-12 w-11 rounded-xl border border-purple-900/60 bg-[#0d071a]/90 font-mono text-lg font-bold text-white shadow-inner transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50"
                                        />
                                    ),
                                )}
                            </InputOTPGroup>
                        </InputOTP>
                        <InputError
                            message={
                                errors?.confirmTwoFactorAuthentication?.code
                            }
                            className="mt-1 text-xs text-rose-400"
                        />
                    </div>

                    <div className="flex w-full gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            disabled={processing}
                            className="h-11 flex-1 cursor-pointer rounded-xl border border-purple-900/50 bg-purple-950/20 text-xs font-semibold text-purple-300 backdrop-blur-xs transition-all hover:border-purple-500/50 hover:bg-purple-900/30 hover:text-white"
                        >
                            Kembali
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing || code.length < OTP_MAX_LENGTH
                            }
                            className="group relative h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 disabled:opacity-50"
                            style={{
                                background:
                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                color: '#F3E8FF',
                                boxShadow: '0 0 20px rgba(177,59,255,0.35)',
                            }}
                        >
                            {processing ? (
                                <Spinner className="h-4 w-4" />
                            ) : (
                                'Konfirmasi'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo<{
        title: string;
        description: string;
        buttonText: string;
    }>(() => {
        if (twoFactorEnabled) {
            return {
                title: 'AUTENTIKASI 2-FA AKTIF',
                description:
                    'Autentikasi dua faktor berhasil diaktifkan. Pindai QR code atau masukkan kunci penyiapan di aplikasi autentikator Anda.',
                buttonText: 'Tutup',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'VERIFIKASI KODE 2-FA',
                description:
                    'Masukkan 6 digit kode keamanan dari aplikasi autentikator Anda.',
                buttonText: 'Lanjutkan',
            };
        }

        return {
            title: 'AKTIFKAN 2-FACTOR AUTH',
            description:
                'Pindai QR code atau masukkan kunci penyiapan di aplikasi autentikator Anda untuk melanjutkan.',
            buttonText: 'Lanjutkan',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);
        clearSetupData();
    }, [clearSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);

            return;
        }

        handleClose();
    }, [requiresConfirmation, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="rounded-3xl border-purple-500/20 bg-[#0f051d]/95 p-6 text-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:max-w-lg sm:p-8">
                <DialogHeader className="flex flex-col items-center justify-center text-center">
                    {/* Subtitle Monospace Accent */}
                    <p className="mb-1 font-mono text-[10px] font-bold tracking-[3px] text-purple-400 uppercase">
                        // SECURITY_AUTHENTICATION_ZONE
                    </p>

                    {/* Modal Title */}
                    <DialogTitle className="font-sans text-xl font-extrabold tracking-wider text-white uppercase sm:text-2xl">
                        {modalConfig.title}
                    </DialogTitle>

                    {/* Amber Accent Line */}
                    <div className="my-3 h-1 w-12 rounded-full bg-amber-400" />

                    {/* Description */}
                    <DialogDescription className="max-w-sm text-center text-xs leading-relaxed text-purple-100/70">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex flex-col items-center">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={handleClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
