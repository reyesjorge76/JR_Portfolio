import React, { useState } from 'react';
import { Cpu, Activity, Bot } from 'lucide-react';
import PLCModal from './PLCModal';

const AutomationSection: React.FC = () => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const projects = [
    {
      id: 'battery',
      title: 'Battery Mixing Process',
      description: 'Automated chemical mixing system with precise temperature and pressure control',
      icon: <Activity className="w-8 h-8 text-cyan-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768921957_0a27137e.webp'
    },
    {
      id: 'conveyor',
      title: 'Conveyor Sorting System',
      description: 'Intelligent sorting system using computer vision for shape, color, and size detection',
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768923808_3e92b5f0.webp'
    },
    {
      id: 'robot',
      title: 'Robot Pick & Place',
      description: '6-axis robotic arm with precision control for automated assembly operations',
      icon: <Bot className="w-8 h-8 text-cyan-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768925673_a44fe79c.webp'
    }
  ];

  return (
    <section id="automation" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Industrial Automation Portfolio
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Interactive PLC control systems with real-time HMI interfaces and ladder logic visualization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gray-800/50 border border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
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
                  <h3 className="text-xl font-semibold text-cyan-400">{project.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{project.description}</p>
                
                <button
                  onClick={() => setSelectedModal(project.id)}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Launch Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PLCModal
        isOpen={selectedModal === 'battery'}
        onClose={() => setSelectedModal(null)}
        title="Battery Mixing Process Control"
        type="battery"
      />
      <PLCModal
        isOpen={selectedModal === 'conveyor'}
        onClose={() => setSelectedModal(null)}
        title="Conveyor Sorting System"
        type="conveyor"
      />
      <PLCModal
        isOpen={selectedModal === 'robot'}
        onClose={() => setSelectedModal(null)}
        title="Robot Pick & Place System"
        type="robot"
      />
    </section>
  );
};

export default AutomationSection;