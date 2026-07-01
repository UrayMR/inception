export default function getQueryParam(
    key: string,
    search: string | URLSearchParams = typeof window !== 'undefined'
        ? window.location.search
        : '',
) {
    const params =
        search instanceof URLSearchParams
            ? search
            : new URLSearchParams(search);

    return params.get(key) || '';
}
