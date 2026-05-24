import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
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
                        This is a frontend mock page. Data is dummy for now and
                        safe to redesign before backend integration.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/competitions">
                                Back to competitions
                            </Link>
                        </Button>
                        <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1"
                        >
                            Dummy mode
                        </Badge>
                    </div>
                </div>

                <div className="rounded-2xl bg-muted/40 p-5">
                    <h2 className="text-base font-semibold">
                        Registration Notes
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>Choose competition first.</li>
                        <li>Team competitions require member list.</li>
                        <li>Use an active phone number for contact.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
