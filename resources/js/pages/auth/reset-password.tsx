import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import StrictLayout from '@/layouts/strict-layout';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset Password" />

            <div className="mx-auto w-full max-w-xl rounded-3xl border border-purple-500/20 bg-[#0f051d]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-12">
                <p className="mb-2 text-center font-mono text-xs font-bold tracking-[3px] text-purple-400 uppercase">
                    // PASSWORD_RESET_ZONE
                </p>

                <h1 className="mb-3 text-center font-avalors text-3xl font-extrabold tracking-wider text-white uppercase sm:text-4xl">
                    RESET KATA SANDI{' '}
                    <span className="text-[#b13bff]">ANDA</span>
                </h1>

                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-amber-400" />

                <p className="mx-auto mb-8 max-w-lg text-center text-xs leading-relaxed tracking-wide text-purple-100/70 sm:text-sm">
                    Silakan masukkan kata sandi baru Anda di bawah ini untuk
                    memperbarui kredensial akun{' '}
                    <strong className="font-semibold text-white">
                        INCEPTION 2026
                    </strong>
                    .
                </p>

                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <div className="mx-auto max-w-md space-y-5">
                            {/* Email Address (Read-Only) */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-medium text-purple-300/80"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className="h-11 cursor-not-allowed border-purple-900/50 bg-[#0d071a]/50 font-mono text-sm text-purple-200/60 opacity-80"
                                />
                                <InputError
                                    message={errors.email}
                                    className="text-xs text-rose-400"
                                />
                            </div>

                            {/* Password Baru */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-medium text-purple-300/80"
                                >
                                    Kata Sandi Baru
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="new-password"
                                    placeholder="Masukkan kata sandi baru"
                                    className="h-11 border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                />
                                <InputError
                                    message={errors.password}
                                    className="text-xs text-rose-400"
                                />
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-medium text-purple-300/80"
                                >
                                    Konfirmasi Kata Sandi Baru
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={2}
                                    autoComplete="new-password"
                                    placeholder="Konfirmasi kata sandi baru"
                                    className="h-11 border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="text-xs text-rose-400"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={3}
                                data-test="reset-password-button"
                                className="group relative mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-97"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                    color: '#F3E8FF',
                                    boxShadow: '0 0 25px rgba(177,59,255,0.35)',
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {processing && <Spinner />}
                                    Reset Kata Sandi
                                </span>
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

ResetPassword.layout = (page: React.ReactNode) => (
    <StrictLayout>{page}</StrictLayout>
);
