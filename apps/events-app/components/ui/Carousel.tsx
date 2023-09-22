"use client"

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const ResponsiveCarousel: React.FC = () => {
  return (
    <Carousel className='w-[500px] h-[500px] mx-auto'>
      <div>
        <img src="/images/2.png" alt="Slide 1" />
      </div>
      <div>
        <img src="/images/3.png" alt="Slide 2" />
      </div>
      <div>
        <img src="/images/4.png" alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default ResponsiveCarousel;
