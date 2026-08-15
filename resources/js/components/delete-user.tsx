import { Form } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Hapus Akun"
                description="Hapus akun Anda secara permanen beserta seluruh sumber daya di dalamnya."
            />

            {/* Warning Box minimalis bertema Cyber Red-Purple */}
            <div className="space-y-4 rounded-xl border border-rose-500/20 bg-rose-950/20 p-5 backdrop-blur-xs">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                    <div className="space-y-0.5 text-zinc-200">
                        <p className="text-sm font-semibold tracking-wide text-rose-400">
                            Peringatan Bahaya
                        </p>
                        <p className="text-xs text-zinc-400">
                            Harap berhati-hati sebelum melanjutkan. Tindakan ini
                            tidak dapat dibatalkan dan seluruh data Anda akan
                            terhapus permanen.
                        </p>
                    </div>
                </div>

                {/* Menggunakan AlertDialog */}
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        {/* Tombol Simpel & Clean (Tidak lebay) */}
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-600/80 px-4 text-xs font-medium text-white transition-colors hover:bg-rose-600 active:scale-[0.98]"
                        >
                            <Trash2 className="h-4 w-4" />
                            Hapus Akun
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="border-rose-900/40 bg-zinc-950 text-zinc-100 sm:max-w-106.25">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-base font-semibold text-rose-400">
                                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                                Apakah Anda yakin ingin menghapus akun?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs leading-relaxed text-zinc-400">
                                Setelah akun Anda dihapus, seluruh data dan aset
                                Anda di{' '}
                                <strong className="text-zinc-200">
                                    INCEPTION 2026
                                </strong>{' '}
                                akan dihapus secara permanen. Masukkan kata
                                sandi Anda untuk mengonfirmasi tindakan ini.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <div className="space-y-5 pt-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-medium tracking-wide text-purple-300/80"
                                        >
                                            Kata Sandi Konfirmasi
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Masukkan kata sandi Anda"
                                            autoComplete="current-password"
                                            className="h-10 rounded-lg border-purple-900/50 bg-[#0d071a]/80 text-sm text-zinc-200 shadow-inner focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                                        />

                                        <InputError
                                            className="mt-1 text-xs text-rose-500"
                                            message={errors.password}
                                        />
                                    </div>

                                    <AlertDialogFooter className="gap-2">
                                        <AlertDialogCancel asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => {
                                                    resetAndClearErrors();
                                                    setIsOpen(false);
                                                }}
                                                className="border-purple-900/50 bg-transparent text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                            >
                                                Batal
                                            </Button>
                                        </AlertDialogCancel>

                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                            data-test="confirm-delete-user-button"
                                            className="bg-rose-600 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                                        >
                                            Ya, Hapus Akun
                                        </Button>
                                    </AlertDialogFooter>
                                </div>
                            )}
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
