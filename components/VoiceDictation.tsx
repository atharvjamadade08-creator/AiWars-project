
import React, { useState, useEffect } from 'react';
import { Language, translations } from '../translations';

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  language: Language;
}

const VoiceDictation: React.FC<VoiceDictationProps> = ({ onTranscript, isListening, setIsListening, language }) => {
  const [recognition, setRecognition] = useState<any>(null);
  const t = translations[language];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      // Use ta-IN for Tamil or en-IN for English
      recognizer.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognizer.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            onTranscript(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recognizer);
    }
  }, [onTranscript, setIsListening, language]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) return <p className="text-[10px] text-red-500 max-w-[100px] leading-tight">Browser speech support required.</p>;

  return (
    <button
      onClick={toggleListening}
      type="button"
      className={`p-3 rounded-full transition-all flex items-center gap-2 ${
        isListening 
        ? 'bg-red-100 text-red-600 animate-pulse' 
        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm'
      }`}
      title={isListening ? "Stop" : t.voiceTooltip}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isListening && <span className="text-sm font-semibold">{t.voiceListening}</span>}
    </button>
  );
};

export default VoiceDictation;
