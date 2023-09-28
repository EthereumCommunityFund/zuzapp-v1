"use client"

import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface GalleryProps { }

const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => e.preventDefault();

const items = [
  <img key={1} alt='333' src="/images/3.png" onDragStart={handleDragStart} role="presentation" />,
  <img key={2} alt='333' src="/images/4.png" onDragStart={handleDragStart} role="presentation" />,
  <img key={3} alt='333' src="/images/5.png" onDragStart={handleDragStart} role="presentation" />,
];

const Carousel: React.FC<GalleryProps> = () => {
  return (
    <div className='w-[500px]'>
      <AliceCarousel touchTracking disableDotsControls autoHeight mouseTracking items={items} />
    </div>
  );
}

export default Carousel;
