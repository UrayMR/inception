import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface ErrorProps {
    error: {
        status: number;
        title: string;
        description: string;
    };
}

export default function ErrorPage({ error }: ErrorProps) {
    return (
        <AppLayout>
            <Head title={error.title} />

            <div className="flex min-h-[90vh] flex-col items-center justify-center bg-transparent px-6 text-center">
                <div className="relative font-mono text-[10rem] leading-none font-black tracking-widest text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] select-none md:text-[13rem]">
                    {error.status}
                </div>

                <h1 className="mt-4 font-sans text-2xl font-extrabold tracking-wide text-zinc-100 uppercase sm:text-3xl">
                    {error.title}
                </h1>

                <p className="mt-3 max-w-md font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {error.description}
                </p>

                <button className="group mt-10 h-11 rounded-xl border border-purple-500/30 bg-purple-950/10 px-6 font-mono text-xs font-bold tracking-widest text-purple-300 uppercase transition-all duration-300 outline-none hover:border-purple-500 hover:bg-purple-900/20 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] focus-visible:ring-1 focus-visible:ring-purple-500">
                    <Link href="/">
                        <span>RETURN_TO_BASE</span>
                    </Link>
                </button>
            </div>
        </AppLayout>
    );
}
