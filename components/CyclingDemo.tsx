import React, { useState } from 'react';
import { generateCyclingCommentary, generateCyclingAudio } from '../services/geminiService';
import { Timer, Send, Loader2, Bike, Volume2, Play } from 'lucide-react';

// Helper: Decode Base64 to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Decode raw PCM data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const CyclingDemo: React.FC = () => {
  const [name, setName] = useState('Irena');
  const [performance, setPerformance] = useState<'fast' | 'steady' | 'struggling'>('fast');
  const [commentary, setCommentary] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playAudio = async (base64: string) => {
    if (playing) return;
    try {
      setPlaying(true);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const audioBuffer = await decodeAudioData(decode(base64), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setPlaying(false);
      source.start();
    } catch (error) {
      console.error("Audio Playback Error:", error);
      setPlaying(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCommentary(null);
    setAudioBase64(null);
    
    // 1. Generate Text
    const text = await generateCyclingCommentary(name, performance);
    setCommentary(text);
    
    // 2. Generate Audio (Voice of Tissot)
    const audio = await generateCyclingAudio(text);
    if (audio) {
      setAudioBase64(audio);
      playAudio(audio);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 w-full max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
        <div className="bg-red-600 p-2 rounded-lg">
            <Bike size={24} className="text-white" />
        </div>
        <div>
            <h3 className="font-bold text-white">GenAI Race Commentary</h3>
            <p className="text-xs text-gray-400">Simulating personalized post-game assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rider Name</label>
            <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Performance Style</label>
            <select 
                value={performance}
                onChange={(e) => setPerformance(e.target.value as any)}
                className="w-full bg-black border border-neutral-700 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
            >
                <option value="fast">Sprinting / Breaking Away</option>
                <option value="steady">Pack Leader</option>
                <option value="struggling">Fighting the Climb</option>
            </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mb-6"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        {loading ? 'Consulting Tissot AI...' : 'Generate Personalized Moment'}
      </button>

      {commentary && (
        <div className="bg-gradient-to-r from-neutral-800 to-black p-4 rounded border-l-4 border-red-600 animate-fade-in relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-red-500 text-xs font-bold tracking-widest uppercase">Official Timekeeper</span>
                <Timer size={14} className="text-red-500" />
            </div>
            <p className="text-lg font-medium italic text-gray-200 mb-2">"{commentary}"</p>
            
            {audioBase64 && (
                <button 
                    onClick={() => playAudio(audioBase64)}
                    disabled={playing}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors mt-2"
                >
                    {playing ? <Volume2 size={16} className="animate-pulse" /> : <Play size={16} />}
                    {playing ? 'Playing Audio...' : 'Replay Commentary'}
                </button>
            )}
        </div>
      )}
    </div>
  );
};