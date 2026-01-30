
import React from 'react';
import { translations, Language } from '../translations';

interface NavbarProps {
  currentView: 'register' | 'dashboard' | 'departments';
  onViewChange: (view: 'register' | 'dashboard' | 'departments') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onViewChange('register')}>
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-200 transition-transform group-hover:scale-105">
              JS
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">{t.brandName}</h1>
              <p className="text-[9px] uppercase font-black tracking-[0.25em] text-indigo-600 mt-1.5">{t.portalSubtitle}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <div className="flex items-center space-x-8">
              {[
                { id: 'register', label: t.navLodge },
                { id: 'dashboard', label: t.navDashboard },
                { id: 'departments', label: t.navDepartments }
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => onViewChange(link.id as any)}
                  className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all relative py-2 ${
                    currentView === link.id 
                    ? 'text-indigo-600' 
                    : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {currentView === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Language & Profile */}
            <div className="flex items-center gap-6 pl-8 border-l border-slate-100">
              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => onLanguageChange('ta')}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${language === 'ta' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  தமிழ்
                </button>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-black text-slate-900 leading-tight">{t.citizenName}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.verifiedCitizen}</p>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Profile" 
                    className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
