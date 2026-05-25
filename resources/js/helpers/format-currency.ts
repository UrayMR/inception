const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function formatCurrency(value: number | null | undefined) {
    if (value == null) {
        return '-';
    }

    return currencyFormatter.format(value);
}
