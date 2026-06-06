type FileUrl = {
    url: string;
    disk: 'public' | 'local';
    customUrl?: string;
};

export const getFileUrl = ({ url, disk, customUrl }: FileUrl): string => {
    // if disk is public, return the url as is but prefix with /storage
    if (disk === 'local') {
        return customUrl || `/files/${url}`;
    }

    return `/storage/${url}`;
};
