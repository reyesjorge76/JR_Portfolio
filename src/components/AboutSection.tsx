import React from 'react';
import { Award, BookOpen, Target, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  const achievements = [
    { icon: <Award className="w-6 h-6" />, value: '50+', label: 'Projects Completed' },
    { icon: <Users className="w-6 h-6" />, value: '30+', label: 'Happy Clients' },
    { icon: <BookOpen className="w-6 h-6" />, value: '10+', label: 'Certifications' },
    { icon: <Target className="w-6 h-6" />, value: '+90%', label: 'Success Rate' }
  ];

  const timeline = [
    { year: '2022', title: 'Lead Systems Controls Engineer', desc: 'Promoted to lead Industry 4.0 initiatives' },
    { year: '2020', title: 'Controls & Robotics Engineer', desc: 'Pioneered robotics solutions for manufacturing' },
    { year: '2016', title: 'Maintenance Engineering Lead', desc: 'Led a team of 5 engineers on major project planning, design, build, and integration' },
    { year: '2014', title: 'Global Automation Service Engineer', desc: 'Started a journey in Global Service Automation' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Engineering Excellence Meets Innovation</h3>
            <p className="text-gray-300 mb-4">
              With over 15 years of experience in industrial automation and Electrical Engineering, 2 years in artificial intelligence and 2 years in software development, 
              I bridge the gap between traditional engineering and cutting-edge technology. 
              My passion lies in creating intelligent systems that not only automate processes 
              but also learn and adapt to optimize performance.
            </p>
            <p className="text-gray-300 mb-4">
              From programming PLCs for complex manufacturing lines to developing AI models 
              for predictive maintenance, I bring a unique blend of hardware and software expertise 
              to every project. My approach combines rigorous engineering principles with 
              innovative thinking to deliver solutions that exceed expectations.
            </p>
            <p className="text-gray-300">
              When I'm not coding or designing controls or electrical systems, you'll find me exploring 
              the latest advancements in robotics, contributing to open-source projects, 
              or mentoring the next generation of engineers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 border border-cyan-500/20 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="text-cyan-400 mb-3 flex justify-center">{item.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <h3 className="text-2xl font-semibold text-cyan-400 mb-8 text-center">Professional Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-cyan-500/30" />
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center mb-8 ${
                  idx % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`w-5/12 ${
                    idx % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                  }`}
                >
                  <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all duration-300">
                    <span className="text-cyan-400 font-semibold">{item.year}</span>
                    <h4 className="text-lg font-semibold text-white mt-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-900" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;