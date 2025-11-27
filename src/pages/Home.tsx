import { useState, useEffect } from 'react';
import Box from '../assets/4440890.jpg';
import woman from '../assets/7552577.jpg'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Your carousel images array - add more images as needed
  const carouselImages = [
    Box,
    woman
  ];

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 2000); // Change slide every 2 seconds
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Optional: Add keyframes inline (or use external CSS) */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(37, 99, 235, 0);
            transform: scale(1.05);
          }
        }

        @keyframes pointDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        .fade-in-left {
          opacity: 0;
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out 0.3s forwards;
        }

        .scale-in {
          opacity: 0;
          animation: scaleIn 0.7s ease-out 0.4s forwards;
        }

        .pulse-glow {
          animation: pulseGlow 2s ease-in-out 1s 3;
        }

        .pointer-arrow {
          animation: pointDown 1s ease-in-out 1s infinite;
        }
      `}</style>

      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Text Content (Left Side in LTR, Right Side in RTL) */}
        <div className="md:w-1/2 md:pr-8 md:rtl:pr-0 md:rtl:pl-8">
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 ${animate ? 'fade-in-left' : ''}`}>
            {t("home.welcome")}
          </h1>
          <p className={`mt-4 text-lg text-gray-600 ${animate ? 'fade-in-up' : ''}`}>
            {t("home.description")}
          </p>
          <div className={`mt-6 relative ${animate ? 'fade-in-up' : ''}`}>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 pulse-glow cursor-pointer"
              onClick={() => navigate('/products')}
            >
              {t("home.Shop")}
            </button>
            
          </div>
        </div>

        {/* Carousel (Right Side in LTR, Left Side in RTL) */}
        <div className={`md:w-1/2 mt-8 md:mt-0 ${animate ? 'scale-in' : ''}`}>
          <div className="relative w-full h-80 md:h-96 rounded-2xl shadow-xl overflow-hidden group">
            {/* Images */}
            <div className="relative w-full h-full">
              {carouselImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows - only show if more than 1 image */}
            {carouselImages.length > 1 && (
              <>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;