import { CheckIcon } from 'lucide-react';

export const REGISTRATION_STEPS = [
    { id: 'info', label: 'Informasi' },
    { id: 'payment', label: 'Pembayaran' },
] as const;

export type RegistrationStepId = (typeof REGISTRATION_STEPS)[number]['id'];

export default function RegistrationStepper({
    currentStep,
}: {
    currentStep: RegistrationStepId;
}) {
    const currentIndex = REGISTRATION_STEPS.findIndex(
        (step) => step.id === currentStep,
    );

    return (
        <div className="flex items-center">
            {REGISTRATION_STEPS.map((step, index) => {
                const isComplete = index < currentIndex;
                const isActive = index === currentIndex;

                return (
                    <div key={step.id} className="flex flex-1 items-center">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                                    isComplete
                                        ? 'bg-purple-600 text-white'
                                        : isActive
                                          ? 'border border-purple-500 bg-purple-500/20 text-purple-300'
                                          : 'border border-zinc-800 bg-zinc-900 text-zinc-500'
                                }`}
                            >
                                {isComplete ? (
                                    <CheckIcon className="h-3.5 w-3.5" />
                                ) : (
                                    String(index + 1).padStart(2, '0')
                                )}
                            </span>
                            <span
                                className={`font-mono text-[11px] font-bold tracking-widest uppercase ${
                                    isActive || isComplete
                                        ? 'text-zinc-200'
                                        : 'text-zinc-500'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {index < REGISTRATION_STEPS.length - 1 && (
                            <div className="mx-3 h-px flex-1 bg-zinc-800">
                                <div
                                    className={`h-px bg-purple-600 transition-all ${
                                        isComplete ? 'w-full' : 'w-0'
                                    }`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
