export default function StepCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-5 rounded-2xl border border-purple-900/20 bg-zinc-950/40 backdrop-blur-sm p-6 md:p-8">
            {children}
        </div>
    );
}
