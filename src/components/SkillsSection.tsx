import React from 'react';
import { Cpu, Code, Brain, Shield, Settings2, Monitor, Activity, Eye, Waypoints, Framer, MonitorCogIcon, Bot, ShieldCheck, Component } from 'lucide-react';

const SkillsSection: React.FC = () => {
  const skillCategories = [
    {
      title: 'PLC & Automation',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      skills: [
        { name: 'Siemens TIA Portal', level: 90 },
        { name: 'Allen-Bradley', level: 90 },
        { name: 'SCADA Systems', level: 75 },
        { name: 'HMI Development', level: 95 },
        { name: 'Industrial Networks', level: 90 }
      ]
    },
    {
      title: 'AI & Machine Learning',
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      skills: [
        { name: 'TensorFlow', level: 10 },
        { name: 'PyTorch', level: 60 },
        { name: 'Computer Vision', level: 55 },
        { name: 'NLP', level: 20 },
        { name: 'Deep Learning', level: 65 }
      ]
    },
    {
      title: 'Programming',
      icon: <Code className="w-6 h-6 text-green-400" />,
      skills: [
        { name: 'Python', level: 65 },
        { name: 'JavaScript/React', level: 25 },
        { name: 'C++', level: 50 },
        { name: 'SQL', level: 75 },
        { name: 'Node.js', level: 25 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Comprehensive expertise across Industrial automation, Electrical and Mechanical engineering, Artificial intelligence, and Software development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                {category.icon}
                <h3 className="text-xl font-semibold text-cyan-400">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                      <span className="text-cyan-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                        style={{ 
                          width: `${skill.level}%`,
                          animation: `slideIn 1s ease-out ${skillIdx * 0.1}s both`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { icon: <Settings2 className="w-8 h-8" />, name: 'PLC Controls' },
            { icon: <Monitor className="w-8 h-8" />, name: 'HMI Design' },
            { icon: <Activity className="w-8 h-8" />, name: 'SCADA Systems' },
            { icon: <Eye className="w-8 h-8" />, name: 'Vision Systems' },
            { icon: <Cpu className="w-8 h-8" />, name: 'IoT Devices' },
            { icon: <Waypoints className="w-8 h-8" />, name: 'Network Management' },
            { icon: <Framer className="w-8 h-8" />, name: 'CAD Design' },
            { icon: <MonitorCogIcon className="w-8 h-8" />, name: 'Embedded Systems' },
            { icon: <Bot className="w-8 h-8" />, name: 'Industrial Robots' },
            { icon: <Component className="w-8 h-8" />, name: 'UI/UX Design' },
            { icon: <Shield className="w-8 h-8" />, name: 'Safety Systems' },
            { icon: <ShieldCheck className="w-8 h-8" />, name: 'Regulatory Compliance' }
          ].map((tech, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 flex flex-col items-center justify-center hover:border-cyan-400/50 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="text-cyan-400 mb-2">{tech.icon}</div>
              <span className="text-gray-300 text-sm">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { width: 0; }
        }
      `}</style>
    </section>
  );
};

export default SkillsSection;