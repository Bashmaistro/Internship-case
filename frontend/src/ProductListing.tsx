import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './assets/fonts/fonts.css';

interface Product {
  name: string;
  price: number;
  popularityScore: number;
  images: Record<string, string>;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetals, setSelectedMetals] = useState<Record<number, string>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://internship-case-dice.onrender.com/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data: Product[] = await response.json();

      setProducts(data);

      const defaultMetals: Record<number, string> = {};
      data.forEach((_, i) => {
        defaultMetals[i] = 'yellow';
      });
      setSelectedMetals(defaultMetals);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' });
  };

  const handleMetalChange = (index: number, metal: string) => {
    setSelectedMetals(prev => ({ ...prev, [index]: metal }));
  };

  const ProductCard: React.FC<{
    product: Product;
    selectedMetal: string;
    onMetalChange: (metal: string) => void;
  }> = ({ product, selectedMetal, onMetalChange }) => {
    const [imageError, setImageError] = useState(false);
    const metalColors: Record<string, string> = {
      yellow: '#E6CA97',
      white: '#D9D9D9',
      rose: '#E1A4A9',
    };

    const rating = product.popularityScore * 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div
        className="bg-transparent rounded-2xl p-4 w-[360px] flex-shrink-0 flex flex-col items-center"
        style={{ minHeight: 'auto' }}
      >
        <div className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-gray-100">
          {!imageError && product.images && product.images[selectedMetal] ? (
            <img
              src={product.images[selectedMetal]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-yellow-300 rounded-full"></div>
            </div>
          )}
        </div>

        <div className="text-left w-full mt-5">
          <h3 style={{ fontFamily: 'Montserrat-Medium', fontSize: '16px' }}>{product.name}</h3>
          <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '16px' }}>
            ${product.price.toFixed(2)} USD
          </div>

          <div className="flex gap-3 mt-5">
            {Object.entries(metalColors).map(([metal, color]) => (
              <button
                key={metal}
                onClick={() => onMetalChange(metal)}
                className={`w-5 h-5 rounded-full border ${
                  selectedMetal === metal ? 'ring-2 ring-offset-2 ring-black/20' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`${metal} gold color`}
              />
            ))}
          </div>

          <div className="mt-3" style={{ fontFamily: 'Avenir-Book', fontSize: '13px' }}>
            {selectedMetal.charAt(0).toUpperCase() + selectedMetal.slice(1)} Gold
          </div>

          <div className="mt-3" style={{ fontFamily: 'Avenir-Book', fontSize: '15px' }}>
            <div className="flex items-center gap-1">
              {[...Array(fullStars)].map((_, i) => (
                <Star
                  key={`full-${i}`}
                  className="w-4 h-4"
                  style={{ color: '#E6CA97', fill: '#E6CA97' }}
                />
              ))}
              {hasHalfStar && (
                <svg
                  key="half-star"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  style={{ color: '#E6CA97' }}
                >
                  <defs>
                    <linearGradient id="halfGradient">
                      <stop offset="50%" stopColor="#E6CA97" />
                      <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#halfGradient)"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
              ))}
              <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}/5</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[95vw] mx-auto px-4">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'Avenir-Book', fontSize: '45px' }}>Product List</h1>
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="relative bg-transparent rounded-lg p-4">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl"
            style={{ marginLeft: '-50px' }}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl"
            style={{ marginRight: '-50px' }}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-20 overflow-x-auto scroll-smooth py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 bg-transparent"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                selectedMetal={selectedMetals[index] || 'yellow'}
                onMetalChange={(metal) => handleMetalChange(index, metal)}
              />
            ))}
          </div>
        </div>

        <style>{`
          ::-webkit-scrollbar {
            height: 15px;
          }
          ::-webkit-scrollbar-track {
            background: #a3a3a3;
            border-radius: 9999px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #b7b7b7; 
            border-radius: 9999px;
            border: 3px solid transparent;
            background-clip: content-box;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductListing;
