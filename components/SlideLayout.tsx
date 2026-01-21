import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SlideLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  bgImage?: string;
  hideControls?: boolean;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({
  children,
  title,
  subtitle,
  isActive,
  onNext,
  onPrev,
  bgImage,
  hideControls = false,
}) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 transition-opacity duration-500 ease-in-out">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        {bgImage ? (
           <img src={bgImage} alt="background" className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black" />
        )}
      </div>

      {/* T+ Logo Watermark */}
      <div className="absolute top-8 left-8 z-20">
         <div className="w-10 h-10 bg-red-600 flex items-center justify-center text-white font-bold text-xl select-none">
            T+
         </div>
         <span className="text-white font-bold tracking-widest text-xs mt-1 block">SOMOS</span>
      </div>

      {/* Content */}
      <div className="z-20 w-full max-w-6xl h-full flex flex-col">
        {title && (
            <div className="mb-8 border-l-4 border-red-600 pl-6">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">{title}</h1>
                {subtitle && <h2 className="text-xl md:text-2xl font-light text-gray-300 mt-2">{subtitle}</h2>}
            </div>
        )}
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {children}
        </div>
      </div>

      {/* Controls */}
      {!hideControls && (
        <div className="absolute bottom-8 right-8 z-30 flex space-x-4">
          <button 
            onClick={onPrev}
            className="p-3 border border-white/20 rounded-full hover:bg-white/10 hover:border-white transition-all text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={onNext}
            className="p-3 bg-red-600 border border-red-600 rounded-full hover:bg-red-700 transition-all text-white shadow-[0_0_15px_rgba(204,0,0,0.5)]"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
