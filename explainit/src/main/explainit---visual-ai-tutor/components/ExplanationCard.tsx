
import React from 'react';
import type { ExplanationPart } from '../types';

interface ExplanationCardProps {
  part: ExplanationPart;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ part }) => {
  if (part.type === 'loading') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (part.type === 'image') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-4 transition-all hover:shadow-md">
        <img 
          src={part.content} 
          alt="Visual Explanation" 
          className="w-full h-auto object-cover max-h-[500px]"
          loading="lazy"
        />
        <div className="p-4 bg-slate-50/50">
           <p className="text-xs text-slate-400 italic">AI Generated Visual Aid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4 transition-all hover:shadow-md">
      <div className="prose prose-slate max-w-none">
        {part.content.split('\n').map((para, i) => (
          <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ExplanationCard;
