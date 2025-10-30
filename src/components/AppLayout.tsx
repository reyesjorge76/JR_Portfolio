import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AutomationSection from './AutomationSection';
import AIProjectsSection from './AIProjectsSection';
import GamesSection from './GamesSection';
import SkillsSection from './SkillsSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import ResumeModal from './ResumeModal';

const AppLayout: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Handle resume section navigation
  React.useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash === '#resume') {
        setIsResumeOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Check on mount
    handleScroll();

    // Listen for hash changes
    window.addEventListener('hashchange', handleScroll);
    
    // Custom event listener for resume button clicks
    const handleResumeClick = (e: Event) => {
      if ((e as CustomEvent).detail === 'resume') {
        setIsResumeOpen(true);
      }
    };
    
    window.addEventListener('openResume', handleResumeClick as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleScroll);
      window.removeEventListener('openResume', handleResumeClick as EventListener);
    };
  }, []);

  // DISABLED: This MutationObserver was auto-opening resume modal
  // React.useEffect(() => {
  //   const checkForResumeSection = () => {
  //     const resumeElement = document.getElementById('resume');
  //     if (resumeElement) {
  //       setIsResumeOpen(true);
  //     }
  //   };

  //   const observer = new MutationObserver(() => {
  //     checkForResumeSection();
  //   });

  //   observer.observe(document.body, { childList: true, subtree: true });

  //   return () => observer.disconnect();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
        {/* Hero Section with Particle Animation */}
        <HeroSection />
        
        {/* Interactive PLC Automation Portfolio */}
        <AutomationSection />
        
        {/* AI Projects with Live Demos */}
        <AIProjectsSection />
        
        {/* Python Games Section */}
        <GamesSection />
        
        {/* Technical Skills with Animated Progress Bars */}
        <SkillsSection />
        
        {/* About Section with Timeline */}
        <AboutSection />
        
        {/* Contact Form Section */}
        <ContactSection />
      </main>
      
      {/* Comprehensive Footer */}
      <Footer />
      
      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      
      {/* Hidden resume trigger section for navigation */}
      <div id="resume" className="hidden" />
      
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .bg-300\% {
          background-size: 300% 300%;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #a855f7);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #9333ea);
        }
      `}</style>
    </div>
  );
};

export default AppLayout;