
import React from 'react';
import { Complaint } from '../types';
import { Language, translations } from '../translations';

interface ClassificationResultCardProps {
  complaint: Complaint;
  language: Language;
}

const ClassificationResultCard: React.FC<ClassificationResultCardProps> = ({ complaint, language }) => {
  const t = translations[language];
  const { classification } = complaint;
  if (!classification) return null;

  const urgencyColors = {
    High: 'bg-rose-100 text-rose-700 border-rose-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const levelColors = {
    "Municipal Level": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "State Level": "bg-purple-50 text-purple-700 border-purple-100",
    "Central Level": "bg-rose-50 text-rose-700 border-rose-100",
  };

  const estimatedDate = new Date(complaint.timestamp);
  estimatedDate.setDate(estimatedDate.getDate() + classification.estimatedTimelineDays);

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">{t.trackingTitle}</span>
          </div>
          <div className="font-mono text-base font-bold tracking-tight">{t.id}: {complaint.id}</div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${urgencyColors[classification.urgency]}`}>
          {classification.urgency}
        </span>
      </div>
      
      <div className="p-8 space-y-8">
        {/* Progress & Timeline Bar */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.timeline}</h4>
              <div className="text-2xl font-black text-slate-900">{classification.estimatedTimelineDays} {t.days}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t.progress}</div>
              <div className="text-2xl font-black text-indigo-600">{classification.initialProgress}%</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
              style={{ width: `${classification.initialProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-3">
             <div className="text-[9px] text-slate-400 font-bold uppercase">{complaint.timestamp.toLocaleDateString('en-IN')}</div>
             <div className="text-[9px] text-indigo-600 font-black uppercase tracking-wider">{t.est}: {estimatedDate.toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        {/* Assigned Official Card */}
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center text-white shrink-0 font-bold text-2xl shadow-xl shadow-indigo-100">
              {classification.assignedOfficial.name.charAt(0)}
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.15em] mb-1">{t.official}</div>
              <div className="text-lg font-bold text-slate-900 leading-tight mb-1">{classification.assignedOfficial.name}</div>
              <div className="text-xs font-semibold text-slate-500">{classification.assignedOfficial.designation}</div>
            </div>
            <a 
              href={`tel:${classification.assignedOfficial.phone}`}
              className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.474 5.474l.772-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-3xl border ${levelColors[classification.level as keyof typeof levelColors] || 'bg-slate-50'}`}>
            <div className="text-[9px] font-black uppercase opacity-60 mb-1.5 tracking-widest">{t.adminLevel}</div>
            <div className="text-sm font-bold text-slate-800">{classification.level}</div>
          </div>
          <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50">
            <div className="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">{t.targetDept}</div>
            <div className="text-sm font-bold text-slate-800">{classification.department}</div>
          </div>
        </div>

        {/* Reasoning / Intelligence */}
        <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
          <p className="text-sm text-slate-800 font-bold mb-2">{classification.summary}</p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium italic opacity-80">{classification.reasoning}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResultCard;
