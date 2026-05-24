import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function RegisterCompetitionHero() {
    return (
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] dark:bg-[#111111]">
            <div className="h-2 bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-500" />
            <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_0.9fr] md:p-8">
                <div className="space-y-4">
                    <p className="text-sm font-medium tracking-[0.22em] text-muted-foreground uppercase">
                        Join the challenge
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Competition Registration Form
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Form to register for competitions. Please fill out the
                        form with accurate information to ensure a smooth
                        registration process.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/competitions">
                                Back to competitions
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl bg-muted/40 p-5">
                    <h2 className="text-base font-semibold">
                        Whatever is this
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>adwadw.</li>
                        <li>adwadw.</li>
                        <li>adwadw.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
