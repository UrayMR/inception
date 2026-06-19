import { Head } from '@inertiajs/react';
import AboutSection from '@/features/guest/landing-page/about-section';
import CarouselSection from '@/features/guest/landing-page/carousel-section';
import HeroSection from '@/features/guest/landing-page/hero-section';
import AppLayout from '@/layouts/app-layout';

export default function Main() {
    return (
        <AppLayout>
            <Head title="Welcome" />

            {/* --- HERO SECTION --- */}
            <HeroSection />

            {/* --- ABOUT SECTION --- */}
            <AboutSection />

            {/* --- CAROUSEL SECTION --- */}
            <CarouselSection />
        </AppLayout>
    );
}
