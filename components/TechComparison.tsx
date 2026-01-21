import React from 'react';
import { ArrowRight, Cpu, CloudLightning, Box, ScanLine } from 'lucide-react';

export const TechComparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-full">
      {/* Old Tech */}
      <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 h-full flex flex-col">
        <div className="mb-4 text-neutral-500">
            <Box size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-400 mb-2">2019-2023 Era</h3>
        <p className="text-sm text-gray-500 mb-4 font-mono">Hardware Heavy</p>
        <ul className="space-y-3 text-gray-400 text-sm flex-1">
            <li className="flex items-start gap-2">
                <span className="text-red-900 font-bold">×</span>
                Dependent on Kinect/Depth Sensors
            </li>
            <li className="flex items-start gap-2">
                <span className="text-red-900 font-bold">×</span>
                Expensive shipping & installation
            </li>
            <li className="flex items-start gap-2">
                <span className="text-red-900 font-bold">×</span>
                Complex on-site calibration
            </li>
        </ul>
      </div>

      {/* Transition */}
      <div className="flex flex-col items-center justify-center text-red-600">
        <ArrowRight size={48} className="hidden md:block" />
        <ArrowRight size={48} className="rotate-90 md:rotate-0 block md:hidden" />
        <span className="text-xs font-bold uppercase tracking-widest mt-2">Evolution</span>
      </div>

      {/* New Tech */}
      <div className="bg-gradient-to-br from-neutral-900 to-red-900/20 p-6 rounded-xl border border-red-600/30 h-full flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-20">
            <CloudLightning size={100} />
        </div>
        <div className="mb-4 text-red-500">
            <ScanLine size={40} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">2025 Standard</h3>
        <p className="text-sm text-red-400 mb-4 font-mono">Software Driven</p>
        <ul className="space-y-3 text-white text-sm flex-1">
            <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✓</span>
                <span><strong className="text-red-400">Computer Vision:</strong> Works with standard webcams. No Kinect.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✓</span>
                <span><strong className="text-red-400">GenAI Integration:</strong> Real-time personalized commentary & assets.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✓</span>
                <span><strong className="text-red-400">Web-Based:</strong> Instant deployment to any screen/tablet.</span>
            </li>
        </ul>
      </div>
    </div>
  );
};
