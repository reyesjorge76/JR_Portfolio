import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, Brain } from 'lucide-react';

interface AIProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'chatbot' | 'trivia' | 'analyzer';
}

const AIProjectModal: React.FC<AIProjectModalProps> = ({ isOpen, onClose, title, type }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const triviaQuestions = [
    { q: "What is the capital of France?", a: "Paris" },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
    { q: "What is the largest planet?", a: "Jupiter" },
    { q: "What year did WW2 end?", a: "1945" },
    { q: "What is the speed of light?", a: "299,792,458 meters per second" }
  ];

  const analyzeText = (text: string) => {
    const words = text.split(' ').length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const sentiment = text.toLowerCase().includes('good') || text.toLowerCase().includes('happy') 
      ? 'Positive' 
      : text.toLowerCase().includes('bad') || text.toLowerCase().includes('sad') 
        ? 'Negative' 
        : 'Neutral';
    
    return `Analysis Complete:\n• Words: ${words}\n• Characters: ${chars}\n• Sentences: ${sentences}\n• Sentiment: ${sentiment}\n• Reading Time: ~${Math.ceil(words / 200)} min`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      let aiResponse = '';
      
      if (type === 'chatbot') {
        const responses = [
          "That's an interesting question! Let me think about that...",
          "Based on my analysis, I would say that's quite fascinating!",
          "I understand what you're asking. Here's my perspective...",
          "Great question! The answer involves several factors...",
          "Let me help you with that. Consider this approach..."
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
        
        if (input.toLowerCase().includes('hello')) {
          aiResponse = "Hello! I'm your AI assistant. How can I help you today?";
        } else if (input.toLowerCase().includes('how are you')) {
          aiResponse = "I'm functioning optimally! Ready to assist you with any questions.";
        } else if (input.toLowerCase().includes('weather')) {
          aiResponse = "I'd need access to weather APIs to provide real-time weather data. Currently showing demo responses.";
        }
      } else if (type === 'trivia') {
        const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        if (input.toLowerCase().includes('question') || input.toLowerCase().includes('trivia')) {
          aiResponse = `Here's a trivia question: ${randomQ.q}\n\nThink you know the answer? Type it in!`;
        } else {
          const matchedQ = triviaQuestions.find(q => 
            input.toLowerCase().includes(q.a.toLowerCase().split(' ')[0])
          );
          if (matchedQ) {
            aiResponse = `Correct! The answer to "${matchedQ.q}" is indeed ${matchedQ.a}. Want another question?`;
          } else {
            aiResponse = `Interesting guess! Here's a new question: ${randomQ.q}`;
          }
        }
      } else if (type === 'analyzer') {
        aiResponse = analyzeText(input);
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 p-4 border-b border-cyan-500/30 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            {type === 'chatbot' && <Bot className="w-6 h-6 text-cyan-400" />}
            {type === 'trivia' && <Sparkles className="w-6 h-6 text-purple-400" />}
            {type === 'analyzer' && <Brain className="w-6 h-6 text-cyan-400" />}
            <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }} 
            className="relative z-20 text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer flex-shrink-0"
            type="button"
            aria-label="Close modal"
            style={{ pointerEvents: 'auto' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col h-[calc(80vh-80px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <div className="mb-4">
                  {type === 'chatbot' && <Bot className="w-16 h-16 mx-auto text-cyan-400/50" />}
                  {type === 'trivia' && <Sparkles className="w-16 h-16 mx-auto text-purple-400/50" />}
                  {type === 'analyzer' && <Brain className="w-16 h-16 mx-auto text-cyan-400/50" />}
                </div>
                <p className="text-lg">
                  {type === 'chatbot' && "Hi! I'm your AI assistant. Ask me anything!"}
                  {type === 'trivia' && "Ready for some trivia? Type 'question' to get started!"}
                  {type === 'analyzer' && "Paste any text and I'll analyze it for you!"}
                </p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100' 
                    : 'bg-purple-600/20 border border-purple-500/30 text-purple-100'
                }`}>
                  <div className="flex items-start gap-3">
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-400" />
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-purple-600/20 border border-purple-500/30 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  type === 'chatbot' ? "Ask me anything..." :
                  type === 'trivia' ? "Type 'question' or answer here..." :
                  "Paste text to analyze..."
                }
                className="flex-1 bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIProjectModal;