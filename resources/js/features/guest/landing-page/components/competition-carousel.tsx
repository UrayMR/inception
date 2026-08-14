import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompetitionCard } from '@/features/guest/competition/components/competition-card';
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

                    let translateY = 0;
                    let translateZ = 0;
                    let rotateY = 0;
                    let scale = 1;
                    let opacity = 1;

                    if (absDiff > 0.1) {
                        translateZ = -absDiff * 350;
                        rotateY = diff * -40;
                        scale = Math.max(1 - absDiff * 0.15, 0.8);
                        translateY = absDiff * 25;
                        opacity = Math.max(1 - absDiff * 0.5, 0.3);
                    }

                    node.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                    node.style.opacity = String(opacity);
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

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div
                className="w-full overflow-hidden pt-4 pb-4 perspective-[1400px] transform-3d"
                ref={emblaRef}
            >
                <div className="mb-14 flex touch-pan-y items-center transform-3d">
                    {items.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                onClick={() => onCardClick(index)}
                                className="min-w-0 shrink-0 grow-0 basis-[80%] px-6 transform-3d focus:outline-none sm:basis-[52%] md:basis-[40%] lg:basis-[38%]"
                            >
                                <div className="carousel-card flex flex-col items-center gap-6 transition-all duration-300 ease-out will-change-transform transform-3d">
                                    <CompetitionCard
                                        {...item}
                                        href={competitions.show.url(item.slug)}
                                        isActive={index === selectedIndex}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
