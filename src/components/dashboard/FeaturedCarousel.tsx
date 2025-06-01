
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface FeaturedCarouselProps {
  products: Product[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = products.slice(0, 5); // Show up to 5 featured products

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featured.length);
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, featured.length]);


  if (featured.length === 0) {
    return <p className="text-center text-muted-foreground">No hay productos destacados para mostrar.</p>;
  }
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featured.length) % featured.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featured.length);
  };


  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="relative h-64 md:h-80"> {/* Adjusted height */}
            {featured.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={product.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint="product groceries"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                  <p className="text-lg text-accent">Bs. {product.priceBs.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {featured.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 hover:bg-background text-foreground"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 hover:bg-background text-foreground"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {featured.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-primary" : "bg-gray-300"}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedCarousel;
