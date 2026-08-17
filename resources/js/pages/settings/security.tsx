import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingLayout from '@/layouts/setting-layout';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
    hasPassword?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
    hasPassword = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                {/* Update password */}
                <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                    <div className="mb-6 flex items-center gap-3 border-b border-purple-950/60 pb-3">
                        <KeyRound className="h-4 w-4 text-purple-400" />
                        <div>
                            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                                {hasPassword
                                    ? 'Update password'
                                    : 'Set password'}
                            </h2>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                {hasPassword
                                    ? 'Ensure your account is using a long, random password to stay secure.'
                                    : 'Set a password for your account so you can log in using email and password.'}
                            </p>
                        </div>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                {hasPassword && (
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="current_password"
                                            className="text-xs font-medium tracking-wide text-purple-300/80"
                                        >
                                            Current password
                                        </Label>

                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="mt-1 block w-full rounded-lg border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />

                                        <InputError
                                            className="text-xs text-rose-500"
                                            message={errors.current_password}
                                        />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-medium tracking-wide text-purple-300/80"
                                    >
                                        New password
                                    </Label>

                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full rounded-lg border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                        autoComplete="new-password"
                                        placeholder="New password"
                                    />

                                    <InputError
                                        className="text-xs text-rose-500"
                                        message={errors.password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-xs font-medium tracking-wide text-purple-300/80"
                                    >
                                        Confirm password
                                    </Label>

                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full rounded-lg border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />

                                    <InputError
                                        className="text-xs text-rose-500"
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-4 border-t border-purple-950/60 pt-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/10 px-7 text-purple-300 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/20 hover:text-white sm:w-auto"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two-factor authentication */}
                {canManageTwoFactor && (
                    <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                        <div className="mb-6 flex items-center gap-3 border-b border-purple-950/60 pb-3">
                            <Smartphone className="h-4 w-4 text-purple-400" />
                            <div>
                                <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                                    Two-factor authentication
                                </h2>
                                <p className="mt-0.5 text-xs text-zinc-400">
                                    Manage your two-factor authentication
                                    settings.
                                </p>
                            </div>
                        </div>

                        {twoFactorEnabled ? (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <p className="text-sm text-zinc-400">
                                    Anda akan diminta untuk memasukkan pin yang
                                    aman dan acak saat login, yang dapat Anda
                                    ambil dari aplikasi yang mendukung TOTP di
                                    ponsel Anda.
                                </p>

                                <div className="relative inline">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-rose-900/40 hover:text-rose-200"
                                            >
                                                Disable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </div>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <p className="text-sm text-zinc-400">
                                    Ketika Anda mengaktifkan autentikasi dua
                                    faktor, Anda akan diminta untuk memasukkan
                                    pin yang aman saat login. Pin ini dapat
                                    diambil dari aplikasi yang mendukung TOTP di
                                    ponsel Anda.
                                </p>

                                <div>
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() =>
                                                setShowSetupModal(true)
                                            }
                                            className="relative z-10 overflow-hidden rounded-lg border border-amber-500/50 bg-amber-950/20 px-6 py-2 text-sm font-medium text-amber-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-900/30 hover:text-amber-200 active:scale-[0.98]"
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                            Continue setup
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="relative z-10 overflow-hidden rounded-lg border border-amber-500/50 bg-amber-950/20 px-6 py-2 text-sm font-medium text-amber-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-900/30 hover:text-amber-200 active:scale-[0.98]"
                                                >
                                                    Enable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

Security.layout = (page: React.ReactNode) => (
    <SettingLayout>{page}</SettingLayout>
);
