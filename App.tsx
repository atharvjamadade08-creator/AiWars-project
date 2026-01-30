
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ComplaintForm from './components/ComplaintForm';
import ClassificationResultCard from './components/ClassificationResultCard';
import Dashboard from './components/Dashboard';
import Departments from './components/Departments';
import { Complaint, AdminLevel } from './types';
import { Language, translations } from './translations';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'register' | 'dashboard' | 'departments'>('register');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching complaints:', error);
      } else if (data) {
        // Map Supabase column names to frontend interface names
        const mappedData = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          beforePhotoUrl: item.before_photo_url,
          afterPhotoUrl: item.after_photo_url
        }));
        setComplaints(mappedData);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, []);

  const handleNewComplaint = async (complaint: Complaint) => {
    const beforePhotoUrl = 'https://images.unsplash.com/photo-1584462942733-685b306b9b3e?auto=format&fit=crop&q=80&w=800';
    
    const dbPayload = {
      id: complaint.id,
      text: complaint.text,
      status: 'Processing',
      timestamp: complaint.timestamp.toISOString(),
      classification: complaint.classification,
      before_photo_url: beforePhotoUrl
    };

    const { error } = await supabase.from('complaints').insert([dbPayload]);

    if (error) {
      console.error('Error saving new complaint:', error);
      alert('Failed to save to database. Check console.');
    } else {
      const complaintWithPhotos: Complaint = {
        ...complaint,
        status: 'Processing',
        beforePhotoUrl: beforePhotoUrl,
      };
      setComplaints(prev => [complaintWithPhotos, ...prev]);
      setActiveComplaintId(complaint.id);
    }
  };

  const handleResolveComplaint = async (id: string, afterPhotoUrl: string) => {
    const { error } = await supabase
      .from('complaints')
      .update({ 
        status: 'Resolved', 
        after_photo_url: afterPhotoUrl 
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update status in database.');
    } else {
      setComplaints(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'Resolved', afterPhotoUrl } : c
      ));
    }
  };

  const activeComplaint = complaints.find(c => c.id === activeComplaintId);

  const renderContent = () => {
    if (isLoading && complaints.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Government Servers...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'departments':
        return <Departments language={language} />;
      case 'dashboard':
        return <Dashboard complaints={complaints} language={language} onResolveComplaint={handleResolveComplaint} />;
      case 'register':
      default:
        return (
          <>
            {/* Expanded Hero Section */}
            <section className="mesh-bg text-white py-40 md:py-60 px-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)]"></div>
              </div>
              <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center relative z-10">
                <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 shadow-2xl mb-16 backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-700">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-100">{t.heroBadge}</span>
                </div>
                
                <h1 className="text-6xl md:text-[9.5rem] font-extrabold mb-16 tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                   {t.heroTitle.split(',').map((part, i) => (
                     <span 
                      key={i} 
                      className={i === 1 
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400 ml-12 md:ml-16 inline-block" 
                        : "inline-block"
                      }
                     >
                       {part}{i === 0 ? ',' : ''}
                     </span>
                   ))}
                </h1>
                
                <p className="text-xl md:text-3xl text-indigo-100/60 max-w-5xl font-medium leading-relaxed mb-28 opacity-90 animate-in fade-in duration-1000 delay-300">
                  {t.heroSubtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full px-6 animate-in fade-in zoom-in-95 duration-1000 delay-500">
                  {[
                    { title: t.step1Title, desc: t.step1Desc, icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                    { title: t.step2Title, desc: t.step2Desc, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                    { title: t.step3Title, desc: t.step3Desc, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
                  ].map((step, i) => (
                    <div key={i} className="group bg-white/5 border border-white/5 p-12 rounded-[4rem] backdrop-blur-xl text-left hover:bg-white/10 transition-all shadow-2xl hover:translate-y-[-8px] duration-500">
                      <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all duration-500">
                        <svg className="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.icon} />
                        </svg>
                      </div>
                      <h3 className="font-extrabold text-2xl mb-4 tracking-tight">{step.title}</h3>
                      <p className="text-lg text-indigo-100/40 leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 -mt-24 pb-48">
              <div className="flex flex-col gap-24">
                <div className="w-full">
                  <ComplaintForm onComplaintSubmitted={handleNewComplaint} language={language} />
                </div>

                <div className="w-full space-y-20">
                  {activeComplaint ? (
                    <div id="tracker-anchor" className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <div className="flex items-center justify-between mb-10 px-8">
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 mb-1">
                            <span className="relative flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                            </span>
                            {t.activeStatus}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">AI Processing Verified Official Assignment</p>
                        </div>
                        <button 
                          onClick={() => setActiveComplaintId(null)}
                          className="text-[11px] font-black text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-8 py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200/50 uppercase tracking-widest"
                        >
                          Lodge Another
                        </button>
                      </div>
                      <ClassificationResultCard complaint={activeComplaint} language={language} />
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-[5rem] p-40 text-center flex flex-col items-center justify-center gap-12 shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-700 relative z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="max-w-xl relative z-10">
                        <p className="font-black text-slate-900 text-3xl mb-4 uppercase tracking-[0.25em]">Tracker Offline</p>
                        <p className="text-xl font-medium text-slate-400 leading-relaxed italic">Submit a case to initiate AI auditing and resolution tracking.</p>
                      </div>
                    </div>
                  )}

                  {complaints.length > 0 && (
                    <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                      <div className="px-16 py-12 border-b border-slate-50 bg-slate-50/30 flex justify-between items-end">
                        <div>
                          <h3 className="font-black text-slate-900 text-2xl uppercase tracking-[0.2em] mb-3">Activity Register</h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] opacity-80">Unified historical grievance records</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">System Records</span>
                          <span className="bg-slate-900 text-white text-[12px] font-black px-10 py-3 rounded-2xl shadow-xl shadow-slate-200 uppercase tracking-widest">
                            {complaints.length} Total Cases
                          </span>
                        </div>
                      </div>
                      <div className="max-h-[800px] overflow-y-auto divide-y divide-slate-50">
                        {complaints.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setActiveComplaintId(c.id);
                              const trackerElement = document.getElementById('tracker-anchor');
                              if (trackerElement) {
                                trackerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`w-full px-16 py-12 text-left hover:bg-slate-50/50 transition-all flex items-center justify-between group ${activeComplaintId === c.id ? 'bg-indigo-50/50 border-l-[16px] border-indigo-600' : 'border-l-[16px] border-transparent'}`}
                          >
                            <div className="min-w-0 pr-16">
                              <div className="flex items-center gap-6 mb-5">
                                <span className={`w-4 h-4 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'}`}></span>
                                <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">File #{c.id}</span>
                                <span className="text-[12px] text-slate-300 font-black tracking-tighter uppercase opacity-80">• {c.timestamp.toLocaleDateString('en-IN')}</span>
                              </div>
                              <p className="text-3xl font-black text-slate-900 truncate mb-4 tracking-tight">{c.classification?.department}</p>
                              <p className="text-lg text-slate-400 font-bold truncate italic opacity-80 max-w-5xl leading-none">"{c.text}"</p>
                            </div>
                            <div className="shrink-0 transition-all transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                               <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                  </svg>
                               </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
