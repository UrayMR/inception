import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompetitionCard } from '@/features/guest/competition/components/competition-card';
import CTAButton from '@/features/participant/competitions/components/cta-button';
import competitions from '@/routes/guest/competitions';
import type { ICompetitionCard } from '@/types';

interface CompetitionCarouselProps {
    items: ICompetitionCard[];
}

export function CompetitionCarousel({ items }: CompetitionCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        loop: true,
        skipSnaps: false,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const tweenNodes = useRef<HTMLElement[]>([]);

    const setTweenNodes = useCallback((api: EmblaCarouselType) => {
        tweenNodes.current = api
            .slideNodes()
            .map(
                (slide) => slide.querySelector('.carousel-card') as HTMLElement,
            );
    }, []);

    const tweenCards = useCallback(
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

                    const node = tweenNodes.current[slideIndex];

                    if (!node) {
                        return;
                    }

                    const absDiff = Math.abs(diff);
                    const scale = Math.max(1 - absDiff * 0.25, 0.75);
                    const translateZ = -absDiff * 500;
                    const translateY = absDiff * 45;
                    const rotateY = diff * -150;
                    const opacity = Math.max(1 - absDiff * 0.6, 0.15);

                    node.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                    node.style.opacity = String(opacity);
                    node.style.pointerEvents =
                        slideIndex === api.selectedScrollSnap()
                            ? 'auto'
                            : 'none';
                });
            });
        },
        [],
    );

    const onCardClick = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi],
    );

    const onPrevClick = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const onNextClick = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const onInit = (api: EmblaCarouselType) =>
            setSelectedIndex(api.selectedScrollSnap());
        const onSelect = (api: EmblaCarouselType) =>
            setSelectedIndex(api.selectedScrollSnap());

        onInit(emblaApi);
        setTweenNodes(emblaApi);
        tweenCards(emblaApi);

        emblaApi
            .on('reInit', onInit)
            .on('reInit', setTweenNodes)
            .on('reInit', tweenCards)
            .on('scroll', tweenCards)
            .on('slideFocus', tweenCards)
            .on('select', onSelect);

        return () => {
            emblaApi
                .off('reInit', onInit)
                .off('reInit', setTweenNodes)
                .off('reInit', tweenCards)
                .off('scroll', tweenCards)
                .off('slideFocus', tweenCards)
                .off('select', onSelect);
        };
    }, [emblaApi, setTweenNodes, tweenCards]);

    const activeItem = items[selectedIndex];
    const isCurrentOpen = activeItem?.status === 'open';

    return (
        <div className="w-full">
            <div
                className="w-full overflow-hidden pt-4 pb-4 perspective-[1400px] transform-3d"
                ref={emblaRef}
            >
                <div className="mb-14 flex touch-pan-y items-center transform-3d">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => onCardClick(index)}
                            className="min-w-0 shrink-0 grow-0 basis-[80%] px-6 transform-3d focus:outline-none sm:basis-[52%] md:basis-[40%] lg:basis-[32%]"
                        >
                            <div className="carousel-card flex flex-col items-center gap-6 transition-all duration-300 ease-out will-change-transform transform-3d">
                                <CompetitionCard
                                    {...item}
                                    isActive={index === selectedIndex}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {activeItem && (
                    <div className="mx-auto max-w-2xl px-8 font-mono text-[10px] tracking-[0.25em] text-zinc-500 select-none">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onPrevClick}
                                className="group flex cursor-pointer items-center gap-2 uppercase transition-all duration-250 hover:text-purple-400 active:scale-95 active:text-purple-300"
                            >
                                <span className="transition-transform duration-300 group-hover:-translate-x-1.5 group-hover:text-purple-400/80">
                                    &lt;
                                </span>
                                <span className="relative after:absolute after:right-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-purple-500/50 after:transition-all after:duration-300 group-hover:after:w-full">
                                    PREV
                                </span>
                            </button>

                            <CTAButton
                                href={competitions.show.url(activeItem.slug)}
                                isActive={isCurrentOpen}
                            />

                            <button
                                onClick={onNextClick}
                                className="group flex cursor-pointer items-center gap-2 uppercase transition-all duration-250 hover:text-purple-400 active:scale-95 active:text-purple-300"
                            >
                                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-purple-500/50 after:transition-all after:duration-300 group-hover:after:w-full">
                                    NEXT
                                </span>
                                <span className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-purple-400/80">
                                    &gt;
                                </span>
                            </button>
                        </div>

                        <div className="mt-5 flex items-center justify-center gap-2 text-center text-[9px] tracking-[0.4em] text-zinc-600/60 uppercase">
                            <span className="h-px w-4 bg-zinc-900" />
                            <span>
                                LOC_IDX // 0{selectedIndex + 1}_OF_0
                                {items.length}
                            </span>
                            <span className="h-px w-4 bg-zinc-900" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
