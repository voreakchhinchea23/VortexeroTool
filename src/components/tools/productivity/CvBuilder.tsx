import React, { useState } from 'react';
import { Printer, Plus, Trash2, Upload, User, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Globe, Github, Linkedin, Check, Info, Sparkles, Layout, Palette, FileCheck } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type TemplateType = 
  | 'modern_tech' 
  | 'executive_clean' 
  | 'creative_indigo' 
  | 'nordic_minimal' 
  | 'compact_onepage' 
  | 'left_accent_bar' 
  | 'minimal_ats' 
  | 'developer_dark';

type ColorAccent = '#2563eb' | '#059669' | '#7c3aed' | '#e11d48' | '#0f172a' | '#d97706';

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  details: string;
}

interface Project {
  id: string;
  title: string;
  tech: string;
  description: string;
  link?: string;
}

interface CvData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  photoUrl: string;
  showPhoto: boolean;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

const PRESET_JOHN_DOE: CvData = {
  name: 'John Doe',
  title: 'Senior Fullstack Software Engineer',
  email: 'john.doe@example.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  linkedin: 'linkedin.com/in/johndoe',
  github: 'github.com/johndoe',
  summary: 'Passionate and results-driven Senior Fullstack Engineer with 7+ years of experience architecting high-scale distributed web applications, cloud systems, and responsive frontends using React, TypeScript, Node.js, and modern DevOps tools.',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
  showPhoto: true,
  experiences: [
    {
      id: '1',
      role: 'Lead Fullstack Engineer',
      company: 'Vortex Technologies',
      location: 'San Francisco, CA',
      period: '2022 - Present',
      bullets: [
        'Architected and led the development of a real-time web utilities suite serving 250k+ monthly active users.',
        'Reduced bundle size by 40% and improved Core Web Vitals to 98/100 using Vite and code-splitting.',
        'Mentored 6 junior/mid engineers and spearheaded CI/CD pipeline automation.'
      ]
    },
    {
      id: '2',
      role: 'Software Engineer',
      company: 'Apex Cloud Solutions',
      location: 'Remote',
      period: '2019 - 2022',
      bullets: [
        'Designed high-throughput GraphQL APIs and microservices handling 15M+ daily requests.',
        'Implemented end-to-end testing with Vitest and Playwright, achieving 92% code coverage.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2015 - 2019',
      details: 'Magna Cum Laude • Dean’s Honor List'
    }
  ],
  skills: ['React.js', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'System Design'],
  projects: [
    {
      id: '1',
      title: 'DevPulse Platform',
      tech: 'React, TypeScript, Tailwind',
      description: 'Open-source web dashboard featuring 20+ real-time developer productivity tools.',
      link: 'https://devpulse.io'
    }
  ]
};

const PRESET_SOK_SAN: CvData = {
  name: 'Sok San',
  title: 'Lead Product & UI/UX Designer',
  email: 'sok.san@example.com',
  phone: '+855 12 345 678',
  location: 'Phnom Penh, Cambodia',
  website: 'https://soksan.design',
  linkedin: 'linkedin.com/in/soksan',
  github: 'github.com/soksan',
  summary: 'Creative Lead Product Designer with 6+ years of experience crafting intuitive, modern, accessible design systems and digital interfaces for international tech products and mobile applications.',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  showPhoto: true,
  experiences: [
    {
      id: '1',
      role: 'Lead UI/UX Designer',
      company: 'Angkor Digital Lab',
      location: 'Phnom Penh, Cambodia',
      period: '2021 - Present',
      bullets: [
        'Led end-to-end product design lifecycle for Southeast Asian fintech and e-commerce platforms.',
        'Created a scalable multi-brand design system in Figma adopted by 4 engineering teams.'
      ]
    },
    {
      id: '2',
      role: 'Senior Product Designer',
      company: 'Mekong Interactive',
      location: 'Phnom Penh, Cambodia',
      period: '2018 - 2021',
      bullets: [
        'Conducted UX research, usability testing, and wireframing for 12+ client applications.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.A. in Visual Arts & Interactive Design',
      school: 'Royal University of Fine Arts',
      year: '2014 - 2018',
      details: 'Top Graduate in Multimedia Design'
    }
  ],
  skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research', 'Design Tokens', 'HTML/CSS', 'Visual Hierarchy'],
  projects: [
    {
      id: '1',
      title: 'Aura Fintech App',
      tech: 'Figma, Design Tokens',
      description: 'Award-winning digital wallet mobile application design with 100k+ active users.'
    }
  ]
};

export const CvBuilder: React.FC = () => {
  const [data, setData] = useState<CvData>(PRESET_JOHN_DOE);
  const [template, setTemplate] = useState<TemplateType>('modern_tech');
  const [accentColor, setAccentColor] = useState<ColorAccent>('#2563eb');
  const [viewTab, setViewTab] = useState<'editor' | 'preview' | 'split'>('split');
  const [newSkill, setNewSkill] = useState('');

  const { addToast } = useToast();

  // High-Resolution Isolated Iframe Print (Eliminates all dark-mode bleed, black bars, and multi-page overflow)
  const handlePrint = () => {
    const element = document.getElementById('cv-print-document');
    if (!element) return;

    // Create a hidden isolated iframe
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${data.name} - Resume</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            html, body {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              width: 100%;
            }
            .cv-container {
              width: 100% !important;
              background: #ffffff !important;
            }
          </style>
        </head>
        <body>
          <div class="cv-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
                window.parent.document.body.removeChild(window.frameElement);
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  const handleAddExperience = () => {
    setData({
      ...data,
      experiences: [
        ...data.experiences,
        {
          id: Date.now().toString(),
          role: 'Role Title',
          company: 'Company Name',
          location: 'City, Country',
          period: '2023 - Present',
          bullets: ['Key responsibility or quantified achievement.']
        }
      ]
    });
  };

  const handleDeleteExperience = (id: string) => {
    setData({ ...data, experiences: data.experiences.filter(e => e.id !== id) });
  };

  const handleAddEducation = () => {
    setData({
      ...data,
      education: [
        ...data.education,
        {
          id: Date.now().toString(),
          degree: 'Degree / Major',
          school: 'University Name',
          year: '2020 - 2024',
          details: 'Honors or Activities'
        }
      ]
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setData({ ...data, skills: [...data.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setData({ ...data, photoUrl: reader.result as string, showPhoto: true });
    };
    reader.readAsDataURL(file);
  };

  const colorOptions: { color: ColorAccent; label: string }[] = [
    { color: '#2563eb', label: 'Ocean Blue' },
    { color: '#059669', label: 'Emerald' },
    { color: '#7c3aed', label: 'Royal Indigo' },
    { color: '#e11d48', label: 'Crimson Rose' },
    { color: '#0f172a', label: 'Classic Slate' },
    { color: '#d97706', label: 'Warm Amber' },
  ];

  const templatesList: { id: TemplateType; label: string }[] = [
    { id: 'modern_tech', label: 'Modern Tech (2-Col)' },
    { id: 'executive_clean', label: 'Executive Clean' },
    { id: 'creative_indigo', label: 'Creative Banner' },
    { id: 'nordic_minimal', label: 'Nordic Elegance' },
    { id: 'compact_onepage', label: 'Compact 1-Page' },
    { id: 'left_accent_bar', label: 'Accent Border' },
    { id: 'minimal_ats', label: 'Minimal ATS' },
    { id: 'developer_dark', label: 'Dev Modern' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action & Template Selector Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Preset Profiles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Sample Profiles:</span>
          <button
            onClick={() => setData(PRESET_JOHN_DOE)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 text-xs font-bold transition-colors cursor-pointer"
          >
            John Doe (Tech)
          </button>
          <button
            onClick={() => setData(PRESET_SOK_SAN)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Sok San (Designer)
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setViewTab('split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewTab === 'split' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewTab('editor')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewTab === 'editor' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Editor Only
          </button>
          <button
            onClick={() => setViewTab('preview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewTab === 'preview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            CV Preview
          </button>
        </div>

        {/* Print / Save PDF Button */}
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Printer size={16} />
          <span>Print / Save as PDF (Clean 1-Page)</span>
        </button>
      </div>

      {/* Templates & Colors Row */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Template Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Layout size={14} />
            <span>Template:</span>
          </span>
          {templatesList.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === t.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Color Accent Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Palette size={14} />
            <span>Accent:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {colorOptions.map(c => (
              <button
                key={c.color}
                onClick={() => setAccentColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${accentColor === c.color ? 'scale-125 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-110'}`}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className={`grid gap-8 ${viewTab === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Editor Pane (Hidden when preview only) */}
        {(viewTab === 'split' || viewTab === 'editor') && (
          <div className="lg:col-span-5 space-y-5 max-h-[850px] overflow-y-auto pr-1">
            {/* Personal Details Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                <span>Personal Info</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Portfolio Website</label>
                  <input
                    type="text"
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Photo Upload & Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={data.showPhoto}
                    onChange={(e) => setData({ ...data, showPhoto: e.target.checked })}
                    className="w-4 h-4 accent-brand-600 rounded"
                  />
                  <span>Show Profile Picture</span>
                </label>

                {data.showPhoto && (
                  <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload size={13} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Executive Summary / Bio</label>
                <textarea
                  rows={3}
                  value={data.summary}
                  onChange={(e) => setData({ ...data, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Experience Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-brand-500" />
                  <span>Work Experience</span>
                </h3>
                <button
                  onClick={handleAddExperience}
                  className="px-2.5 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experiences: data.experiences.map(item =>
                              item.id === exp.id ? { ...item, role: e.target.value } : item
                            )
                          })
                        }
                        placeholder="Job Title"
                        className="font-bold text-xs bg-transparent focus:outline-none flex-1"
                      />
                      <button onClick={() => handleDeleteExperience(exp.id)} className="text-rose-500 p-1">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experiences: data.experiences.map(item =>
                              item.id === exp.id ? { ...item, company: e.target.value } : item
                            )
                          })
                        }
                        placeholder="Company"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experiences: data.experiences.map(item =>
                              item.id === exp.id ? { ...item, period: e.target.value } : item
                            )
                          })
                        }
                        placeholder="2022 - Present"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={exp.bullets.join('\n')}
                      onChange={(e) =>
                        setData({
                          ...data,
                          experiences: data.experiences.map(item =>
                            item.id === exp.id ? { ...item, bullets: e.target.value.split('\n') } : item
                          )
                        })
                      }
                      placeholder="Bullet points (one per line)..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code size={16} className="text-brand-500" />
                <span>Skills & Competencies</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add skill (e.g. Next.js, Figma)..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 group"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill(s)}
                      className="text-slate-400 hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live A4 CV Preview Area */}
        <div className={`cv-a4-preview ${viewTab === 'split' ? 'lg:col-span-7' : 'col-span-12'}`}>
          <div
            id="cv-print-document"
            className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 font-sans w-full"
          >
            {/* TEMPLATE 1: Modern Tech Two-Column */}
            {template === 'modern_tech' && (
              <div className="grid grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="col-span-4 border-r border-slate-200 pr-5 space-y-4">
                  {data.showPhoto && data.photoUrl && (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mx-auto">
                      <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{data.name}</h1>
                    <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>{data.title}</p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    {data.email && <div className="flex items-center gap-1.5 truncate"><Mail size={12} style={{ color: accentColor }} /><span>{data.email}</span></div>}
                    {data.phone && <div className="flex items-center gap-1.5 truncate"><Phone size={12} style={{ color: accentColor }} /><span>{data.phone}</span></div>}
                    {data.location && <div className="flex items-center gap-1.5 truncate"><MapPin size={12} style={{ color: accentColor }} /><span>{data.location}</span></div>}
                    {data.website && <div className="flex items-center gap-1.5 truncate"><Globe size={12} style={{ color: accentColor }} /><span>{data.website}</span></div>}
                    {data.github && <div className="flex items-center gap-1.5 truncate"><Github size={12} style={{ color: accentColor }} /><span>{data.github}</span></div>}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-[11px] space-y-0.5">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600 text-[10px]">{edu.school}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Main Area */}
                <div className="col-span-8 space-y-4">
                  {data.summary && (
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-black uppercase tracking-wider" style={{ color: accentColor }}>Profile Summary</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-1" style={{ color: accentColor }}>Work Experience</h3>
                    <div className="space-y-3">
                      {data.experiences.map(exp => (
                        <div key={exp.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                            <span className="text-[10px] font-mono text-slate-500">{exp.period}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600">{exp.company} • {exp.location}</p>
                          <ul className="list-disc ml-3.5 space-y-0.5 text-xs text-slate-600 mt-1 leading-relaxed">
                            {exp.bullets.filter(Boolean).map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {data.projects.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-1" style={{ color: accentColor }}>Featured Projects</h3>
                      {data.projects.map(prj => (
                        <div key={prj.id} className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-900">{prj.title}</span>
                          <span className="text-slate-500 text-[10px]"> ({prj.tech})</span>
                          <p className="text-slate-600 text-[11px]">{prj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEMPLATE 2: Executive Clean (Single-Column) */}
            {template === 'executive_clean' && (
              <div className="space-y-4">
                <div className="border-b-2 pb-3 text-center space-y-1" style={{ borderColor: accentColor }}>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{data.name}</h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600">{data.title}</p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-slate-500 pt-0.5">
                    <span>{data.email}</span>
                    <span>•</span>
                    <span>{data.phone}</span>
                    <span>•</span>
                    <span>{data.location}</span>
                    {data.website && <><span>•</span><span>{data.website}</span></>}
                  </div>
                </div>

                {data.summary && (
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Executive Summary</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Experience</h3>
                  {data.experiences.map(exp => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">{exp.role} — <span className="font-medium text-slate-600">{exp.company}</span></span>
                        <span className="text-[10px] font-mono text-slate-500">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-3.5 space-y-0.5 text-xs text-slate-600 leading-relaxed">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-800 font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-[11px]">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600 text-[10px]">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: Creative Banner */}
            {template === 'creative_indigo' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl text-white flex items-center justify-between gap-4" style={{ backgroundColor: accentColor }}>
                  <div className="space-y-0.5">
                    <h1 className="text-xl font-black">{data.name}</h1>
                    <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{data.title}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-white/80 pt-0.5">
                      <span>{data.email}</span>
                      <span>•</span>
                      <span>{data.phone}</span>
                      <span>•</span>
                      <span>{data.location}</span>
                    </div>
                  </div>

                  {data.showPhoto && data.photoUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/40 shrink-0">
                      <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Experience</h3>
                  <div className="space-y-2.5">
                    {data.experiences.map(exp => (
                      <div key={exp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                          <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>{exp.period}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600">{exp.company} • {exp.location}</p>
                        <ul className="list-disc ml-3.5 space-y-0.5 text-xs text-slate-600 leading-relaxed">
                          {exp.bullets.filter(Boolean).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-800">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-[11px]">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600 text-[10px]">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 4: Nordic Elegance */}
            {template === 'nordic_minimal' && (
              <div className="space-y-4 font-serif">
                <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                  <div>
                    <h1 className="text-2xl font-normal tracking-wide text-slate-900">{data.name}</h1>
                    <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-semibold mt-0.5">{data.title}</p>
                  </div>
                  <div className="text-right text-[11px] font-sans text-slate-500 space-y-0.5">
                    <p>{data.email} | {data.phone}</p>
                    <p>{data.location} | {data.website}</p>
                  </div>
                </div>

                {data.summary && (
                  <p className="text-xs text-slate-700 italic leading-relaxed border-l-2 pl-3 border-slate-300">
                    {data.summary}
                  </p>
                )}

                <div className="space-y-3 font-sans">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">Experience</h3>
                  {data.experiences.map(exp => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-serif">
                        <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                        <span className="text-[10px] font-sans text-slate-500">{exp.period}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans">{exp.company} — {exp.location}</p>
                      <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700 mt-1">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans pt-1">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-1.5">Expertise</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{data.skills.join(' • ')}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-1.5">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 5: Compact 1-Page */}
            {template === 'compact_onepage' && (
              <div className="space-y-3 text-xs leading-snug">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: accentColor }}>
                  <div>
                    <h1 className="text-lg font-black text-slate-900">{data.name}</h1>
                    <p className="text-xs font-bold" style={{ color: accentColor }}>{data.title}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <p>{data.email} • {data.phone}</p>
                    <p>{data.location} • {data.website}</p>
                  </div>
                </div>

                {data.summary && (
                  <p className="text-[11px] text-slate-600 leading-tight">{data.summary}</p>
                )}

                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Professional Experience</h3>
                  {data.experiences.map(exp => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{exp.role} — <span className="font-normal text-slate-600">{exp.company}</span></span>
                        <span className="font-mono text-[10px] text-slate-500">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-3.5 space-y-0.5 text-[11px] text-slate-600">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">Key Skills</h3>
                    <p className="text-[11px] text-slate-700 font-medium">{data.skills.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">{edu.degree}</span> ({edu.school})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 6: Left Accent Bar */}
            {template === 'left_accent_bar' && (
              <div className="border-l-4 pl-5 space-y-4" style={{ borderColor: accentColor }}>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">{data.name}</h1>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>{data.title}</p>
                  <p className="text-[11px] text-slate-500">{data.email} | {data.phone} | {data.location} | {data.website}</p>
                </div>

                {data.summary && <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>}

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">Experience</h3>
                  {data.experiences.map(exp => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                        <span>{exp.role} @ {exp.company}</span>
                        <span className="text-[10px] font-mono text-slate-500">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-3.5 space-y-0.5 text-xs text-slate-600">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1 mb-1.5">Skills</h3>
                    <p className="text-xs text-slate-700">{data.skills.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1 mb-1.5">Education</h3>
                    {data.education.map(edu => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-bold">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 7 & 8: Minimal ATS & Developer Dark */}
            {(template === 'minimal_ats' || template === 'developer_dark') && (
              <div className="space-y-4 font-mono text-xs leading-relaxed">
                <div className="border-b border-slate-300 pb-2">
                  <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">{data.name}</h1>
                  <p className="text-xs font-semibold text-slate-700">{data.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {data.email} | {data.phone} | {data.location} | {data.website}
                  </p>
                </div>

                {data.summary && (
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-0.5">=== SUMMARY ===</h3>
                    <p className="text-slate-700">{data.summary}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-1.5">=== EXPERIENCE ===</h3>
                  <div className="space-y-2.5">
                    {data.experiences.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.role} @ {exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <ul className="list-disc ml-3.5 space-y-0.5 text-slate-700 mt-0.5">
                          {exp.bullets.filter(Boolean).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-0.5">=== SKILLS ===</h3>
                  <p className="text-slate-800 font-semibold">{data.skills.join(', ')}</p>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-0.5">=== EDUCATION ===</h3>
                  {data.education.map(edu => (
                    <div key={edu.id} className="text-slate-700">
                      <span className="font-bold text-slate-900">{edu.degree}</span> — {edu.school} ({edu.year})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
