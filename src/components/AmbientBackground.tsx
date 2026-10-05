import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#f8fafc]">
      {/* Soft luminous ambient spheres for light minimalist glass refraction */}
      <div 
        className="absolute -top-[12%] left-[10%] w-[650px] h-[650px] rounded-full bg-sky-400/12 blur-[140px] animate-pulse" 
        style={{ animationDuration: '10s' }}
      />
      <div 
        className="absolute top-[25%] -right-[8%] w-[580px] h-[580px] rounded-full bg-indigo-300/10 blur-[150px] animate-pulse" 
        style={{ animationDuration: '13s', animationDelay: '2s' }}
      />
      <div 
        className="absolute -bottom-[12%] left-[20%] w-[720px] h-[720px] rounded-full bg-teal-400/10 blur-[160px] animate-pulse" 
        style={{ animationDuration: '15s', animationDelay: '4s' }}
      />

      {/* Subtle minimalist grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
};
