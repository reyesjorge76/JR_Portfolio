import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    Portfolio: [
      { name: 'Automation', id: 'automation' },
      { name: 'AI Projects', id: 'ai-projects' },
      { name: 'Games', id: 'games' },
      { name: 'All Projects', id: 'hero' }
    ],
    About: [
      { name: 'Skills', id: 'skills' },
      { name: 'Experience', id: 'about' },
      { name: 'Education', id: 'about' },
      { name: 'Certifications', id: 'about' }
    ],
    Resources: [
      { name: 'Blog', id: 'hero' },
      { name: 'Tutorials', id: 'hero' },
      { name: 'Documentation', id: 'hero' },
      { name: 'GitHub', id: 'hero' }
    ]
  };

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, name: 'GitHub', url: '#' },
    { icon: <Linkedin className="w-5 h-5" />, name: 'LinkedIn', url: '#' },
    { icon: <Twitter className="w-5 h-5" />, name: 'Twitter', url: '#' },
    { icon: <Mail className="w-5 h-5" />, name: 'Email', url: '#' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Portfolio
            </h3>
            <p className="text-gray-400 mb-4">
              Bridging automation and AI to create intelligent solutions for tomorrow's challenges.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={() => alert(`Connect on ${social.name}`)}
                  className="w-10 h-10 bg-gray-800 border border-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Portfolio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => alert('Privacy Policy')}
                className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert('Terms of Service')}
                className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;