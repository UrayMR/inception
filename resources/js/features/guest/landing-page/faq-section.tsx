import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'Apa itu Inception?',
        answer: 'Inception adalah platform kompetisi yang membantu peserta menemukan, mengikuti, dan mengelola berbagai event kompetitif secara terstruktur.',
    },
    {
        question: 'Bagaimana cara mengikuti sebuah kompetisi?',
        answer: 'Pilih kompetisi yang tersedia, baca detail event, lalu lakukan registrasi melalui halaman kompetisi tersebut.',
    },
    {
        question: 'Apakah saya bisa mengikuti lebih dari satu kompetisi?',
        answer: 'Bisa. Selama jadwal kompetisi tidak bertabrakan dan memenuhi persyaratan event.',
    },
    {
        question: 'Apakah tersedia leaderboard?',
        answer: 'Setiap kompetisi dapat memiliki leaderboard untuk menampilkan ranking peserta berdasarkan hasil kompetisi.',
    },
    {
        question: 'Bagaimana jika mengalami masalah?',
        answer: 'Hubungi penyelenggara melalui informasi kontak yang tersedia pada halaman event.',
    },
];

export default function FaqSection() {
    return (
        <section className="relative z-10 overflow-hidden py-24">
            <div className="relative mx-auto max-w-4xl px-6">
                <div className="mb-16 space-y-3 text-center">
                    <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // SYSTEM_INFO
                    </span>
                    <h2 className="text-4xl font-extrabold tracking-wider text-white uppercase sm:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                </div>

                <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-0"
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="animate-none overflow-hidden rounded-2xl border border-purple-950/40 bg-[#0d0829]/40 px-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-900/50 data-[state=open]:border-purple-500/40 data-[state=open]:bg-[#120a3a]/60 data-[state=open]:shadow-[0_0_35px_rgba(168,85,247,0.15)]"
                        >
                            <AccordionTrigger className="py-5 text-left font-mono text-base font-bold tracking-wide text-purple-200 transition-colors duration-200 hover:text-white hover:no-underline data-[state=open]:text-amber-400">
                                {faq.question}
                            </AccordionTrigger>

                            <AccordionContent className="pb-6 font-mono text-sm leading-relaxed text-purple-100/70 antialiased">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
