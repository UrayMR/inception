const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
});

const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
});

export default function formatDate(
    value: string | Date | null | undefined,
    options?: { short?: boolean; long?: boolean },
) {
    if (!value) {
        return '-';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    if (options?.long) {
        return longDateFormatter.format(date);
    }

    if (options?.short) {
        return shortDateFormatter.format(date);
    }

    return dateFormatter.format(date);
}
