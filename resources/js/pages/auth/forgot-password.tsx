import { Form, Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot Password"
            description="Enter your email address below to receive a password reset link"
        >
            <Head title="Forgot Password" />

            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                {status && (
                    <div className="flex w-full items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 backdrop-blur-xs">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <p className="text-xs leading-relaxed font-medium text-emerald-300">
                            {status}
                        </p>
                    </div>
                )}

                <Form
                    {...email.form()}
                    className="relative z-10 flex w-full flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-400/90"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="h-11 border-gray-800 bg-slate-950/40 text-white transition-all duration-200 placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-purple-500/10"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="text-xs text-red-400"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="group relative mt-2 h-11 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-none"
                                    tabIndex={2}
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                        color: '#F3E8FF',
                                        boxShadow:
                                            '0 0 20px rgba(177,59,255,0.35)',
                                    }}
                                >
                                    {processing && (
                                        <Spinner className="mr-2 h-4 w-4 text-white" />
                                    )}
                                    Email password reset link
                                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                </Button>
                            </div>

                            <div className="mt-1 text-center text-sm text-gray-500">
                                Remember your password?{' '}
                                <Link
                                    href={login()}
                                    tabIndex={3}
                                    className="font-medium text-purple-400/90 underline decoration-purple-500/30 underline-offset-4 transition-colors hover:text-purple-300"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
