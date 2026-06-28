import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toUrl } from '@/lib/utils';

export type IsCurrentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
    startsWith?: boolean,
) => boolean;

export type IsCurrentOrParentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
) => boolean;

export type WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    ifTrue: TIfTrue,
    ifFalse?: TIfFalse,
) => TIfTrue | TIfFalse;

export type UseCurrentUrlReturn = {
    currentUrl: string;
    isCurrentUrl: IsCurrentUrlFn;
    isCurrentOrParentUrl: IsCurrentOrParentUrlFn;
    whenCurrentUrl: WhenCurrentUrlFn;
};

export function useCurrentUrl(): UseCurrentUrlReturn {
    const page = usePage();

    const inertiaUrl = page.url;

    const [currentHash, setCurrentHash] = useState(
        typeof window !== 'undefined' ? window.location.hash : '',
    );

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleHashChange = () => {
            setCurrentHash(window.location.hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    }, []);

    const fullCurrentUrl = `${inertiaUrl}${currentHash}`;

    const isCurrentUrl: IsCurrentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
        startsWith: boolean = false,
    ) => {
        const urlToCompare = currentUrl ?? fullCurrentUrl;
        const urlString = toUrl(urlToCheck);

        let targetPathname = urlString;
        let targetHash = '';

        try {
            const parsedTarget = new URL(urlString, 'http://localhost');
            targetPathname = parsedTarget.pathname;
            targetHash = parsedTarget.hash;
        } catch {
            targetPathname = urlString;
            targetHash = '';
        }

        let comparePathname = urlToCompare;
        let compareHash = '';

        try {
            const parsedCompare = new URL(urlToCompare, 'http://localhost');
            comparePathname = parsedCompare.pathname;
            compareHash = parsedCompare.hash;
        } catch {
            comparePathname = urlToCompare;
            compareHash = '';
        }

        if (!startsWith) {
            return (
                comparePathname === targetPathname && compareHash === targetHash
            );
        }

        const targetSegments = targetPathname.split('/').filter(Boolean);
        const compareSegments = comparePathname.split('/').filter(Boolean);

        if (targetSegments.length > compareSegments.length) {
            return false;
        }

        const isParentPath = targetSegments.every(
            (seg, idx) => compareSegments[idx] === seg,
        );

        if (isParentPath) {
            if (targetHash && compareHash !== targetHash) {
                return false;
            }

            return true;
        }

        return false;
    };

    const isCurrentOrParentUrl: IsCurrentOrParentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
    ) => {
        return isCurrentUrl(urlToCheck, currentUrl, true);
    };

    const whenCurrentUrl: WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: TIfTrue,
        ifFalse: TIfFalse = null as TIfFalse,
    ): TIfTrue | TIfFalse => {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    };

    return {
        currentUrl: fullCurrentUrl,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
