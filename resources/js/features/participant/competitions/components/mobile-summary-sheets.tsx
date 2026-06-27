import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import { useState } from 'react';
import type { Option } from '@/types';
import CompetitionSummaryPanel from './competition-summary-panel';

type MobileSummarySheetProps = {
    selectedCompetition?: Option;
};

export function MobileSummarySheet({
    selectedCompetition,
}: MobileSummarySheetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dragControls = useDragControls();

    return (
        <div className="lg:hidden">
            <motion.div
                className="fixed inset-x-0 bottom-0 z-40 border-t border-purple-500/20 bg-[#0d0829]/90 shadow-[0_-10px_30px_rgba(139,92,246,0.1)] backdrop-blur-xl"
                style={{ touchAction: 'none' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div className="h-px w-full bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

                <motion.button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="group flex w-full items-center justify-between px-6 py-4.5 select-none"
                    aria-expanded={isExpanded}
                    aria-controls="mobile-summary-sheet"
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="bg-linear-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-xs font-bold tracking-widest text-transparent uppercase">
                        Ringkasan Kompetisi
                    </span>

                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-purple-400/80 uppercase transition-colors group-hover:text-purple-300">
                        <span>Lihat detail</span>
                        <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                    </div>
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                        />

                        <motion.div
                            id="mobile-summary-sheet"
                            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-purple-900/30 bg-[#0d0829] shadow-[0_-25px_60px_rgba(5,2,15,0.7)]"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 30,
                                stiffness: 300,
                            }}
                            drag="y"
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.4 }}
                            onDragEnd={(_, info) => {
                                if (
                                    info.offset.y > 120 ||
                                    info.velocity.y > 500
                                ) {
                                    setIsExpanded(false);
                                }
                            }}
                        >
                            <div
                                className="flex cursor-grab touch-none flex-col items-center gap-3 py-3 active:cursor-grabbing"
                                onPointerDown={(event) =>
                                    dragControls.start(event)
                                }
                            >
                                <span className="h-1.5 w-10 rounded-full bg-purple-800/60" />
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
                                <CompetitionSummaryPanel
                                    selectedCompetition={selectedCompetition}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
