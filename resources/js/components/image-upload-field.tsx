import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFileUrl } from '@/helpers/file-url';

type ImageUploadOverviewProps = {
    value?: string | File | null;
    onChange?: (value: File | string) => void;
    disabled?: boolean;
    required?: boolean;
    disk?: 'public' | 'local';
    customUrl?: string;
};

export function ImageUploadField({
    value,
    onChange,
    disabled = false,
    required = false,
    disk = 'public',
    customUrl,
}: ImageUploadOverviewProps) {
    const [isImageError, setIsImageError] = useState(false);

    const [isLoading, setIsLoading] = useState(!!value);
    const [retryKey, setRetryKey] = useState(0);

    const [prevValue, setPrevValue] = useState(value);

    if (value !== prevValue) {
        setPrevValue(value);
        setIsImageError(false);
        setIsLoading(!!value);
    }

    const preview = useMemo(() => {
        if (!value) {
            return null;
        }

        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);

            return {
                url: objectUrl,
                isBlob: true,
                cleanup: () => URL.revokeObjectURL(objectUrl),
            };
        }

        return { url: value, isBlob: false, cleanup: null };
    }, [value]);

    useEffect(() => {
        return () => {
            if (preview?.cleanup) {
                preview.cleanup();
            }
        };
    }, [preview]);

    const imageUrl = useMemo(() => {
        if (!preview?.url) {
            return '';
        }

        const baseUrl = preview.isBlob
            ? preview.url
            : getFileUrl({ url: preview.url, disk, customUrl });

        return retryKey > 0 ? `${baseUrl}?retry=${retryKey}` : baseUrl;
    }, [preview, disk, retryKey, customUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && onChange) {
            setIsImageError(false);
            setIsLoading(true);
            onChange(file);
        }
    };

    const handleTryAgain = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsImageError(false);
        setIsLoading(true);
        setRetryKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative flex aspect-video max-w-sm items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-neutral-50/80 dark:bg-neutral-900/80">
                            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                            <span className="text-xs font-medium text-neutral-500">
                                Loading...
                            </span>
                        </div>
                    )}

                    {isImageError ? (
                        <div className="z-20 flex flex-col items-center justify-center gap-2 p-4 text-center">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                    Failed to Load
                                </p>
                                <p className="max-w-62.5 text-xs text-neutral-500">
                                    Can't find the image or connection issue.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleTryAgain}
                                className="mt-1 h-8 gap-1.5 text-xs"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className={`h-full w-full object-contain transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsImageError(true);
                                setIsLoading(false);
                            }}
                        />
                    )}
                </div>
            ) : (
                disabled && (
                    <div className="flex max-w-sm flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                        <p className="font-medium text-neutral-700 dark:text-neutral-300">
                            No Image Uploaded
                        </p>
                    </div>
                )
            )}

            {!disabled && (
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="max-w-sm cursor-pointer"
                    required={required}
                />
            )}
        </div>
    );
}
