
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MailScene } from './components/MailScene';
import { SelectionScene } from './components/SelectionScene';
import { CakeScene } from './components/CakeScene';
import { BlessingsScene } from './components/BlessingsScene';
import { GameScene, CharacterName } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from "@google/genai";

const SFX_URLS = {
  mail: 'https://cdn.pixabay.com/audio/2022/03/15/audio_556819446d.mp3',
  slice: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f949547d7c.mp3',
  blessing: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  pop: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb63058350.mp3'
};

const App: React.FC = () => {
  const [scene, setScene] = useState<GameScene>(GameScene.MAIL);
  const [selectedName, setSelectedName] = useState<CharacterName>('');
  const [isMuted, setIsMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Global sound effect player
  const playSound = useCallback((type: keyof typeof SFX_URLS) => {
    if (isMuted) return;
    const audio = new Audio(SFX_URLS[type]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('SFX play blocked', e));
  }, [isMuted]);

  // Gemini TTS helper
  const playGreeting = async (name: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Say cheerfully: Happy Birthday ${name}! Wishing you a day filled with joy, laughter, and lots of cake!`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Cheerful voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (err) {
      console.error("Failed to play personalized greeting:", err);
    }
  };

  // Helper functions for audio processing
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
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
  };

  const nextScene = () => {
    switch (scene) {
      case GameScene.MAIL:
        setScene(GameScene.SELECTION);
        break;
      case GameScene.SELECTION:
        setScene(GameScene.CAKE);
        break;
      case GameScene.CAKE:
        setScene(GameScene.BLESSINGS);
        break;
      default:
        break;
    }
  };

  const handleSelectName = (name: CharacterName) => {
    setSelectedName(name);
    // Start background music
    if (bgMusicRef.current) {
      bgMusicRef.current.play().catch(e => console.log("Auto-play blocked", e));
    }
    playSound('pop');
    // Play personalized greeting
    playGreeting(name);
    nextScene();
  };

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Background Music Element */}
      <audio 
        ref={bgMusicRef} 
        loop 
        src="https://cdn.pixabay.com/audio/2022/03/10/audio_c363943a58.mp3" 
      />

      {/* Music Toggle UI */}
      {selectedName && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 z-[100] bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all text-pink-600"
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-2xl`}></i>
        </button>
      )}

      <AnimatePresence mode="wait">
        {scene === GameScene.MAIL && (
          <motion.div
            key="mail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="w-full h-full flex items-center justify-center"
          >
            <MailScene onOpen={() => { playSound('mail'); nextScene(); }} />
          </motion.div>
        )}

        {scene === GameScene.SELECTION && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full"
          >
            <SelectionScene onSelect={handleSelectName} />
          </motion.div>
        )}

        {scene === GameScene.CAKE && (
          <motion.div
            key="cake"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full h-full"
          >
            <CakeScene birthdayName={selectedName} onNext={() => { playSound('pop'); nextScene(); }} onPlaySFX={playSound} />
          </motion.div>
        )}

        {scene === GameScene.BLESSINGS && (
          <motion.div
            key="blessings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <BlessingsScene birthdayName={selectedName} onPlaySFX={playSound} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]">
         <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
         <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default App;
