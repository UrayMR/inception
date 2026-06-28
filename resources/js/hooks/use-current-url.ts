import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
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
    const currentUrl = page.url;

    const isCurrentUrl: IsCurrentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        urlOverride?: string,
        startsWith: boolean = false,
    ) => {
        const baseCompareUrl = urlOverride ?? currentUrl;
        const urlString = toUrl(urlToCheck);

        let targetPathname = urlString;
        let comparePathname = baseCompareUrl;

        try {
            targetPathname = new URL(urlString, 'http://localhost').pathname;
        } catch {
            targetPathname = urlString.split('?')[0];
        }

        try {
            comparePathname = new URL(baseCompareUrl, 'http://localhost')
                .pathname;
        } catch {
            comparePathname = baseCompareUrl.split('?')[0];
        }

        if (!startsWith) {
            return comparePathname === targetPathname;
        }

        const targetSegments = targetPathname.split('/').filter(Boolean);
        const compareSegments = comparePathname.split('/').filter(Boolean);

        if (targetSegments.length > compareSegments.length) {
            return false;
        }

        return targetSegments.every((seg, idx) => compareSegments[idx] === seg);
    };

    const isCurrentOrParentUrl: IsCurrentOrParentUrlFn = (
        urlToCheck,
        urlOverride,
    ) => {
        return isCurrentUrl(urlToCheck, urlOverride, true);
    };

    const whenCurrentUrl: WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: TIfTrue,
        ifFalse: TIfFalse = null as TIfFalse,
    ): TIfTrue | TIfFalse => {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    };

    return {
        currentUrl,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
