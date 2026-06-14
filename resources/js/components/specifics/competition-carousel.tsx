import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ComCard } from '../cards/comp-card';
import { Button } from '../ui/button';

// Biggest / smallest scale factor for the carousel items
const TWEEN_FACTOR_BASE = 0.24;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

interface CompetitionCarouselProps {
    items: {
        title: string;
        desc: string;
        icon: LucideIcon;
    }[];
}

export function CompetitionCarousel({ items }: CompetitionCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        loop: true,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);

    const setTweenNodes = useCallback((api: EmblaCarouselType) => {
        tweenNodes.current = api
            .slideNodes()
            .map(
                (slide) => slide.querySelector('.carousel-card') as HTMLElement,
            );
    }, []);

    const setTweenFactor = useCallback((api: EmblaCarouselType) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
    }, []);

    const tweenScale = useCallback(
        (api: EmblaCarouselType, event?: EmblaEventType) => {
            const engine = api.internalEngine();
            const progress = api.scrollProgress();
            const visibleSlides = api.slidesInView();
            const isScrollEvent = event === 'scroll';

            api.scrollSnapList().forEach((snap, snapIndex) => {
                let diff = snap - progress;

                const slidesInSnap = engine.slideRegistry[snapIndex];

                if (!slidesInSnap) {
                    return;
                }

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !visibleSlides.includes(slideIndex)) {
                        return;
                    }

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopPoint) => {
                            const target = loopPoint.target();

                            if (
                                slideIndex === loopPoint.index &&
                                target !== 0
                            ) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diff = snap - (1 + progress);
                                }

                                if (sign === 1) {
                                    diff = snap + (1 - progress);
                                }
                            }
                        });
                    }

                    const scale = clamp(
                        1 - Math.abs(diff * tweenFactor.current),
                        0.85,
                        1.05,
                    );

                    const node = tweenNodes.current[slideIndex];

                    if (!node) {
                        return;
                    }

                    node.style.transform = `scale(${scale})`;
                    node.style.opacity =
                        slideIndex === api.selectedScrollSnap() ? '1' : '0.4';
                });
            });
        },
        [],
    );

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) {
            return;
        }

        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) {
            return;
        }

        emblaApi.scrollNext();
    }, [emblaApi]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) {
                return;
            }

            emblaApi.scrollTo(index);
        },
        [emblaApi],
    );

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const onInit = (api: EmblaCarouselType) => {
            setScrollSnaps(api.scrollSnapList());
            setSelectedIndex(api.selectedScrollSnap());
        };

        const onSelect = (api: EmblaCarouselType) => {
            setSelectedIndex(api.selectedScrollSnap());
        };

        onInit(emblaApi);

        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);

        emblaApi
            .on('reInit', onInit)
            .on('reInit', setTweenNodes)
            .on('reInit', setTweenFactor)
            .on('reInit', tweenScale)
            .on('scroll', tweenScale)
            .on('slideFocus', tweenScale)
            .on('select', onSelect);

        return () => {
            emblaApi
                .off('reInit', onInit)
                .off('reInit', setTweenNodes)
                .off('reInit', setTweenFactor)
                .off('reInit', tweenScale)
                .off('scroll', tweenScale)
                .off('slideFocus', tweenScale)
                .off('select', onSelect);
        };
    }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

    return (
        <>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="-ml-4 flex items-center">
                    {items.map((item) => (
                        <div
                            key={item.title}
                            className="min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                            <ComCard {...item} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6">
                {/* Prev Button */}
                <Button
                    onClick={onPrevButtonClick}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-slate-900/80 text-gray-300 transition-colors hover:bg-purple-600 hover:text-white"
                >
                    <Rocket className="rotate-250" />
                </Button>

                {/* Dots */}
                <div className="flex items-center gap-2 rounded-full border border-gray-800 bg-slate-900/60 px-4 py-2 backdrop-blur-sm">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                index === selectedIndex
                                    ? 'w-6 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                                    : 'w-2.5 bg-gray-600 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    onClick={onNextButtonClick}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-slate-900/80 text-gray-300 transition-colors hover:bg-purple-600 hover:text-white"
                >
                    <Rocket className="rotate-10" />
                </Button>
            </div>
        </>
    );
}
