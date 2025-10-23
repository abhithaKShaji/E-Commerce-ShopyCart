import React, { useState, useRef } from "react";

interface ProductImagesProps {
  images: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center">
      
      <div
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden w-full max-w-md bg-white"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={mainImage}
          alt="Product"
          className={`w-full h-96 object-contain transition-transform duration-300 ${
            zoom ? "opacity-0" : "opacity-100"
          }`}
        />
        
        {zoom && (
          <div
            className="absolute inset-0 bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: "200%", 
            }}
          />
        )}
      </div>

    
      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 object-contain border rounded-md cursor-pointer transition-all duration-200 ${
              mainImage === img
                ? "ring-2 ring-gray-800"
                : "hover:ring-1 hover:ring-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
