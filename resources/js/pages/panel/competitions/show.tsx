import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { CompetitionForm } from '@/components/forms/competition-form';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import competitions from '@/routes/admin/competitions';
import type { CompetitionTimeline } from '@/types';
import type {
    BreadcrumbItem,
    CompetitionStatusType,
    CompetitionType,
    ICompetitionShow,
} from '@/types';

interface ShowCompetitionForm {
    name: string;
    description?: string;
    type: CompetitionType;
    image_path?: string;
    price: number;
    status: CompetitionStatusType;
    timelines: CompetitionTimeline[];
}

interface ShowCompetitionPageProps {
    competition: ICompetitionShow;
}

export default function ShowCompetitionPage({
    competition,
}: ShowCompetitionPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Competitions', href: competitions.index.url() },
        {
            title: 'Competition Detail',
            href: competitions.show.url(competition.slug),
        },
    ];

    const data: ShowCompetitionForm = {
        name: competition.name,
        description: competition.description || '',
        type: competition.type,
        price: competition.price,
        status: competition.status,
        image_path: competition.image_path || '',
        timelines: competition.timelines,
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Competition Detail" />
            <MainContent>
                <MainContent.Header
                    title="Competition Detail"
                    actions={<BackButton href={competitions.index.url()} />}
                />
                <MainContent.Section>
                    <CompetitionForm
                        mode="show"
                        data={data}
                        errors={{}}
                        onChange={() => {}}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
