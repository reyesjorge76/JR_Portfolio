import React from 'react';
import { X, Download, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Download resume.pdf from public folder
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Jorge_Reyes_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <h1 className="text-4xl font-bold mb-2">Jorge Reyes</h1>
              <p className="text-xl text-gray-600 mb-4">Electrical Engineer | Automation Specialist | Web & AI Developer</p>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Mail size={16} /> jorge.reyes@hotmail.com</span>
                <span className="flex items-center gap-1"><Phone size={16} /> 269-419-4762</span>
                <span>🌍 <a href="https://reyesjorge76.github.io/JR_Portfolio/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-900">My Portfolio</a></span>
                <span>💼 <a href="https://www.linkedin.com/in/reyesjorge76-driven" target="_blank" rel="noopener noreferrer" className="hover:text-blue-900">My LinkedIn Profile</a></span>
                {/* <span className="flex items-center gap-1"><MapPin size={16} /> San Francisco, CA</span> */}
              </div>
            </div>
            
            {/* Summary */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-3 text-cyan-600">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                Innovative Systems Engineer with over 14 years of hands-on experience maintaining, designing, building, and commissioning fully automated systems in high-tech manufacturing environments. 
                  Proven leadership in process optimization, systems controls, and cross-functional collaboration, with a strong track record of implementing standardized automation solutions that 
                  enhance production efficiency and ensure regulatory compliance. Expert in pneumatic and hydraulic system integration, electrical wiring, component assembly, equipment maintenance, 
                  and continuous improvement strategies and system repair, with deep proficiency in Allen-Bradley, Siemens, Mitsubishi, and Omron PLC platforms amongst others. 
                  Skilled in HMI and SCADA development. Experienced in Factory and Site Acceptance Testing (FAT/SAT), 
                  Currently expanding capabilities in software engineering, web development, artificial intelligence (AI), and machine learning (ML) to bridge intelligent automation with data-driven decision-making.
              </p>
            {/* Key Accomplishments */}

            <div className="bg-gray-50 rounded-lg p-4 text-center mb-8">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">🔹 <strong>Key Accomplishments</strong></h5>
                  <div className="flex flex-wrap gap-2">
                    <p>• Increased production efficiency by 15%, reduced equipment design cost by 25%, lowered defect rates by 10%, and improved testing accuracy through automation of complex test systems.</p>
                    <p>• Implemented preventive maintenance programs that reduced unscheduled downtime by 20%, and applied predictive strategies to cut downtime by an additional 15%.</p>
                    <p>• Led cross-functional teams in the successful design, installation, and commissioning of over 30 automated systems, ensuring seamless integration with existing manufacturing processes.</p>
                    <p>• Worked with Standards teams to standardized PLC programming and HMI design practices across multiple facilities, resulting in a 30% reduction in development time and enhanced system reliability.</p>
                    <p>• Developed and executed comprehensive training programs for engineering and maintenance staff, improving technical proficiency and reducing troubleshooting time by 25%.</p>        
                  </div>
            </div>
            </section>
            
          {/* Technical Skills */}
            <section className="mb-8">
              <div className="mb-8 text-center hover-glow animate-scale-in border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-4 p-4">
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center"><strong>Technical Skills</strong></h4>
                <div className="flex flex-wrap gap-2">
                  <h2><strong>Automation & Industrial Controls</strong></h2>
                    <p>PLC Programming: Allen-Bradley, Siemens, Mitsubishi, Omron</p>
                    <p>HMI & SCADA: Design and deployment for real-time monitoring and control</p>
                    <p>Industrial Automation: Robotics troubleshooting, hydraulic/pneumatic integration, battery manufacturing systems, system diagnostics</p>
                  <h4><strong>Embedded Systems & Hardware Integration</strong></h4>
                    <p>Microcontrollers: ESP32, TTGO T-Display, Arduino</p>
                    <p>Embedded programming, display driver integration, Wi-Fi/API connectivity, and staged porting to MicroPython</p>
                    <p>Sensor interfacing, button logic, and low-level hardware debugging</p>
                  <h4><strong>Testing & Validation</strong></h4>
                    <p>Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT)</p>
                    <p>Fault isolation, compliance audits, strategy implementation, and continuous improvement</p>  
                  <h4><strong>Electrical & Mechanical Engineering</strong></h4>
                    <p>Electrical wiring, component assembly, system repair</p>
                    <p>Engineering fundamentals: Electrical circuits, pneumatics, hydraulics, robotics, manufacturing systems</p>
                  <h4><strong>Programming & Development</strong></h4>
                    <p>Languages: Python, C/C++</p>
                    <p>AI & ML: Intelligent automation, prompt engineering, model integration</p>
                    <p>Software development for industrial and embedded applications</p>
                  <h4><strong>Hardware & Systems</strong></h4>
                    <p>IT Support, network configuration, PC building and troubleshooting</p>
                  <h4><strong>Project & Vendor Management</strong></h4>
                    <p>Risk assessment, budget planning, vendor coordination, and regulatory compliance</p>
                  <h4><strong>Emerging Technologies</strong></h4>
                    <p>Applied AI/ML, intelligent automation, and cross-domain integration of software with industrial systems</p>
                </div>
              </div>
            </section>
            
          {/* Education */}
            <section className="mb-8">
              <div className="mb-2 text-center bordered pt-4 hover-glow animate-scale-in border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-4 p-4">
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <strong>Education & Certifications</strong>
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">Associates in Electrical Engineering</h5>
                    <p className="text-blue-600 font-medium">Kellogg Community College</p>
                    <p className="text-gray-600 text-sm">Completed a comprehensive program focused on the installation, maintenance, and repair of electrical and electronic 
                      control systems used in advanced manufacturing and electrical construction. Gained hands-on experience with computer-based diagnostics, 
                      programmable logic controllers (PLCs), and industrial automation technologies. Trained in electrical theory, motor controls, instrumentation, 
                      and system troubleshooting using industry-standard equipment and self-paced instructional methods</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">Associates in Industrial Skilled Trades</h5>
                    <p className="text-blue-600 font-medium">Kellogg Community College</p>
                    <p className="text-gray-600 text-sm">Completed a flexible, multi-disciplinary program designed to support company-sponsored and apprenticeship-based 
                      training across various industrial trades. Developed foundational and advanced skills in mechanical systems, electrical systems, hydraulics, pneumatics, welding, machining, 
                      and maintenance practices. Emphasized safety, compliance, and cross-functional integration to prepare for high-demand roles in manufacturing, construction, and industrial operations</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">Applied Generative AI Specialization</h5>
                    <p className="text-blue-600 font-medium">University of Michigan, Professional Engineering</p>
                    <p className="text-gray-600 text-sm">Completed the University of Michigan’s Applied Generative AI Specialization, a 16-week expert-led bootcamp focused on building real-world AI applications using cutting-edge tools and techniques.This advanced program, offered through Michigan Engineering Professional Education (Pro-Ed), emphasizes hands-on learning with 7 applied projects and exposure to over 12 industry tools. Participants gain deep expertise in: Generative AI foundations: including large language models (LLMs), generative adversarial networks (GANs), and variational autoencoders (VAEs)Agentic AI and prompt engineering: mastering techniques for building autonomous, intelligent systems Tool proficiency: working with ChatGPT, LangChain, Stable Diffusion, and other leading platforms Deployment skills: building and deploying real-time generative AI-powered applications Graduates receive a program completion certificate from Michigan Engineering Pro-Ed, validating their ability to apply generative AI in production environments.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">Software Engineering</h5>
                    <p className="text-blue-600 font-medium">Central Michigan University, </p>
                    <p className="text-gray-600 text-sm">Completed Central Michigan University’s Software Engineering Boot Camp, an immersive online program designed to develop full-stack software engineering skills for modern tech careers. This accelerated training program emphasizes both front-end and back-end development, preparing participants to become job-ready software engineers or full-stack developers. Key competencies include: Full-stack development: HTML, CSS, JavaScript, React, Node.js, and databases Software engineering principles: Agile workflows, version control (Git), debugging, and deployment Hands-on projects: Real-world applications built throughout the course to reinforce learning Industry relevance: Curriculum aligned with current employer demands and tech trends The bootcamp is delivered 100% online and includes career support resources to help graduates transition into high-impact roles in software development.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">NFPA 70E Certification</h5>
                    <p className="text-blue-600 font-medium">National Fire Protection Association (NFPA)</p>
                    <p className="text-gray-600 text-sm">Achieved NFPA 70E Certification, demonstrating expertise in electrical safety and compliance with industry standards. This certification covers key topics such as electrical hazard recognition, risk assessment, and safe work practices to protect against electrical shock and arc flash incidents.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900">OSHA 10 Certification</h5>
                    <p className="text-blue-600 font-medium">Occupational Safety and Health Administration (OSHA)</p>
                    <p className="text-gray-600 text-sm">Completed OSHA 10-hour training, focusing on workplace safety and health hazards. This certification covers essential topics such as hazard recognition, prevention strategies, and regulatory compliance to ensure a safe working environment.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Professional Experience */}
            <section>
              <div className="mb-2 text-center bordered pt-4 hover-glow animate-scale-in border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-4 p-4">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><strong>Professional Experience</strong></h4>

                  <div className="">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900"><strong>General Motors Technical Center</strong></h5>
                        <p className="text-blue-600 font-medium">Lead Systems Controls Engineer</p>
                      </div>
                      <span className="text-gray-600 font-medium text-sm">July 2021 – January 2025</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Spearheaded advanced controls automation and battery system projects, delivering a 15% boost in production efficiency, 10% reduction in defect rates, and 20% improvement in cycle times</li>
                      <li>Ensured full compliance with ISO, OSHA, and NFPA safety standards across all engineering operations and documentation</li>
                      <li>Directed vendor coordination and technical reviews, overseeing estimates, quotes, and seamless integration of PLC-controlled systems with robotic automation</li>
                      <li>Led Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT) initiatives, achieving 99.9% operational reliability across mission-critical systems</li> 
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900"><strong>Stellantis (FCA)</strong></h5>
                        <p className="text-blue-600 font-medium">Professional Maintenance Specialist – Controls & Robotics</p>
                      </div>
                      <span className="text-gray-600 font-medium text-sm">January 2020 – July 2021</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Optimized robotic sorting and conveyor systems in a high-volume, unionized manufacturing environment, achieving a 30% reduction in downtime through predictive maintenance, calibration strategies, and continuous improvement initiatives</li>
                      <li>Developed and optimized PLC programs for automated assembly lines, improving production efficiency by 20%</li>
                      <li>Ensured all Standard Maintenance Procedures (SMPs) aligned with Stellantis’s performance KPIs, driving consistent uptime and equipment reliability</li>
                      <li>Led cross-functional teams in troubleshooting and resolving complex mechanical and electrical issues, reducing mean time to repair (MTTR) by 25%</li>
                      <li>Implemented data-driven decision-making processes, utilizing analytics to optimize maintenance schedules and resource allocation</li>
                      <li>Implemented strategic vacation planning and resource scheduling, improving skilled trades utilization by 10% while maintaining production continuity</li>
                      <li>Supported safety, quality, delivery, and cost initiatives across designated technologies, contributing to long-term equipment health and operational excellence</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900"><strong>Delphi Technologies</strong></h5>
                        <p className="text-blue-600 font-medium">Lead Maintenance Engineer | Validation Test Development Engineer</p>
                      </div>
                      <span className="text-gray-600 font-medium text-sm">May 2016 – December 2020</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Automated complex test systems through embedded controllers for diesel engine applications, improving testing accuracy by 10% and providing technical coaching and scheduling to maintenance teams to ensure 24/7 production support</li>
                      <li>Designed and maintained hydraulic test stands and pneumatic fixtures for controller validation, ensuring consistent pressure regulation and safety compliance</li>
                      <li>Implemented a preventive maintenance (PM) program, reducing unscheduled downtime by 20%, while managing critical path timing to ensure on-time delivery of high-value engineering projects</li>
                      <li>Played a key role in bridging validation engineering with maintenance operations, driving reliability, throughput, and cross-functional collaboration</li>
                    </ul>
                  </div>

                                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900"><strong>PRAB – Industrial Conveyors & Fluid Systems</strong></h5>
                        <p className="text-blue-600 font-medium">Global Service Engineer</p>
                      </div>
                      <span className="text-gray-600 font-medium text-sm">May 2014 – August 2015</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Led multi-million-dollar installations of industrial scrap conveyor and fluid filtration systems across global manufacturing sites, ensuring full compliance with commissioning protocols and safety standards</li>
                      <li>Installed, commissioned, and diagnosed hydraulic and pneumatic control loops, actuators, and filtration systems for metal chip processing and wastewater treatment equipment</li>
                      <li>Diagnosed and resolved hydraulic actuator faults and optimized pneumatic control logic, improving system responsiveness and long-term reliability</li>
                      <li>Fabricated custom fixtures and mechanical enhancements to improve machine performance, uptime, and customer-specific operational requirements</li>
                      <li>Served as a technical liaison between engineering, fabrication, and customer teams, supporting PRAB’s mission to reduce waste, improve efficiency, and deliver durable, high-performance equipment</li>
                    </ul>
                  </div>
              </div>
            </section>

          {/* Additional Information */}
            <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border-l-4 border-blue-400 text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-2"><strong>Additional Information</strong></h4>
              <p className="text-gray-700 text-sm">
                <strong>Hobbies & Interests:</strong> Carpentry, Metalworking, Microcontroller DIY projects, Travel and Continuous learning in Web Development, AI and automation technologies
              </p>
              <p className="text-gray-700 mt-1 text-sm">
                <strong>Languages:</strong> Spanish
              </p>
            </div>
            </section>

            <section className="mb-8">
                          {/* Edit Note */}
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-yellow-800 text-xs">
                <strong>📝 Note:</strong> Career Pause – Transition & Recovery</p>
                <p>January 2025 - Present</p>
                <p>Following a company-wide layoff, I experienced a road accident that required a period of medical recovery. During this time, I remained engaged with the tech field—expanding my skills in AI, ML, and software development, refining my portfolio, and preparing for a strong return to full-time engineering work.</p>
            </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;