import { Form, Head, usePage } from '@inertiajs/react';
import { MailCheck, LogOut } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import StrictLayout from '@/layouts/strict-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Verifikasi Email" />

            <div className="mx-auto w-full max-w-xl rounded-3xl border border-purple-500/20 bg-[#0f051d]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-12">
                <p className="mb-2 text-center font-mono text-xs font-bold tracking-[3px] text-purple-400 uppercase">
                    // ACCOUNT_VERIFICATION_REQUIRED
                </p>

                <h1 className="mb-3 text-center font-avalors text-3xl font-extrabold tracking-wider text-white uppercase sm:text-4xl">
                    VERIFIKASI EMAIL{' '}
                    <span className="text-[#b13bff]">ANDA</span>
                </h1>

                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-amber-400" />

                <p className="mx-auto max-w-lg text-center text-xs leading-relaxed tracking-wide text-purple-100/70 sm:text-sm">
                    Terima kasih telah mendaftar di{' '}
                    <strong className="font-semibold text-white">
                        INCEPTION 2026
                    </strong>
                    ! Silakan periksa inbox atau folder spam email Anda dan klik
                    tautan verifikasi yang telah kami kirimkan.
                </p>

                {auth?.user?.email && (
                    <div className="my-6 rounded-xl border border-purple-500/15 bg-purple-950/20 p-3.5 text-center font-mono text-xs text-purple-200/90">
                        <span className="text-zinc-500">Dikirim ke:</span>{' '}
                        <span className="font-semibold text-purple-300">
                            {auth.user.email}
                        </span>
                    </div>
                )}

                {status === 'verification-link-sent' && (
                    <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs font-medium text-emerald-400 backdrop-blur-xs">
                        <MailCheck className="h-4 w-4 shrink-0" />
                        <span>
                            Tautan verifikasi baru telah berhasil dikirimkan ke
                            email Anda. Silakan periksa inbox atau spam folder
                            Anda untuk menemukan email verifikasi anda.
                        </span>
                    </div>
                )}

                <Form {...send.form()} className="mt-8 space-y-4">
                    {({ processing }) => (
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                disabled={processing}
                                type="submit"
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
                                    Kirim Ulang Email Verifikasi
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

VerifyEmail.layout = (page: React.ReactNode) => (
    <StrictLayout>{page}</StrictLayout>
);
