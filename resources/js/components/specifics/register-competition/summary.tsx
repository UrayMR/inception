import { Badge } from '@/components/ui/badge';
import formatCurrency from '@/helpers/format-currency';
import type { Option } from '@/types';

type RegisterCompetitionSummaryProps = {
    selectedCompetition?: Option;
};

export default function RegisterCompetitionSummary({
    selectedCompetition,
}: RegisterCompetitionSummaryProps) {
    return (
        <aside className="space-y-4 rounded-3xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] dark:bg-[#111111]">
            <h2 className="text-xl font-semibold tracking-tight">
                Selected Competition
            </h2>

            {selectedCompetition ? (
                <div className="space-y-3 rounded-2xl bg-muted/40 p-4 text-sm">
                    <p className="font-medium text-foreground">
                        {selectedCompetition.label}
                    </p>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0.5"
                        >
                            {selectedCompetition.otherValues?.type === 'team'
                                ? 'Team'
                                : 'Solo'}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0.5"
                        >
                            Max members:{' '}
                            {selectedCompetition.otherValues?.max_members ||
                                'Unlimited'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Fee:{' '}
                        {formatCurrency(
                            selectedCompetition.otherValues?.price || 0,
                        )}
                    </p>
                </div>
            ) : (
                <p className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
                    Select a competition to see registration details.
                </p>
            )}

            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Test Registration
                <ul className="mt-2 space-y-1">
                    <li>1. dwadwad</li>
                    <li>2. Abcadwad</li>
                    <li>3. adwadw</li>
                </ul>
            </div>
        </aside>
    );
}
