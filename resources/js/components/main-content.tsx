import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
    children: ReactNode;
    className?: string;
}

function MainContent({ children, className }: MainContentProps) {
    return (
        <div className={cn(className, 'flex flex-col gap-4 p-4')}>
            {children}
        </div>
    );
}

interface MainContentHeaderProps {
    title: string;
    actions?: ReactNode;
    className?: string;
}

function Header({ title, actions, className }: MainContentHeaderProps) {
    return (
        <div
            className={cn(className, 'mb-5 flex items-center justify-between')}
        >
            <h2 className="text-2xl font-bold">{title}</h2>
            {actions}
        </div>
    );
}

interface MainContentSectionProps {
    children: ReactNode;
    className?: string;
}

function Section({ children, className }: MainContentSectionProps) {
    return <div className={cn(className, '')}>{children}</div>;
}

MainContent.Header = Header;
MainContent.Section = Section;

export { MainContent };
