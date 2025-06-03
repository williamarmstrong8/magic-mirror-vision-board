"use client";

import { useEffect, useState } from 'react';

const VISION_IMAGES = [
  '/assets/vision1.jpg',
  '/assets/vision2.jpg',
  '/assets/vision3.jpg',
];

export default function VisionBoardWidget() {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle the images array
    const shuffled = [...VISION_IMAGES].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  return (
    <div className="text-white flex flex-col items-start justify-end h-full self-end w-full">
      <h2 className="text-2xl font-light mb-6 ml-2">Remember the vision</h2>
      <div className="flex space-x-6">
        {shuffledImages.map((image, index) => (
          <div key={index} className="flex-none" style={{ width: '160px', height: '240px' }}>
            <img
              src={image}
              alt={`Vision ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              style={{ aspectRatio: '3/2' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 