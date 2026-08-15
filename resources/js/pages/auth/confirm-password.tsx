import { Form, Head } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import StrictLayout from '@/layouts/strict-layout';
import { logout } from '@/routes';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm Password" />

            <div className="mx-auto w-full max-w-xl rounded-3xl border border-purple-500/20 bg-[#0f051d]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-12">
                <p className="mb-2 text-center font-mono text-xs font-bold tracking-[3px] text-purple-400 uppercase">
                    // SECURITY_CHECKPOINT
                </p>

                <h1 className="mb-3 text-center font-avalors text-3xl font-extrabold tracking-wider text-white uppercase sm:text-4xl">
                    KONFIRMASI <span className="text-[#b13bff]">PASSWORD</span>
                </h1>

                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-amber-400" />

                <p className="mx-auto max-w-lg text-center text-xs leading-relaxed tracking-wide text-purple-100/70 sm:text-sm">
                    Ini adalah area aman pada aplikasi. Silakan konfirmasi
                    password Anda sebelum melanjutkan.
                </p>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="mt-8 space-y-4"
                >
                    {({ processing, errors }) => (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full max-w-md space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="font-mono text-xs tracking-wider text-purple-200/90 uppercase"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="border-purple-500/20 bg-purple-950/20 text-white placeholder:text-purple-300/40 focus-visible:ring-[#b13bff]/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                disabled={processing}
                                type="submit"
                                data-test="confirm-password-button"
                                className="group relative inline-flex h-12 w-full max-w-md cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-97"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                    color: '#F3E8FF',
                                    boxShadow: '0 0 25px rgba(177,59,255,0.35)',
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {processing ? <Spinner /> : <></>}
                                    Konfirmasi Password
                                </span>
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </Button>

                            <TextLink
                                href={logout()}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300/70 transition-colors hover:text-white"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Keluar dari Akun
                            </TextLink>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

ConfirmPassword.layout = (page: React.ReactNode) => (
    <StrictLayout>{page}</StrictLayout>
);
