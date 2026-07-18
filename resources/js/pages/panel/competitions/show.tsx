import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import { CompetitionForm } from '@/features/panel/competition';
import PanelLayout from '@/layouts/panel-layout';
import competitions from '@/routes/panel/competitions';
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
    guidebook_link?: string;
    max_member?: number;
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
        guidebook_link: competition.guidebook_link || '',
        max_member: competition.max_member,
        timelines: competition.timelines || [],
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
                        imagePath={data.image_path}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
