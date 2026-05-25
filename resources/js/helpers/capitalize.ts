export default function capitalize(value?: string) {
    if (value == null) {
        return '';
    }

    const s = String(value);

    return s.length === 0 ? '' : s.charAt(0).toUpperCase() + s.slice(1);
}
