const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

export default function formatDate(value: string | Date | null | undefined) {
    if (!value) {
        return '-';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return dateFormatter.format(date);
}
