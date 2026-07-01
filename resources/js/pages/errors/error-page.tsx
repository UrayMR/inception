import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
    error: {
        status: number;
        title: string;
        description: string;
    };
}

export default function ErrorPage({ error }: ErrorProps) {
    return (
        <>
            <Head title={error.title} />

            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <p className="text-8xl font-black text-primary">
                    {error.status}
                </p>

                <h1 className="mt-6 text-3xl font-bold">{error.title}</h1>

                <p className="mt-4 max-w-md text-muted-foreground">
                    {error.description}
                </p>

                <Button asChild className="mt-8">
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        </>
    );
}
