
import React, { useState } from 'react';
import VoiceDictation from './VoiceDictation';
import { classifyComplaint } from '../services/geminiService';
import { Complaint } from '../types';
import { Language, translations } from '../translations';

interface ComplaintFormProps {
  onComplaintSubmitted: (complaint: Complaint) => void;
  language: Language;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onComplaintSubmitted, language }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const t = translations[language];

  const handleTranscript = (transcript: string) => {
    setText(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsClassifying(true);
    try {
      const classification = await classifyComplaint(text);
      const newComplaint: Complaint = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        text,
        status: 'Classified',
        timestamp: new Date(),
        classification
      };
      onComplaintSubmitted(newComplaint);
      setText('');
    } catch (error) {
      alert("Error. Please try again.");
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl p-12 md:p-16 border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-50"></div>
      
      <div className="mb-12 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{t.registerTitle}</h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">{t.registerSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-72 p-10 bg-slate-50 border border-slate-200 rounded-[3rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-900 placeholder:text-slate-400 text-xl leading-relaxed font-medium shadow-inner"
            required
          />
          <div className="absolute bottom-8 right-8 flex items-center gap-6">
             <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hidden sm:block">
               {text.length} Characters recorded
             </div>
             <VoiceDictation 
              onTranscript={handleTranscript} 
              isListening={isListening} 
              setIsListening={setIsListening}
              language={language}
             />
          </div>
        </div>

        <button
          type="submit"
          disabled={isClassifying || !text.trim()}
          className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 overflow-hidden relative group ${
            isClassifying || !text.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-slate-900 text-white hover:bg-black shadow-2xl shadow-slate-200 hover:translate-y-[-2px] active:scale-[0.98]'
          }`}
        >
          {isClassifying ? (
            <>
              <svg className="animate-spin h-7 w-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="uppercase tracking-[0.2em]">{t.analyzing}</span>
            </>
          ) : (
            <>
              <span className="uppercase tracking-[0.25em]">{t.submitBtn}</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {[
          { label: "AI Routing", desc: "Automated administrative triage.", color: "indigo" },
          { label: "Visual Proof", desc: "Before/After photo verification.", color: "emerald" },
          { label: "Data Integrity", desc: "End-to-end audit log per case.", color: "slate" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col border-l-2 border-slate-100 pl-8 py-2">
            <div className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] mb-3">{item.label}</div>
            <div className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-70">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintForm;
