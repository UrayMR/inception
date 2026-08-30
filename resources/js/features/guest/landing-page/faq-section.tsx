import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'Apa itu INCEPTION 2026?',
        answer: 'INCEPTION (Informatics Competition for Exploring Technology and Innovation) 2026 adalah kompetisi teknologi informasi tingkat nasional oleh Himatifa UPN Veteran Jawa Timur dengan tema "Empowering Future Innovators Through Technology and Creativity".',
    },
    {
        question: 'Siapa saja yang bisa mengikuti kompetisi ini?',
        answer: 'Terbuka untuk seluruh mahasiswa aktif D3, D4, atau S1 sederajat di seluruh Indonesia secara daring. Setiap tim terdiri dari 3 orang, dan anggota tim boleh berasal dari prodi berbeda dalam satu kampus yang sama (ketentuan lintas kampus mengacu pada guidebook masing-masing kompetisi).',
    },
    {
        question: 'Apa saja cabang lomba yang diadakan?',
        answer: 'Terdapat 4 cabang perlombaan: UI/UX Competition, Data Science Competition (DSC), Online Hackathon, dan Business Plan Competition (BPC). Peserta hanya boleh menjadi ketua pada satu tim di satu cabang lomba, namun boleh menjadi anggota di cabang lomba lain selama jadwalnya tidak bersamaan.',
    },
    {
        question: 'Kapan jadwal penting pendaftaran dan pelaksanaannya?',
        answer: 'Pendaftaran utama dibuka 24–30 Agustus 2026 (perpanjangan hingga 3 September 2026). Technical Meeting dilaksanakan pada 4 September 2026, penjurian/presentasi finalis pada 10 Oktober 2026, dan pengumuman pemenang pada 13 Oktober 2026.',
    },
    {
        question:
            'Di mana saya bisa mengunduh guidebook dan menghubungi panitia?',
        answer: 'Guidebook lengkap dapat diunduh melalui website resmi di https://inception.himatifaupnvjt.org/ pada bagian Detail Kompetisi yang ingin Anda ikuti. Jika mengalami kendala, Anda bisa menghubungi Instagram @inception.upnvjt atau melalui helpdesk website.',
    },
];

export default function FaqSection({ id }: { id: string }) {
    return (
        <section
            id={id}
            className="relative z-10 overflow-hidden py-16 sm:py-24"
        >
            <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                <div className="mb-12 space-y-3 text-center sm:mb-16">
                    <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // SYSTEM_INFO
                    </span>
                    <h2 className="font-avalors text-4xl font-extrabold tracking-wider text-white uppercase sm:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                </div>

                <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-0"
                    className="space-y-3 sm:space-y-4"
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="animate-none overflow-hidden rounded-xl border border-purple-950/40 bg-[#0d0829]/40 px-4 backdrop-blur-xl transition-all duration-300 hover:border-purple-900/50 data-[state=open]:border-purple-500/40 data-[state=open]:bg-[#120a3a]/60 data-[state=open]:shadow-[0_0_35px_rgba(168,85,247,0.15)] sm:rounded-2xl sm:px-6"
                        >
                            <AccordionTrigger className="py-4 text-left text-sm font-bold tracking-wide text-purple-200 transition-colors duration-200 hover:text-white hover:no-underline data-[state=open]:text-amber-400 sm:py-5 sm:text-base">
                                {faq.question}
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 text-xs leading-relaxed text-purple-100/70 antialiased sm:pb-6 sm:text-sm">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
