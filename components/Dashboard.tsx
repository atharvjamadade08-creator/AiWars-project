
import React, { useState, useRef } from 'react';
import { Complaint } from '../types';
import { Language, translations } from '../translations';

interface DashboardProps {
  complaints: Complaint[];
  language: Language;
  onResolveComplaint: (id: string, afterPhotoUrl: string) => void;
}

const ProofUploadForm: React.FC<{ complaintId: string, onResolve: (id: string, url: string) => void }> = ({ complaintId, onResolve }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      // Create a temporary object URL to simulate an upload
      const objectUrl = URL.createObjectURL(file);
      onResolve(complaintId, objectUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-3">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
        ref={fileInputRef} 
      />
      
      {!file ? (
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all uppercase tracking-widest border border-indigo-100"
        >
          Select Proof Photo
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[9px] text-slate-500 font-bold uppercase truncate max-w-[120px]">{file.name}</p>
          <button 
            type="submit"
            className="text-[10px] font-black text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 uppercase tracking-widest"
          >
            Submit Resolution
          </button>
          <button 
            type="button"
            onClick={() => setFile(null)}
            className="text-[9px] text-rose-400 font-bold hover:text-rose-600 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ complaints, language, onResolveComplaint }) => {
  const t = translations[language];
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const processingCount = complaints.filter(c => c.status === 'Processing' || c.status === 'Classified').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{t.navDashboard}</h2>
          <p className="text-slate-500 text-lg font-medium">Historical data and resolution tracking for your account.</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: t.totalFiled, val: complaints.length, color: "indigo" },
            { label: t.inProgress, val: processingCount, color: "amber" },
            { label: t.resolved, val: resolvedCount, color: "emerald" }
          ].map((stat, i) => (
            <div key={i} className={`bg-${stat.color}-50 border border-${stat.color}-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-w-[140px] transition-transform hover:scale-105`}>
              <span className={`text-4xl font-black text-${stat.color}-600`}>{stat.val}</span>
              <span className={`text-[10px] font-bold text-${stat.color}-400 uppercase tracking-widest mt-2`}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <h3 className="text-2xl font-extrabold text-slate-800 px-2 tracking-tight">{t.evidenceTitle}</h3>
        
        {complaints.length === 0 ? (
          <div className="py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-slate-400 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="font-bold text-lg">{t.noData}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col transition-all hover:shadow-2xl hover:border-indigo-100 group">
                <div className="p-8 pb-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{t.id}: {complaint.id}</span>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{complaint.classification?.department}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{complaint.timestamp.toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Proof Photo Display */}
                  <div className="grid grid-cols-2 gap-6 relative">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Grievance Snapshot</p>
                       <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
                        <img 
                          src={complaint.beforePhotoUrl} 
                          alt="Before" 
                          className="w-full h-full object-cover filter grayscale"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest text-center">Resolution Proof</p>
                       <div className={`aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 ${complaint.status === 'Resolved' ? 'bg-slate-100' : 'bg-slate-50 flex flex-col items-center justify-center p-4'}`}>
                        {complaint.status === 'Resolved' ? (
                          <img 
                            src={complaint.afterPhotoUrl} 
                            alt="After" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center w-full">
                             <svg className="w-8 h-8 text-slate-200 mx-auto mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                             </svg>
                             <p className="text-[9px] text-slate-300 font-bold uppercase mb-2">Awaiting Upload</p>
                             
                             {/* New Upload Form for Officers */}
                             <ProofUploadForm 
                               complaintId={complaint.id} 
                               onResolve={onResolveComplaint} 
                             />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
                      {complaint.classification?.assignedOfficial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{complaint.classification?.assignedOfficial.name}</div>
                      <div className="text-xs font-semibold text-slate-500">{complaint.classification?.assignedOfficial.designation}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
