import React, { useState } from 'react';
import { ImageSkeleton } from './Skeletons.js';

export default function Image({ id, src, alt, size }) {
  const [showImg, setShowImg] = useState(false);
  return (
    <>
      {!showImg && <ImageSkeleton size={size} />}
      <img
        id={id}
        className={showImg ? 'img' : 'd-none'}
        src={src}
        alt={alt}
        onLoad={() => setShowImg(true)}
      />
    </>
  );
}
