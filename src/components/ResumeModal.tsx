import React from 'react';
import { X, Download, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    alert('Resume download would be triggered here');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 p-4 border-b border-cyan-500/30 flex justify-between items-center relative">
          <h2 className="text-2xl font-bold text-cyan-400">Resume</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Download size={20} /> Download PDF
            </button>
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
        </div>
        
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)] bg-white text-gray-900">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">John Doe</h1>
              <p className="text-xl text-gray-600 mb-4">Automation Engineer | AI Developer | Full-Stack Creator</p>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Mail size={16} /> john.doe@email.com</span>
                <span className="flex items-center gap-1"><Phone size={16} /> +1 234-567-8900</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> San Francisco, CA</span>
              </div>
            </div>
            
            {/* Summary */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-3 text-cyan-600">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                Innovative Automation Engineer with 8+ years of experience in industrial automation, 
                PLC programming, and AI integration. Expert in developing intelligent control systems 
                that bridge traditional automation with cutting-edge machine learning technologies.
              </p>
            </section>
            
            {/* Experience */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-3 text-cyan-600">Experience</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Senior Automation Engineer</h3>
                  <p className="text-gray-600">TechCorp Industries | 2020 - Present</p>
                  <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li>Designed and implemented PLC control systems for 15+ production lines</li>
                    <li>Integrated AI-based predictive maintenance reducing downtime by 40%</li>
                    <li>Led team of 5 engineers in Industry 4.0 transformation project</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Automation Developer</h3>
                  <p className="text-gray-600">AutoSystems Inc | 2017 - 2020</p>
                  <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li>Developed HMI interfaces for complex manufacturing systems</li>
                    <li>Programmed Siemens and Allen-Bradley PLCs for various applications</li>
                    <li>Implemented SCADA systems for real-time monitoring</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-3 text-cyan-600">Technical Skills</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Automation</h3>
                  <p className="text-gray-700">PLC Programming, HMI Development, SCADA, Industrial Networks</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI/ML</h3>
                  <p className="text-gray-700">TensorFlow, PyTorch, Computer Vision, NLP</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Programming</h3>
                  <p className="text-gray-700">Python, JavaScript, C++, SQL</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tools</h3>
                  <p className="text-gray-700">Git, Docker, AWS, React, Node.js</p>
                </div>
              </div>
            </section>
            
            {/* Education */}
            <section>
              <h2 className="text-2xl font-bold mb-3 text-cyan-600">Education</h2>
              <div>
                <h3 className="text-lg font-semibold">Master of Science in Automation Engineering</h3>
                <p className="text-gray-600">MIT | 2015 - 2017</p>
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-semibold">Bachelor of Science in Electrical Engineering</h3>
                <p className="text-gray-600">Stanford University | 2011 - 2015</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;