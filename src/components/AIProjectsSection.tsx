import React, { useState } from 'react';
import { Brain, Sparkles, MessageSquare } from 'lucide-react';
import AIProjectModal from './AIProjectModal';

const AIProjectsSection: React.FC = () => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const projects = [
    {
      id: 'chatbot',
      title: 'AI Assistant Chatbot',
      description: 'Interactive AI chatbot that can answer questions, have conversations, and provide helpful responses',
      icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768931819_4f6e5066.webp',
      type: 'chatbot' as const
    },
    {
      id: 'trivia',
      title: 'Trivia & Knowledge Bot',
      description: 'Test your knowledge with an AI-powered trivia game that asks questions and verifies answers',
      icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768933721_92653a4d.webp',
      type: 'trivia' as const
    },
    {
      id: 'analyzer',
      title: 'Text Analyzer AI',
      description: 'Advanced text analysis tool that provides sentiment analysis, word count, and readability metrics',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768935586_7864665f.webp',
      type: 'analyzer' as const
    }
  ];

  return (
    <section id="ai-projects" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
              AI & Machine Learning Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Interactive AI demonstrations you can test in real-time - ask questions, play trivia, or analyze text
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gray-900/50 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {project.icon}
                  <h3 className="text-xl font-semibold text-purple-400">{project.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{project.description}</p>
                
                <button
                  onClick={() => setSelectedModal(project.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Try Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {projects.map((project) => (
        <AIProjectModal
          key={project.id}
          isOpen={selectedModal === project.id}
          onClose={() => setSelectedModal(null)}
          title={project.title}
          type={project.type}
        />
      ))}
    </section>
  );
};

export default AIProjectsSection;