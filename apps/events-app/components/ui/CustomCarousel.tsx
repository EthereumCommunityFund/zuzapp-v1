import { useEffect, useRef, useState } from 'react';

type CarouselProps = {
  autoSlide?: boolean;
  autoSlideInterval?: number;
  slides: string[];
  children?: React.ReactNode;
  curr: number;
  setCurr: React.Dispatch<React.SetStateAction<number>>;
};

export default function CustomCarousel({ autoSlide = false, autoSlideInterval = 3000, slides, children, curr, setCurr }: CarouselProps) {
  const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef(0);
  const lastPosition = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: any) => {
    setIsDragging(true);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
    startPosition.current = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  };

  const handleMove = (e: any) => {
    if (!isDragging) return;

    const currentPosition = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const dragDistance = currentPosition - startPosition.current;

    const transformPercentage = curr * 50 - (dragDistance / (window.innerHeight / 2)) * 50;

    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateY(-${transformPercentage}%)`;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const distance = lastPosition.current - startPosition.current;

    if (distance > window.innerHeight * 0.1) {
      prev();
    } else if (distance < -window.innerHeight * 0.1) {
      next();
    } else {
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateY(-${curr * 50}%)`;
      }
    }

    setIsDragging(false);
  };

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div
      className="overflow-hidden lg:max-h-[344px] relative"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div ref={carouselRef} className={`flex lg:flex-col transition-transform ease-out duration-500 lg:-translate-y-[${curr * 50}%]`} style={{ transform: `translateY(-${curr * 50}%)` }}>
        {slides.map((img) => (
          <img src={img} alt="" style={{ pointerEvents: 'none' }} />
        ))}
      </div>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-3 bg-white/10 p-2 rounded-xl z-20">
        {slides.map((_, i) => (
          <button
            onClick={() => setCurr(i)}
            style={{ cursor: 'pointer' }}
            className={`w-3 h-3 bg-white transition-all rounded-2xl cursor-pointer transform ${curr === i ? 'scale-125 border-2 border-white' : 'bg-opacity-50'}`}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
