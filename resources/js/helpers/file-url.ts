type FileUrl = {
    url: string;
    disk: 'public' | 'private';
};

export const getFileUrl = ({ url, disk }: FileUrl): string => {
    // if disk is public, return the url as is but prefix with /storage
    if (disk === 'private') {
        // if disk is private, return the url prefixed with /api/files/ and suffixed with ?download=true
        return `/api/files/${url}?download=true`;
    }

    return `/storage/${url}`;
};
