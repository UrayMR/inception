import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import GoogleIcon from '@/components/svg/google-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { redirect } from '@/routes/auth/google';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Sign in to your account"
            description="Enter your email and password below to sign in"
        >
            <Head title="Sign in" />

            <Form
                {...store()}
                resetOnSuccess={['password']}
                className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6"
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

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-400/90"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="ml-auto text-xs text-purple-400/90 transition-colors hover:text-purple-300"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="h-11 border-gray-800 bg-slate-950/40 text-white transition-all duration-200 placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-purple-500/10"
                                />
                                <InputError
                                    message={errors.password}
                                    className="text-xs text-red-400"
                                />
                            </div>

                            <div className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-gray-700 data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm text-gray-400/80 select-none"
                                >
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="group relative mt-2 h-11 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-none"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                    color: '#F3E8FF',
                                    boxShadow: '0 0 20px rgba(177,59,255,0.35)',
                                }}
                            >
                                {processing && (
                                    <Spinner className="mr-2 h-4 w-4 text-white" />
                                )}
                                Sign In
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </Button>

                            <div className="relative flex items-center py-1 text-xs text-gray-600 uppercase">
                                <div className="grow border-t border-gray-900"></div>
                                <span className="mx-4 shrink text-gray-500">
                                    or connect with
                                </span>
                                <div className="grow border-t border-gray-900"></div>
                            </div>

                            <a
                                href={redirect.url()}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-800 bg-slate-950/20 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-gray-700 hover:bg-slate-900/40 hover:text-white"
                            >
                                <GoogleIcon />
                                Masuk dengan Google
                            </a>
                        </div>

                        {canRegister && (
                            <div className="mt-1 text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link
                                    href={register()}
                                    tabIndex={5}
                                    className="font-medium text-purple-400/90 underline decoration-purple-500/30 underline-offset-4 transition-colors hover:text-purple-300"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mx-auto mt-6 max-w-md rounded-lg border border-emerald-500/10 bg-emerald-950/20 px-4 py-2 text-center text-sm font-medium text-emerald-400/90">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
