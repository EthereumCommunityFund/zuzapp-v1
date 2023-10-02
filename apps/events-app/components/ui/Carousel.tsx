"use client"

import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface GalleryProps {
  imgUrls: string[];
}

const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => e.preventDefault();


const Carousel: React.FC<GalleryProps> = ({ imgUrls }) => {
  const items: any = [];
  imgUrls.forEach((imgUrl, idx) => {
    items.push(
      <img key={idx} alt='333' src={imgUrl} onDragStart={handleDragStart} className='w-[500px] h-[430px]' role="presentation" />
    )
  })
  return (
    <div className='w-[500px] h-[450px]'>
      <AliceCarousel touchTracking disableDotsControls mouseTracking items={items} />
    </div>
  );
}

export default Carousel;
