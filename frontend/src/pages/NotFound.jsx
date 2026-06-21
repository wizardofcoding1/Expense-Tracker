import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="glass-panel p-10 max-w-md rounded-3xl shadow-xl flex flex-col items-center border border-zinc-800">
        {/* Animated Icon Circle */}
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 animate-fade-in">
          <AlertCircle size={38} className="animate-pulse" />
        </div>

        {/* 404 Header */}
        <h1 className="text-5xl font-extrabold text-zinc-100 tracking-tight m-0">404</h1>
        <h2 className="text-lg font-bold text-zinc-200 mt-2">Page Not Found</h2>
        
        {/* Subtitle description */}
        <p className="text-xs text-zinc-550 mt-3 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Button */}
        <Link 
          to="/" 
          className="mt-8 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2 text-xs"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
