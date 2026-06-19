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
        <section className="relative overflow-hidden py-24">
            <div className="relative mx-auto max-w-4xl px-6">
                <div className="mb-14 text-center">
                    <h2 className="mt-4 bg-linear-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                        Frequently Asked Questions
                    </h2>
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
                            className="data-[state=open]: rounded-2xl border border-purple-500/40 bg-slate-950/40 px-6 shadow-[0_0_35px_rgba(168,85,247,0.18)] backdrop-blur-xl transition-all"
                        >
                            <AccordionTrigger className="data-[state=open]: py-5 text-left text-purple-300 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>

                            <AccordionContent className="pb-6 text-sm leading-relaxed text-gray-400">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
