import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Mail, ShieldAlert } from 'lucide-react';
// import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingLayout from '@/layouts/setting-layout';
// import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <SettingLayout>
            <Head title="Profile Settings" />

            <div className="space-y-6 lg:col-span-6">
                <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                    <div className="mb-6 border-b border-purple-950/60 pb-3">
                        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                            Account details
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            Update your name and email address.
                        </p>
                    </div>

                    <Form
                        // {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
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
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <InputError
                                        className="mt-1 text-xs text-rose-500"
                                        message={errors.email}
                                    />
                                </div>

                                {/* Email verification notice */}
                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-950/10 p-4">
                                            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                                            <div className="space-y-1">
                                                <p className="text-xs text-amber-400/90">
                                                    Your email address is
                                                    unverified.
                                                </p>
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="mt-1 block text-xs text-zinc-300 underline decoration-amber-500/50 underline-offset-4 transition-colors hover:text-white"
                                                >
                                                    Resend verification email
                                                </Link>
                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-2 text-xs text-emerald-400">
                                                        A new verification link
                                                        was sent to your email
                                                        address.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Submit */}
                                <div className="flex items-center justify-end border-t border-purple-950/60 pt-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="relative z-10 overflow-hidden rounded-lg border border-purple-500 bg-transparent px-6 py-2 text-sm font-medium text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:bg-linear-to-r before:from-purple-600 before:to-indigo-600 before:opacity-0 before:transition-opacity hover:text-white hover:before:opacity-100 active:scale-[0.98]"
                                    >
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Danger zone */}
                <div className="rounded-xl border border-rose-500/20 bg-black/20 p-4">
                    <DeleteUser />
                </div>
            </div>
        </SettingLayout>
    );
}
