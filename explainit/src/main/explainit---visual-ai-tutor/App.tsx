
import React, { useState, useRef, useEffect } from 'react';
import type { ExplanationPart } from './types';
import { getExplanation, generateVisualImage } from './services/geminiService';
import ExplanationCard from './components/ExplanationCard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanationParts, setExplanationParts] = useState<ExplanationPart[]>([]);
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [explanationParts]);

  const handleExplain = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || isExplaining) return;

    const currentTopic = topic;
    setTopic('');
    setIsExplaining(true);
    setError(null);

    // Add a loading text part
    const loadingId = Math.random().toString(36).substr(2, 9);
    setExplanationParts(prev => [
      ...prev,
      { id: loadingId, type: 'loading', content: 'Generating explanation...', timestamp: Date.now() }
    ]);

    try {
      // 1. Get Text Explanation
      const response = await getExplanation(currentTopic);
      
      // Update loading part with text content
      setExplanationParts(prev => prev.map(p => 
        p.id === loadingId 
          ? { ...p, type: 'text', content: response.explanation } 
          : p
      ));

      // 2. Add loading part for image
      const imgLoadingId = Math.random().toString(36).substr(2, 9);
      setExplanationParts(prev => [
        ...prev,
        { id: imgLoadingId, type: 'loading', content: 'Creating visual aid...', timestamp: Date.now() }
      ]);

      // 3. Generate Image
      try {
        const imageUrl = await generateVisualImage(response.visualPrompt);
        setExplanationParts(prev => prev.map(p => 
          p.id === imgLoadingId 
            ? { ...p, type: 'image', content: imageUrl } 
            : p
        ));
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // Remove the image loading part if it fails
        setExplanationParts(prev => prev.filter(p => p.id !== imgLoadingId));
      }

    } catch (err) {
      console.error(err);
      console.log("API KEY:", import.meta.env.VITE_API_KEY);
      setError("Something went wrong while explaining. Please try again.");
      setExplanationParts(prev => prev.filter(p => p.type !== 'loading'));
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">ExplainIt</h1>
              <p className="text-xs text-slate-500 font-medium">Visual AI Learning Companion</p>
            </div>
          </div>
          <button 
            onClick={() => setExplanationParts([])}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            title="Clear Feed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50">
        <div className="max-w-3xl mx-auto pb-24">
          {explanationParts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center mt-20 opacity-0 animate-[fadeIn_0.5s_ease_forward]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <svg className="text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">What would you like to understand today?</h2>
              <p className="text-slate-500 max-w-sm">Ask me about any concept, and I'll explain it with simple terms and custom visual aids.</p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['Quantum Physics', 'How Photosynthesis works', 'Black Holes', 'The Internet'].map(item => (
                  <button 
                    key={item}
                    onClick={() => {
                      setTopic(item);
                      // Trigger manually next tick
                      setTimeout(() => document.getElementById('main-input-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 0);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {explanationParts.map((part) => (
                <ExplanationCard key={part.id} part={part} />
              ))}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-4 text-sm font-medium">
                  {error}
                </div>
              )}
              <div ref={scrollEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input Section */}
      <div className="flex-none p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent sticky bottom-0">
        <form 
          id="main-input-form"
          onSubmit={handleExplain} 
          className="max-w-3xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-focus-within:duration-200"></div>
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 transition-all focus-within:ring-2 focus-within:ring-indigo-100">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ask anything (e.g., 'How do solar panels work?')..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-800 placeholder:text-slate-400"
              disabled={isExplaining}
            />
            <button
              type="submit"
              disabled={isExplaining || !topic.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${isExplaining || !topic.trim() 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 active:scale-95'}
              `}
            >
              {isExplaining ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Explain</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
