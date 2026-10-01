import { useCallback } from 'react';
import type { RegisterStepId } from '@/features/participant/competitions';

const DRAFT_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 jam

export function usePersistedRegistration<
    T extends { payment_proof_file?: File },
>(uniqueId: string, initialValues: T, initialStep: RegisterStepId) {
    const STORAGE_KEY = `competition_reg_draft_${uniqueId}`;

    const isDraftExpired = useCallback((): boolean => {
        try {
            const timestamp = localStorage.getItem(`${STORAGE_KEY}_timestamp`);

            if (!timestamp) {
                return true;
            }

            const timestampMs = Number(timestamp);

            return Date.now() - timestampMs > DRAFT_EXPIRATION_MS;
        } catch {
            return true;
        }
    }, [STORAGE_KEY]);

    const getStoredData = useCallback((): T => {
        try {
            if (isDraftExpired()) {
                localStorage.removeItem(`${STORAGE_KEY}_data`);
                localStorage.removeItem(`${STORAGE_KEY}_step`);

                return initialValues;
            }

            const item = localStorage.getItem(`${STORAGE_KEY}_data`);

            if (!item) {
                return initialValues;
            }

            const parsed = JSON.parse(item) as Omit<T, 'payment_proof_file'>;

            return {
                ...initialValues,
                ...parsed,
                payment_proof_file: undefined,
            };
        } catch {
            return initialValues;
        }
    }, [STORAGE_KEY, initialValues, isDraftExpired]);

    const getStoredStep = useCallback((): RegisterStepId => {
        try {
            if (isDraftExpired()) {
                localStorage.removeItem(`${STORAGE_KEY}_data`);
                localStorage.removeItem(`${STORAGE_KEY}_step`);

                return initialStep;
            }

            const item = localStorage.getItem(`${STORAGE_KEY}_step`);

            return item ? (JSON.parse(item) as RegisterStepId) : initialStep;
        } catch {
            return initialStep;
        }
    }, [STORAGE_KEY, initialStep, isDraftExpired]);

    const saveData = useCallback(
        (data: T) => {
            try {
                // prettier-ignore
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {payment_proof_file: _payment_proof_file,
                    ...persistable
                } = data;
                localStorage.setItem(
                    `${STORAGE_KEY}_data`,
                    JSON.stringify(persistable),
                );
                localStorage.setItem(
                    `${STORAGE_KEY}_timestamp`,
                    Date.now().toString(),
                );
            } catch (error) {
                console.warn('Gagal menyimpan draft:', error);
            }
        },
        [STORAGE_KEY],
    );

    const saveStep = useCallback(
        (step: RegisterStepId) => {
            try {
                localStorage.setItem(
                    `${STORAGE_KEY}_step`,
                    JSON.stringify(step),
                );
                localStorage.setItem(
                    `${STORAGE_KEY}_timestamp`,
                    Date.now().toString(),
                );
            } catch (error) {
                console.warn('Gagal menyimpan step:', error);
            }
        },
        [STORAGE_KEY],
    );

    const clearStorage = useCallback(() => {
        localStorage.removeItem(`${STORAGE_KEY}_data`);
        localStorage.removeItem(`${STORAGE_KEY}_step`);
        localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
    }, [STORAGE_KEY]);

    return { getStoredData, getStoredStep, saveData, saveStep, clearStorage };
}
