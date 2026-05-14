import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search',
    disabled = false,
}: SearchProps) {
    return (
        <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute top-4.5 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-8"
                disabled={disabled}
            />
        </div>
    );
}
