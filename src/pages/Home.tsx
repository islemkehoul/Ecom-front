import { useState, useEffect } from 'react';
import jacketImage from '../assets/jacket.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
      {/* Optional: Add keyframes inline (or use external CSS) */}
      <style >{`
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
      `}</style>

      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        {/* Text Content (Left Side) */}
        <div className="md:w-1/2 md:pr-8">
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 ${animate ? 'fade-in-left' : ''}`}>
            Welcome to Our Store
          </h1>
          <p className={`mt-4 text-lg text-gray-600 ${animate ? 'fade-in-up' : ''}`}>
            Discover our amazing products that are crafted to elevate your lifestyle. 
            High quality, great prices, and fast delivery.
          </p>
          <div className={`mt-6 ${animate ? 'fade-in-up' : ''}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        </div>

        {/* Image (Right Side) */}
        <div className={`md:w-1/2 mt-8 md:mt-0 ${animate ? 'scale-in' : ''}`}>
          <img
            src={jacketImage}
            alt="Hero section image"
            className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-xl mx-auto"
          />
        </div>
      </section>
    </>
  );
};

export default Home;