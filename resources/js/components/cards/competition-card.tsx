import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import capitalize from '@/helpers/capitalize';

type CompetitionCardProps = {
    name: string;
    type: string;
    status: string;
    description: string;
    startDate: string;
    endDate: string;
    reward?: string;
    accent?: string;
};

export function CompetitionCard({
    name,
    type,
    status,
    description,
    startDate,
    endDate,
    reward = 'Rp. 1.0000.000 + Certificates',
    accent = 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500',
}: CompetitionCardProps) {
    return (
        <Card className="overflow-hidden border-border/60 bg-white/90 py-0 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-[#111111]">
            <div className={`h-2 w-full ${accent}`} />
            <CardHeader className="space-y-3 px-5 pt-5">
                <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                        {capitalize(type)}
                    </Badge>
                    <Badge className="rounded-full px-3 py-1">
                        {capitalize(status)}
                    </Badge>
                </div>
                <CardTitle className="text-xl tracking-tight text-[#1b1b18] dark:text-white">
                    {capitalize(name)}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                    {capitalize(description)}
                </CardDescription>
            </CardHeader>

            <CardContent className="px-5">
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Start date</p>
                        <p className="mt-1 font-medium text-foreground">
                            {capitalize(startDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">End date</p>
                        <p className="mt-1 font-medium text-foreground">
                            {capitalize(endDate)}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-muted-foreground">Prize</p>
                        <p className="mt-1 font-medium text-foreground">
                            {capitalize(reward)}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-3 px-5 pb-5">
                <Button size="sm" className="rounded-full px-4">
                    View details
                </Button>
            </CardFooter>
        </Card>
    );
}
