import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    User,
    Mail,
    ShieldAlert,
    AlertTriangle,
    MailCheck,
} from 'lucide-react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingLayout from '@/layouts/setting-layout';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    const [emailInput, setEmailInput] = useState(auth.user.email);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingSubmitFn, setPendingSubmitFn] = useState<(() => void) | null>(
        null,
    );

    const handleCancelSubmit = () => {
        setEmailInput(auth.user.email);
        setPendingSubmitFn(null);
        setIsConfirmOpen(false);
    };

    const handleFormSubmit = (e: React.FormEvent, submitFn: () => void) => {
        e.preventDefault();

        const isEmailChanged =
            emailInput.trim().toLowerCase() !== auth.user.email.toLowerCase();

        const isEmailVerified = auth.user.email_verified_at !== null;

        if (isEmailChanged && isEmailVerified) {
            setPendingSubmitFn(() => submitFn);
            setIsConfirmOpen(true);
        } else {
            submitFn();
        }
    };

    const handleConfirmSubmit = () => {
        if (pendingSubmitFn) {
            pendingSubmitFn();
        }

        setIsConfirmOpen(false);
    };

    return (
        <>
            <Head title="Pengaturan Profil" />

            <div className="space-y-6 lg:col-span-6">
                <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                    <div className="mb-5 flex items-center justify-between border-b border-purple-950/60 pb-3">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-200">
                                <User className="h-4 w-4 text-purple-400" />
                                Account Details
                            </h2>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Update your name and email address.
                            </p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, errors, submit }) => (
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="group relative grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-medium tracking-wide text-purple-300/80 transition-colors group-focus-within:text-purple-300"
                                    >
                                        Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-purple-500/60" />
                                        <Input
                                            id="name"
                                            className="h-11 rounded-lg border-purple-900/50 bg-[#0d071a]/80 pl-10 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <InputError
                                        className="mt-1 text-xs text-rose-500"
                                        message={errors.name}
                                    />
                                </div>

                                {/* Email */}
                                <div className="group relative grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-medium tracking-wide text-purple-300/80 transition-colors group-focus-within:text-purple-300"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-purple-500/60" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-11 rounded-lg border-purple-900/50 bg-[#0d071a]/80 pl-10 text-sm text-zinc-200 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                            value={emailInput}
                                            onChange={(e) =>
                                                setEmailInput(e.target.value)
                                            }
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Your email"
                                        />
                                    </div>
                                    <InputError
                                        className="mt-1 text-xs text-rose-500"
                                        message={errors.email}
                                    />
                                </div>

                                {/* Email verification warning notice */}
                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-xs">
                                            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                                            <div className="space-y-1.5">
                                                <p className="text-xs font-medium text-amber-300">
                                                    Alamat email Anda belum
                                                    diverifikasi.
                                                </p>
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="inline-block text-xs font-medium text-zinc-300 underline decoration-amber-500/50 underline-offset-4 transition-colors hover:text-white"
                                                >
                                                    Kirim email verifikasi ulang
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                {status === 'verification-link-sent' && (
                                    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400 backdrop-blur-xs">
                                        <MailCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                                        <span>
                                            Tautan verifikasi baru telah
                                            berhasil dikirimkan ke email Anda.
                                            Silakan periksa inbox atau spam
                                            folder Anda untuk menemukan email
                                            verifikasi anda.
                                        </span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex items-center justify-end border-t border-purple-950/60 pt-4">
                                    <Button
                                        type="button"
                                        onClick={(e) =>
                                            handleFormSubmit(e, submit)
                                        }
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/10 px-7 text-purple-300 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/20 hover:text-white sm:w-auto"
                                    >
                                        Simpan perubahan
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>

                {/* Danger zone */}
                <div className="rounded-xl border border-rose-500/20 bg-black/20 p-4">
                    <DeleteUser />
                </div>
            </div>

            <AlertDialog
                open={isConfirmOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCancelSubmit();
                    } else {
                        setIsConfirmOpen(open);
                    }
                }}
            >
                <AlertDialogContent className="border-purple-900/40 bg-zinc-950 text-zinc-100 sm:max-w-106.25">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-base font-semibold text-amber-400">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                            Konfirmasi Perubahan Email
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs leading-relaxed text-zinc-400">
                            Mengubah alamat email akan mengosongkan status
                            verifikasi Anda. Anda diwajibkan untuk{' '}
                            <strong className="text-zinc-200">
                                memverifikasi ulang email baru
                            </strong>{' '}
                            melalui tautan yang akan dikirimkan ke inbox Anda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-2 rounded-lg border border-purple-500/20 bg-purple-950/20 p-3 text-xs">
                        <span className="text-zinc-500">Email Baru:</span>{' '}
                        <span className="font-semibold text-purple-300">
                            {emailInput}
                        </span>
                    </div>

                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel
                            onClick={handleCancelSubmit}
                            className="border-purple-900/50 bg-transparent text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSubmit}
                            className="bg-purple-600 text-xs font-semibold text-white hover:bg-purple-700"
                        >
                            Ya, Ubah Email & Verifikasi
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => (
    <SettingLayout>{page}</SettingLayout>
);
