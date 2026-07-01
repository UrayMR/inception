const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
});

export default function formatDate(
    value: string | Date | null | undefined,
    options?: { short?: boolean },
) {
    if (!value) {
        return '-';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    if (options?.short) {
        return shortDateFormatter.format(date);
    }

    return dateFormatter.format(date);
}
