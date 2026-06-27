import formatCurrency from '@/helpers/format-currency';
import type { Option } from '@/types';
import CompetitionStatusBadge from './competition-status-badge';
import TimelinePanel from './timeline-panel';

type RegisterCompetitionSummaryProps = {
    selectedCompetition?: Option;
};

export default function RegisterCompetitionSummary({
    selectedCompetition,
}: RegisterCompetitionSummaryProps) {
    return (
        <aside className="space-y-5 rounded-2xl border border-purple-900/20 bg-zinc-950/40 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-sans">
                <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Ringkasan Kompetisi
                </h3>
                <CompetitionStatusBadge
                    status={selectedCompetition?.otherValues?.status}
                />
            </div>

            {selectedCompetition ? (
                <div className="space-y-6 font-sans">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="block text-xs tracking-wider text-zinc-500 uppercase">
                                Kategori
                            </span>
                            <span className="block text-2xl font-extrabold tracking-wide text-white">
                                {selectedCompetition.label}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="block text-xs tracking-wider text-zinc-500 uppercase">
                                Biaya Registrasi
                            </span>
                            <span className="block font-mono text-xl font-bold text-purple-400">
                                {Number(
                                    selectedCompetition.otherValues?.price ?? 0,
                                ) > 0
                                    ? formatCurrency(
                                          Number(
                                              selectedCompetition?.otherValues
                                                  ?.price ?? 0,
                                          ),
                                      )
                                    : 'Gratis / Free Access'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                            <div className="space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                                <span className="block text-xs text-zinc-500">
                                    Tipe
                                </span>
                                <span className="font-semibold text-zinc-200 uppercase">
                                    {selectedCompetition.otherValues?.type
                                        ? String(
                                              selectedCompetition.otherValues
                                                  .type,
                                          )
                                        : '-'}
                                </span>
                            </div>
                            <div className="space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                                <span className="block text-xs text-zinc-500">
                                    Maksimal Anggota
                                </span>
                                <span className="font-semibold text-zinc-200">
                                    {(selectedCompetition.otherValues
                                        ?.max_member ?? 0 > 0)
                                        ? `${selectedCompetition?.otherValues?.max_member} Orang`
                                        : '1 Orang (Solo)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-zinc-800 pt-5">
                        <TimelinePanel
                            timelines={
                                selectedCompetition.otherValues?.timelines
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 py-14 text-center">
                    <p className="text-sm font-semibold text-zinc-400">
                        Belum Ada Kompetisi yang Dipilih
                    </p>
                    <p className="max-w-55 text-xs leading-relaxed text-zinc-500">
                        Silakan pilih salah satu kategori lomba pada formulir di
                        sebelah kiri untuk melihat detail manifest.
                    </p>
                </div>
            )}
        </aside>
    );
}
