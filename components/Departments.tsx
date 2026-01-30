
import React from 'react';
import { Language, translations } from '../translations';

interface DeptItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const getDepartments = (t: any): DeptItem[] => [
  { 
    id: 'banking', 
    name: 'Financial Services (Banking Division)', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3l9-7z"/>
      </svg>
    )
  },
  { 
    id: 'railways', 
    name: 'Ministry of Railways', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="16" rx="2"/>
        <path d="M4 11h16M12 3v16M8 19l-2 3M16 19l2 3"/>
        <circle cx="8" cy="15" r="1"/>
        <circle cx="16" cy="15" r="1"/>
      </svg>
    )
  },
  { 
    id: 'tax', 
    name: 'Central Board of Direct Taxes (Income Tax)', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  { 
    id: 'posts', 
    name: 'Department of Posts', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8z"/>
        <polyline points="15,9 18,9 18,11"/>
        <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    )
  },
  { 
    id: 'telecom', 
    name: 'Telecommunications', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.59 16.11a6 6 0 0 1 6.82 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    )
  },
  { 
    id: 'health', 
    name: 'Health & Family Welfare', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    )
  },
  { 
    id: 'defense', 
    name: 'Ministry of Defence', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M12 8v4"/>
        <path d="M12 16h.01"/>
      </svg>
    )
  },
  { 
    id: 'urban', 
    name: 'Housing and Urban Affairs', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v1h18V7M5 8v13M19 8v13M9 8v13M15 8v13M12 3l8 5H4l8-5z"/>
      </svg>
    )
  },
  { 
    id: 'road', 
    name: 'Road Transport and Highways', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <line x1="12" y1="11" x2="12" y2="22"/>
      </svg>
    )
  },
  { 
    id: 'education', 
    name: 'Ministry of Education', 
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  }
];

const Departments: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const depts = getDepartments(t);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t.deptHeader}
        </h2>
        <p className="text-gray-500 mt-3 text-lg">{t.deptSubtitle}</p>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto mt-6 rounded-full shadow-sm shadow-indigo-100"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {depts.map((dept) => (
          <div 
            key={dept.id} 
            className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden text-center h-full active:scale-[0.98]"
          >
            <div className="flex-grow flex items-center justify-center p-10 text-gray-400 group-hover:text-indigo-600 transition-colors bg-white">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {dept.icon}
              </div>
            </div>
            <div className="bg-[#1e3a8a] text-white p-4 min-h-[72px] flex items-center justify-center group-hover:bg-[#1a337a] transition-colors border-t border-indigo-900/10">
              <span className="text-[11px] font-black leading-tight uppercase tracking-wider">
                {dept.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-6 bg-white rounded-2xl text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <button className="inline-flex items-center gap-2 text-indigo-600 font-black text-sm hover:text-indigo-800 transition-colors uppercase tracking-widest">
          {t.browseAll}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Departments;
