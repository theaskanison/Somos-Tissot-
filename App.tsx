import React, { useState, useRef } from 'react';
import { SlideLayout } from './components/SlideLayout';
import { TechComparison } from './components/TechComparison';
import { RetainerChart } from './components/RetainerChart';
import { CyclingDemo } from './components/CyclingDemo';
import { Activity, Zap, Users, Clock, Award, Timer, Flag, Hand, PlayCircle, RotateCcw, Check } from 'lucide-react';

enum Slide {
  INTRO = 0,
  RELATIONSHIP = 1,
  TECH_SHIFT = 2,
  CONCEPT_CYCLING = 3,
  CONCEPT_NBA = 4,
  CONCEPT_MOTOGP = 5,
  BUSINESS_MODEL = 6,
}

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(Slide.INTRO);
  const [proposalSent, setProposalSent] = useState(false);
  
  // State for varying the success message
  const [successState, setSuccessState] = useState({
      buttonText: "Request Initiated",
      title: "Proposal Logged",
      subtitle: "Global engagement initiated"
  });

  // --- Concept 2: NBA State & Refs ---
  const [nbaTime, setNbaTime] = useState(24.0);
  const [nbaState, setNbaState] = useState<'idle' | 'running' | 'stopped'>('idle');
  const [nbaResult, setNbaResult] = useState<string>('');
  const nbaIntervalRef = useRef<number | null>(null);

  // --- Concept 3: MotoGP State & Refs ---
  const [motoState, setMotoState] = useState<'idle' | 'holding' | 'ready' | 'finished' | 'false_start'>('idle');
  const [lightsCount, setLightsCount] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const motoIntervalRef = useRef<number | null>(null);
  const motoStartTimeRef = useRef<number>(0);
  const motoDropTimeoutRef = useRef<number | null>(null);

  const nextSlide = () => {
    if (currentSlide < Slide.BUSINESS_MODEL) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > Slide.INTRO) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // --- NBA Logic ---
  const handleNbaAction = () => {
    if (nbaState === 'idle') {
      // Start Countdown
      setNbaState('running');
      setNbaResult('');
      setNbaTime(24.0);
      
      const startTime = Date.now();
      const duration = 24000; // 24 seconds

      if (nbaIntervalRef.current) clearInterval(nbaIntervalRef.current);
      
      nbaIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, (duration - elapsed) / 1000);
        
        setNbaTime(remaining);

        if (remaining <= 0) {
          if (nbaIntervalRef.current) clearInterval(nbaIntervalRef.current);
          setNbaState('stopped');
          setNbaResult('VIOLATION');
        }
      }, 50); // High frequency update for smooth UI
    } else if (nbaState === 'running') {
      // Stop Clock
      if (nbaIntervalRef.current) clearInterval(nbaIntervalRef.current);
      setNbaState('stopped');
      
      if (nbaTime <= 0) {
        setNbaResult('VIOLATION');
      } else if (nbaTime < 2.0) {
        setNbaResult('CLUTCH');
      } else {
        setNbaResult('RUSHED');
      }
    } else {
      // Reset
      setNbaState('idle');
      setNbaTime(24.0);
      setNbaResult('');
    }
  };

  // --- MotoGP Logic ---
  const startMotoSequence = () => {
    if (motoState !== 'idle' && motoState !== 'finished' && motoState !== 'false_start') return;
    
    setMotoState('holding');
    setLightsCount(0);
    setReactionTime(0);

    let count = 0;
    if (motoIntervalRef.current) clearInterval(motoIntervalRef.current);
    if (motoDropTimeoutRef.current) clearTimeout(motoDropTimeoutRef.current);

    // Lights turn on one by one
    motoIntervalRef.current = window.setInterval(() => {
      count++;
      setLightsCount(count);
      if (count >= 5) {
        if (motoIntervalRef.current) clearInterval(motoIntervalRef.current);
        setMotoState('ready');
        
        // Random drop time between 1s and 3.5s
        const randomDelay = 1000 + Math.random() * 2500;
        motoDropTimeoutRef.current = window.setTimeout(() => {
          setLightsCount(0); // Lights out
          motoStartTimeRef.current = performance.now();
        }, randomDelay);
      }
    }, 1000);
  };

  const releaseMotoClutch = () => {
    if (motoState === 'holding') {
       // Released while lights were filling up
       if (motoIntervalRef.current) clearInterval(motoIntervalRef.current);
       if (motoDropTimeoutRef.current) clearTimeout(motoDropTimeoutRef.current);
       setMotoState('false_start');
    } else if (motoState === 'ready') {
       if (lightsCount === 5) {
         // Released while all lights on (before drop)
         if (motoDropTimeoutRef.current) clearTimeout(motoDropTimeoutRef.current);
         setMotoState('false_start');
       } else if (lightsCount === 0) {
         // Good Release
         const endTime = performance.now();
         setReactionTime((endTime - motoStartTimeRef.current) / 1000);
         setMotoState('finished');
       }
    }
  };

  const handleDiscoveryClick = () => {
    const variations = [
      {
        buttonText: "Request Initiated",
        title: "Proposal Logged",
        subtitle: "Global engagement initiated"
      },
      {
        buttonText: "Strategy Active",
        title: "Priority Confirmed",
        subtitle: "Tissot strategic tier unlocked"
      },
      {
        buttonText: "Discovery Live",
        title: "Phase 1 Initiated",
        subtitle: "SOW generation sequence started"
      },
      {
        buttonText: "Concept Locked",
        title: "Slot Reserved",
        subtitle: "Production resources allocated"
      }
    ];
    
    // Pick a random message to make the prototype feel 'live'
    const selected = variations[Math.floor(Math.random() * variations.length)];
    setSuccessState(selected);
    setProposalSent(true);
  };

  return (
    <div className="w-screen h-screen bg-black text-white relative overflow-hidden">
      
      {/* 0. INTRO SLIDE */}
      <SlideLayout 
        isActive={currentSlide === Slide.INTRO} 
        onNext={nextSlide} 
        onPrev={prevSlide}
        hideControls={false}
        bgImage="https://picsum.photos/seed/tissot1/1920/1080"
      >
        <div className="flex flex-col justify-center h-full pb-20">
            <h3 className="text-red-600 font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">Store Design & Visual Merchandising</h3>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
                Next Gen<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Engagement</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl border-l-2 border-white pl-6">
                Reimagining Tissot's experiential in-store engagement through scalable technology and strategic discovery.
            </p>
            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                <span>PREPARED FOR IRENA MARICIC MASNJAK</span>
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                <span>SOMOS CREATIVE</span>
            </div>
        </div>
      </SlideLayout>

      {/* 1. RELATIONSHIP & STRATEGY */}
      <SlideLayout 
        title="Strategic Continuity"
        subtitle="5+ Years of Innovation: From Buzzer Beater to Future Formats"
        isActive={currentSlide === Slide.RELATIONSHIP} 
        onNext={nextSlide} 
        onPrev={prevSlide}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="space-y-8">
                <div className="bg-neutral-900/50 p-6 border-l-2 border-red-600">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Award className="text-red-600" />
                        Proven Track Record
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Somos has delivered for Tissot since 2019, from the <strong>Buzzer Beater</strong> in flagship stores to the <strong>Dame Lillard</strong> experience. We bridge the gap between experience and engagement.
                    </p>
                </div>
                
                <div className="bg-neutral-900/50 p-6 border-l-2 border-white">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Users className="text-white" />
                        2025 Audience Strategy
                    </h3>
                    <p className="text-gray-400 text-sm">
                        With the <strong>NBA In-Season Tournament</strong> and new <strong>MotoGP Sprint Races</strong>, the audience is younger and faster. Driving experiential in-store engagement means creating moments that match this intensity.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black border border-neutral-800 p-4 flex flex-col items-center justify-center text-center hover:border-red-600 transition-colors">
                    <img src="https://picsum.photos/seed/nba/200/200" alt="NBA" className="w-12 h-12 rounded-full mb-3 grayscale opacity-70" />
                    <span className="font-bold text-sm">NBA</span>
                    <span className="text-xs text-gray-500 mt-1">Shot Clock</span>
                </div>
                <div className="bg-black border border-neutral-800 p-4 flex flex-col items-center justify-center text-center hover:border-red-600 transition-colors">
                    <img src="https://picsum.photos/seed/cycling/200/200" alt="UCI" className="w-12 h-12 rounded-full mb-3 grayscale opacity-70" />
                    <span className="font-bold text-sm">UCI / TDF</span>
                    <span className="text-xs text-gray-500 mt-1">Official Timer</span>
                </div>
                <div className="bg-black border border-neutral-800 p-4 flex flex-col items-center justify-center text-center hover:border-red-600 transition-colors">
                    <img src="https://picsum.photos/seed/motogp/200/200" alt="MotoGP" className="w-12 h-12 rounded-full mb-3 grayscale opacity-70" />
                    <span className="font-bold text-sm">MotoGP</span>
                    <span className="text-xs text-gray-500 mt-1">Sprint Races</span>
                </div>
                <div className="bg-red-900/20 border border-red-600/50 p-4 flex flex-col items-center justify-center text-center">
                    <Zap className="w-8 h-8 text-red-600 mb-3" />
                    <span className="font-bold text-sm text-red-500">NEXT GEN</span>
                    <span className="text-xs text-red-900/50 mt-1">AI Powered</span>
                </div>
            </div>
        </div>
      </SlideLayout>

      {/* 2. TECH EVOLUTION */}
      <SlideLayout 
        title="The Tech Shift"
        subtitle="Moving from expensive hardware to scalable software"
        isActive={currentSlide === Slide.TECH_SHIFT} 
        onNext={nextSlide} 
        onPrev={prevSlide}
      >
        <div className="h-[400px] mt-8">
            <TechComparison />
        </div>
        <div className="mt-8 bg-neutral-900 p-4 rounded text-center border border-neutral-800">
            <p className="text-gray-300">
                <span className="font-bold text-white">Impact:</span> Reduced setup time, lower budget per unit, and higher global reach for pop-up stores.
            </p>
        </div>
      </SlideLayout>

      {/* 3. CONCEPT 1: CYCLING AI */}
      <SlideLayout 
        title="Concept 1: Pro Cycling Experience"
        subtitle="Modernizing the Ride with Computer Vision & GenAI"
        isActive={currentSlide === Slide.CONCEPT_CYCLING} 
        onNext={nextSlide} 
        onPrev={prevSlide}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Experience</h3>
                    <p className="text-gray-400 leading-relaxed">
                        A screen acts as a "mirror." Users stand in front (or simple stationary bike). 
                        <strong> Computer Vision</strong> tracks their posture. If they lean to get aero, their avatar speeds up.
                    </p>
                </div>
                
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Tissot Edge</h3>
                    <p className="text-gray-400 leading-relaxed">
                        It's not just a game. It's about data. At the finish line, <strong>GenAI</strong> analyzes their performance and generates a personalized "Official Commentator" video clip they can share instantly.
                    </p>
                </div>

                <div className="flex gap-4">
                   <div className="px-4 py-2 bg-neutral-800 rounded text-xs font-mono text-red-500">MediaPipe Vision</div>
                   <div className="px-4 py-2 bg-neutral-800 rounded text-xs font-mono text-red-500">Gemini AI</div>
                   <div className="px-4 py-2 bg-neutral-800 rounded text-xs font-mono text-red-500">WebGL</div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                {/* Interactive Demo Widget */}
                <CyclingDemo />
            </div>
        </div>
      </SlideLayout>

      {/* 4. CONCEPT 2: NBA SHOT CLOCK */}
      <SlideLayout 
        title="Concept 2: The Glass Clock Challenge"
        subtitle="Authentic NBA Shot Clock Integration"
        isActive={currentSlide === Slide.CONCEPT_NBA} 
        onNext={nextSlide} 
        onPrev={prevSlide}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            <div className="relative flex flex-col items-center justify-center h-full min-h-[400px]">
                {/* Interactive Glass Shot Clock */}
                <div 
                    onClick={handleNbaAction}
                    className="w-80 h-80 rounded-full bg-neutral-900/40 backdrop-blur-sm flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-transform select-none group overflow-hidden shadow-2xl"
                >
                    {/* Authentic LED Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 320 320">
                         {/* Background Track */}
                        <circle cx="160" cy="160" r="156" fill="none" stroke="#262626" strokeWidth="4" />
                        
                        {/* Progress LED Ring */}
                        {/* Circumference = 2 * pi * 156 ≈ 980 */}
                        <circle 
                            cx="160" cy="160" r="156" 
                            fill="none" 
                            stroke="#DC2626" 
                            strokeWidth="8"
                            strokeDasharray="980"
                            strokeDashoffset={980 - (980 * nbaTime / 24)}
                            strokeLinecap="round"
                            className={`transition-all duration-100 linear ${nbaState === 'idle' ? 'opacity-30' : 'opacity-100 shadow-[0_0_15px_rgba(220,38,38,0.8)]'}`}
                        />
                    </svg>

                    {/* Main Timer Display */}
                    <div className="z-10 text-[120px] leading-none font-bold font-mono tracking-tighter text-red-600 drop-shadow-[0_0_20px_rgba(204,0,0,0.6)]">
                        {nbaTime.toFixed(1)}
                    </div>
                    
                    <div className="z-10 absolute bottom-12 text-white/50 text-xs font-bold tracking-widest uppercase">
                        Tissot Official
                    </div>
                </div>
                
                {/* Feedback / Call to Action */}
                <div className="h-16 mt-6 flex items-center justify-center">
                    {nbaResult && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                             <span className={`text-3xl font-black uppercase tracking-widest mb-1 ${nbaResult === 'CLUTCH' ? 'text-green-500 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]' : 'text-red-500'}`}>
                                {nbaResult}
                            </span>
                            <button 
                                onClick={() => { setNbaState('idle'); setNbaTime(24.0); setNbaResult(''); }}
                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white uppercase tracking-widest"
                            >
                                <RotateCcw size={12} /> Reset
                            </button>
                        </div>
                    )}
                     {!nbaResult && nbaState === 'idle' && (
                        <div className="flex flex-col items-center animate-pulse text-gray-500">
                            <span className="text-sm font-bold tracking-widest">TAP CLOCK TO START</span>
                            <span className="text-xs">Stop exactly at 0.0s</span>
                        </div>
                    )}
                    {!nbaResult && nbaState === 'running' && (
                        <span className="text-red-500 font-bold tracking-widest animate-pulse">STOP THE CLOCK!</span>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-4">The Innovation</h3>
                    <p className="text-gray-400 leading-relaxed">
                        We move away from generic screens to the **Glass Circular Shot Clock**. This concept uses a transparent OLED or glass overlay to replicate the exact on-court hardware used in the 2025 NBA season.
                    </p>
                </div>

                <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                        <div className="bg-neutral-800 p-3 rounded-full">
                            <Clock className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Authentic Hardware</h4>
                            <p className="text-gray-400 text-sm">The circular form factor is unmistakable. It links the store directly to the NBA arena floor.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="bg-neutral-800 p-3 rounded-full">
                            <Activity className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Pressure Training</h4>
                            <p className="text-gray-400 text-sm">"The Clutch Shot" isn't just a timer. It's a reaction test. Stop the clock before the buzzer, but drain the clock as much as possible.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </SlideLayout>

      {/* 5. CONCEPT 3: MOTOGP SPRINT */}
      <SlideLayout 
        title="Concept 3: MotoGP Sprint"
        subtitle="The Perfect Start: Lights Out Challenge"
        isActive={currentSlide === Slide.CONCEPT_MOTOGP} 
        onNext={nextSlide} 
        onPrev={prevSlide}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            <div className="space-y-8 order-2 md:order-1">
                 <div>
                    <h3 className="text-3xl font-bold text-white mb-4">The Context</h3>
                    <p className="text-gray-400 leading-relaxed">
                        MotoGP Sprint races are won at the start. The **Lights Out** moment is the most tension-filled second in motorsports. Tissot owns this moment.
                    </p>
                </div>

                <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                        <div className="bg-neutral-800 p-3 rounded-full">
                            <Hand className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Clutch Control</h4>
                            <p className="text-gray-400 text-sm">UX mimics the bike: Hold the "Clutch" (button) to stage. Release exactly when the lights die.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="bg-neutral-800 p-3 rounded-full">
                            <Flag className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Pro Benchmarking</h4>
                            <p className="text-gray-400 text-sm">Instant comparison to pole-position reaction times (e.g., 0.180s). Gamifies the "Swiss Precision" narrative.</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="relative flex flex-col items-center justify-center h-full min-h-[400px] bg-neutral-900/50 rounded-xl border border-neutral-800 order-1 md:order-2 p-8 select-none">
                 
                 {/* Lights Container */}
                 <div className="bg-black p-4 rounded-xl border-4 border-gray-800 mb-12 shadow-2xl relative">
                     <div className="flex gap-4">
                         {[1,2,3,4,5].map(i => (
                             <div 
                                key={i} 
                                className={`w-12 h-12 rounded-full border-4 border-gray-800 transition-all duration-75 
                                    ${(motoState === 'ready' && lightsCount === 0) ? 'bg-black' : // Lights out (Go!)
                                      i <= lightsCount ? 'bg-red-600 shadow-[0_0_25px_rgba(255,0,0,1)]' : 'bg-neutral-900'}` // Lights On
                                }
                             ></div>
                         ))}
                     </div>
                 </div>
                 
                 {/* Interaction Zone */}
                 <div className="text-center w-full min-h-[140px] flex items-center justify-center">
                     {motoState === 'finished' ? (
                         <div className="animate-in zoom-in duration-300">
                             <div className="text-6xl font-black font-mono text-white mb-2">{reactionTime.toFixed(3)}s</div>
                             <div className="text-red-600 font-bold uppercase tracking-widest text-sm">Reaction Time</div>
                             <div className="text-xs text-gray-500 mt-2">vs. Jorge Martin (0.192s)</div>
                             <button 
                                onClick={() => setMotoState('idle')}
                                className="mt-6 flex items-center justify-center gap-2 mx-auto text-sm text-gray-400 hover:text-white uppercase tracking-widest"
                             >
                                 <RotateCcw size={14} /> Try Again
                             </button>
                         </div>
                     ) : motoState === 'false_start' ? (
                        <div className="animate-pulse">
                            <div className="text-4xl font-black font-mono text-red-600 mb-2">JUMP START</div>
                            <button 
                               onClick={() => setMotoState('idle')}
                               className="mt-4 flex items-center justify-center gap-2 mx-auto text-sm text-gray-400 hover:text-white uppercase tracking-widest"
                            >
                               <RotateCcw size={14} /> Reset
                            </button>
                        </div>
                     ) : (
                         <button
                            onMouseDown={startMotoSequence}
                            onMouseUp={releaseMotoClutch}
                            onTouchStart={startMotoSequence}
                            onTouchEnd={releaseMotoClutch}
                            className={`w-32 h-32 rounded-full border-4 transition-all duration-100 flex items-center justify-center shadow-lg
                                ${motoState === 'holding' || motoState === 'ready' 
                                    ? 'bg-red-900/80 border-red-600 scale-95 shadow-[0_0_30px_rgba(204,0,0,0.4)]' 
                                    : 'bg-neutral-800 border-neutral-600 hover:bg-neutral-700'
                                }`}
                         >
                             <div className="text-center pointer-events-none">
                                 <PlayCircle size={32} className={`mx-auto mb-1 ${motoState === 'holding' || motoState === 'ready' ? 'text-white' : 'text-gray-400'}`} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                                     {motoState === 'idle' ? 'Hold Clutch' : 'Wait...'}
                                 </span>
                             </div>
                         </button>
                     )}
                 </div>
            </div>
        </div>
      </SlideLayout>

       {/* 6. BUSINESS MODEL */}
       <SlideLayout 
        title="Managed Risk Profile"
        subtitle="A Strategic Approach to Innovation"
        isActive={currentSlide === Slide.BUSINESS_MODEL} 
        onNext={nextSlide} 
        onPrev={prevSlide}
        hideControls={true} // Last slide
      >
        <div className="h-[400px] mt-8">
            <RetainerChart />
        </div>
        <div className="mt-12 flex flex-col items-center justify-center">
            <button 
                onClick={handleDiscoveryClick}
                disabled={proposalSent}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(204,0,0,0.4)] flex items-center gap-2
                    ${proposalSent 
                        ? 'bg-green-600 text-white cursor-default scale-100' 
                        : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95'
                    }`}
            >
                {proposalSent ? (
                    <>{successState.buttonText} <Check size={20} /></>
                ) : (
                    <>Start Discovery Phase <ArrowRight size={20} /></>
                )}
            </button>
            {proposalSent && (
                <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-green-500 font-bold mb-1">{successState.title}</p>
                    <p className="text-gray-400 text-xs">{successState.subtitle}</p>
                </div>
            )}
        </div>
      </SlideLayout>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'bg-red-600 w-8' : 'bg-neutral-600 hover:bg-white'
            }`}
          />
        ))}
      </div>
      
    </div>
  );
};

// Helper component for the last slide
function ArrowRight({ size }: { size: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

export default App;