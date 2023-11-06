import { useEffect, useRef, useState } from 'react';

type CarouselProps = {
  autoSlide?: boolean;
  autoSlideInterval?: number;
  slides: string[];
  children?: React.ReactNode;
  curr: number;
  setCurr: React.Dispatch<React.SetStateAction<number>>;
};

export default function CustomCarousel({ autoSlide = false, autoSlideInterval = 5000, slides, children, curr, setCurr }: CarouselProps) {
  const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef(0);
  const lastPosition = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: any) => {
    if (e.target !== carouselRef.current) return;
    setIsDragging(true);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
    startPosition.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e: any) => {
    if (e.target !== carouselRef.current) return;
    if (!isDragging) return;

    const currentPosition = windowWidth <= 640 ? (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) : e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const dragDistance = currentPosition - startPosition.current;

    const transformPercentage = windowWidth <= 640 ? curr * 100 - (dragDistance / windowWidth) * 100 : curr * 100 - (dragDistance / windowWidth) * 100;

    if (carouselRef.current) {
      carouselRef.current.style.transform = windowWidth <= 640 ? `translateX(-${transformPercentage}%)` : `translateY(-${transformPercentage}%)`;
    }
  };

  const handleEnd = (e: any) => {
    if (e.target !== carouselRef.current) return;
    if (!isDragging) return;

    const distance = lastPosition.current - startPosition.current;

    if (windowWidth <= 640) {
      if (distance > windowWidth * 0.1) {
        prev();
      } else if (distance < -windowWidth * 0.1) {
        next();
      } else {
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateX(-${curr * 100}%)`;
        }
      }
    } else {
      if (distance > windowWidth * 0.1) {
        prev();
      } else if (distance < -windowWidth * 0.1) {
        next();
      } else {
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateY(-${curr * 100}%)`;
        }
      }
    }

    setIsDragging(false);
  };
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div
      className="overflow-hidden h-[30rem] slider_md:h-[20rem] relative rounded-2xl"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        ref={carouselRef}
        className={`flex h-full lg:flex-col transition-transform ease-out duration-500`}
        style={windowWidth <= 640 ? { transform: `translateX(-${curr * 100}%)` } : { transform: `translateY(-${curr * 100}%)` }}
      >
        {slides.map((img, idx) => (
          <img key={idx} className="object-cover w-full h-full" src={img} alt="" style={{ pointerEvents: 'none' }} />
        ))}
      </div>

      <div className="absolute left-[40%] slider_md:left-4 top-[95%] slider_md:top-1/2 transform -translate-y-1/2 flex slider_md:flex-col items-center gap-3 bg-white/10 p-2 rounded-2xl z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurr(i)}
            style={{ cursor: 'pointer' }}
            className={`w-3 h-3 bg-white transition-all rounded-2xl cursor-pointer transform ${curr === i ? 'slider_md:scale-125 border-2 border-white' : 'bg-opacity-50'}cursor-pointer`}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
