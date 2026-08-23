import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Trash2,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Check,
  Sparkles,
  Layout,
  Palette,
  FileCheck,
  ExternalLink,
  Layers,
  FolderGit2,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export type TemplateType =
  | 'modern_tech'
  | 'faang_ats_perfect'
  | 'executive_clean'
  | 'ivy_league_serif'
  | 'modern_sidebar_obsidian'
  | 'creative_indigo'
  | 'berlin_creative_studio'
  | 'nordic_minimal'
  | 'compact_onepage'
  | 'left_accent_bar'
  | 'deloitte_corporate'
  | 'tokyo_metro_minimal'
  | 'monochrome_bold'
  | 'minimal_ats';

type ColorAccent =
  | '#2563eb'
  | '#059669'
  | '#7c3aed'
  | '#e11d48'
  | '#0f172a'
  | '#d97706'
  | '#0891b2'
  | '#475569';

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
  summary:
    'Passionate and results-driven Senior Fullstack Engineer with 7+ years of experience architecting high-scale distributed web applications, cloud systems, and responsive frontends using React, TypeScript, Node.js, and modern DevOps tools.',
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
        'Reduced bundle size by 42% and improved Core Web Vitals score to 98/100 using Vite code-splitting and dynamic imports.',
        'Mentored 6 junior and mid-level engineers, establishing company-wide TypeScript quality standards and CI/CD pipelines.',
      ],
    },
    {
      id: '2',
      role: 'Senior Software Engineer',
      company: 'Apex Cloud Solutions',
      location: 'Remote',
      period: '2019 - 2022',
      bullets: [
        'Designed and scaled high-throughput GraphQL APIs and microservices handling 15M+ daily requests with 99.99% uptime.',
        'Implemented end-to-end testing with Vitest and Playwright, achieving 92% code coverage across critical customer paths.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2015 - 2019',
      details: 'Magna Cum Laude • Dean\'s Honor List',
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'GraphQL',
    'Tailwind CSS',
    'PostgreSQL',
    'Redis',
    'Docker',
    'AWS',
    'CI/CD',
    'System Design',
  ],
  projects: [
    {
      id: '1',
      title: 'Vortexero Web Utilities Suite',
      tech: 'React, TypeScript, Tailwind CSS, Web Audio API',
      description: 'Open-source 53-tool suite offering instant browser-based productivity, cryptographic security, and designer utilities.',
      link: 'https://vortexero-tool.vercel.app',
    },
    {
      id: '2',
      title: 'Cloud Orchestrator CLI',
      tech: 'Go, Docker API, Kubernetes',
      description: 'Lightweight developer CLI to orchestrate local multi-container development environments with auto-reloading.',
    },
  ],
};

const PRESET_SOK_SAN: CvData = {
  name: 'Sok San',
  title: 'Lead Product & UI/UX Designer',
  email: 'soksan.design@example.com',
  phone: '+855 12 345 678',
  location: 'Phnom Penh, Cambodia',
  website: 'https://soksan.design',
  linkedin: 'linkedin.com/in/soksan-ux',
  github: 'github.com/soksan',
  summary:
    'Award-winning Product Designer with 6+ years specializing in design systems, high-converting mobile fintech apps, and accessible SaaS user experiences across Southeast Asia and global markets.',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  showPhoto: true,
  experiences: [
    {
      id: '1',
      role: 'Lead UI/UX Designer',
      company: 'Mekong Digital Bank',
      location: 'Phnom Penh, Cambodia',
      period: '2021 - Present',
      bullets: [
        'Spearheaded the complete redesign of mobile banking app, boosting daily active transactions by 65%.',
        'Built unified multi-brand design system with 200+ accessible Figma components used by 18 designers and 40 developers.',
      ],
    },
    {
      id: '2',
      role: 'Senior Product Designer',
      company: 'Innovate Asia Lab',
      location: 'Phnom Penh, Cambodia',
      period: '2018 - 2021',
      bullets: [
        'Conducted 50+ user research and usability testing sessions for consumer logistics and payment platforms.',
        'Designed end-to-end checkout flow resulting in 28% drop in cart abandonment.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.A. in Visual Arts & Interactive Design',
      school: 'Royal University of Fine Arts',
      year: '2014 - 2018',
      details: 'Valedictorian • Outstanding Graduate Award',
    },
  ],
  skills: [
    'Figma',
    'Design Systems',
    'User Research',
    'Wireframing',
    'Rapid Prototyping',
    'Design Tokens',
    'Accessibility (WCAG)',
    'UI Interaction',
    'HTML/CSS',
  ],
  projects: [
    {
      id: '1',
      title: 'Mekong Pay Mobile Wallet',
      tech: 'Figma, Design Tokens, Micro-interactions',
      description: 'Seamless QR payment and cross-border remittance app serving 1.2M+ active consumers.',
    },
  ],
};

const PRESET_ELENA_VANCE: CvData = {
  name: 'Elena Vance',
  title: 'Strategy & Management Consultant',
  email: 'elena.vance@consulting.org',
  phone: '+1 (212) 555-0199',
  location: 'New York, NY',
  website: 'https://elenavance.com',
  linkedin: 'linkedin.com/in/elenavance',
  github: '',
  summary:
    'Results-driven Management Consultant with 8+ years advising Fortune 500 executives on digital transformation, operational efficiency, and M&A integration across technology, financial services, and healthcare sectors.',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
  showPhoto: false,
  experiences: [
    {
      id: '1',
      role: 'Engagement Manager',
      company: 'McKinsey & Company',
      location: 'New York, NY',
      period: '2021 - Present',
      bullets: [
        'Led 12 cross-functional strategy engagements delivering $180M in cumulative operational cost savings for enterprise clients.',
        'Managed workstreams of 8 senior consultants, directing market analysis, financial modeling, and executive roadmaps.',
      ],
    },
    {
      id: '2',
      role: 'Senior Strategy Consultant',
      company: 'Boston Consulting Group (BCG)',
      location: 'Boston, MA',
      period: '2018 - 2021',
      bullets: [
        'Designed go-to-market commercialization strategy for high-growth SaaS division, accelerating year-one ARR to $45M.',
        'Conducted commercial due diligence for 6 private equity transactions valued at over $3.2B.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Business Administration (MBA)',
      school: 'Harvard Business School',
      year: '2016 - 2018',
      details: 'Baker Scholar (Top 5% of Class)',
    },
    {
      id: '2',
      degree: 'B.S. in Economics & Applied Math',
      school: 'Yale University',
      year: '2012 - 2016',
      details: 'Summa Cum Laude • Phi Beta Kappa',
    },
  ],
  skills: [
    'Corporate Strategy',
    'Financial Modeling',
    'M&A Integration',
    'Digital Transformation',
    'Executive Stakeholder Management',
    'Cost Optimization',
    'Go-to-Market (GTM)',
  ],
  projects: [],
};

export const CvBuilder: React.FC = () => {
  const [data, setData] = useState<CvData>(PRESET_JOHN_DOE);
  const [template, setTemplate] = useState<TemplateType>('modern_sidebar_obsidian');
  const [accentColor, setAccentColor] = useState<ColorAccent>('#2563eb');
  const [newSkill, setNewSkill] = useState<string>('');
  const [viewTab, setViewTab] = useState<'split' | 'edit_only' | 'preview_only'>('split');

  const { addToast } = useToast();

  const handlePrint = () => {
    const element = document.getElementById('cv-print-document');
    if (!element) return;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${data.name} - Resume</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
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
              min-height: 100%;
            }
            .cv-container {
              width: 100% !important;
              min-height: 100vh !important;
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
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
          bullets: ['Key responsibility or quantified achievement.'],
        },
      ],
    });
  };

  const handleDeleteExperience = (id: string) => {
    setData({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
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
          details: 'Honors or Activities',
        },
      ],
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setData({ ...data, skills: [...data.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skill) });
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
    { color: '#0891b2', label: 'Cyan Tech' },
    { color: '#475569', label: 'Steel Gray' },
  ];

  const templatesList: { id: TemplateType; label: string; badge?: string }[] = [
    { id: 'modern_sidebar_obsidian', label: 'Zurich Slate Grid', badge: 'Popular' },
    { id: 'faang_ats_perfect', label: 'FAANG Standard (ATS)', badge: 'Recommended' },
    { id: 'modern_tech', label: 'Modern Tech (2-Col)' },
    { id: 'ivy_league_serif', label: 'Ivy League Serif', badge: 'Classic' },
    { id: 'berlin_creative_studio', label: 'Berlin Portfolio UI' },
    { id: 'executive_clean', label: 'Executive Clean' },
    { id: 'creative_indigo', label: 'Creative Banner' },
    { id: 'deloitte_corporate', label: 'Corporate Consulting' },
    { id: 'tokyo_metro_minimal', label: 'Tokyo Minimalist' },
    { id: 'monochrome_bold', label: 'NYC Monochrome' },
    { id: 'nordic_minimal', label: 'Nordic Elegance' },
    { id: 'compact_onepage', label: 'Compact 1-Page' },
    { id: 'left_accent_bar', label: 'Accent Border' },
    { id: 'minimal_ats', label: 'Plaintext ATS' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action & Template Selector Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Preset Profiles */}
        <div className="flex flex-wrap items-center gap-2">
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
            Sok San (UI/UX)
          </button>
          <button
            onClick={() => setData(PRESET_ELENA_VANCE)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Elena Vance (Consulting)
          </button>
        </div>

        {/* View Mode & Print Action */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewTab('split')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewTab === 'split' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewTab('edit_only')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewTab === 'edit_only' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setViewTab('preview_only')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewTab === 'preview_only' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Preview Only
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Template & Color Selector Ribbon */}
      <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Layout size={15} className="text-brand-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Professional Resume Template ({templatesList.length} Layouts)
            </span>
          </div>

          {/* Accent Color Swatches */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Accent:</span>
            {colorOptions.map((c) => (
              <button
                key={c.color}
                onClick={() => setAccentColor(c.color)}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer border-2 ${
                  accentColor === c.color ? 'scale-125 border-white shadow-md' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Template Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {templatesList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex flex-col items-start gap-0.5 transition-all cursor-pointer truncate ${
                template === t.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02] ring-2 ring-brand-400/40'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span className="truncate w-full text-left">{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                    template === t.id ? 'bg-white/20 text-white' : 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Grid: Editor + A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form Panel */}
        {viewTab !== 'preview_only' && (
          <div className={`space-y-6 ${viewTab === 'split' ? 'lg:col-span-5' : 'col-span-12'}`}>
            {/* Personal Details */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                <span>Personal Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Website / Portfolio</label>
                  <input
                    type="text"
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* Photo Options */}
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
                            experiences: data.experiences.map((item) =>
                              item.id === exp.id ? { ...item, role: e.target.value } : item
                            ),
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
                            experiences: data.experiences.map((item) =>
                              item.id === exp.id ? { ...item, company: e.target.value } : item
                            ),
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
                            experiences: data.experiences.map((item) =>
                              item.id === exp.id ? { ...item, period: e.target.value } : item
                            ),
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
                          experiences: data.experiences.map((item) =>
                            item.id === exp.id ? { ...item, bullets: e.target.value.split('\n') } : item
                          ),
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
                {data.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 group"
                  >
                    <span>{s}</span>
                    <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-500 font-bold">
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
            className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 font-sans w-full overflow-hidden"
          >
            {/* TEMPLATE 1: Zurich Slate Sidebar Grid (Fixed Seamless Edge-to-Edge) */}
            {template === 'modern_sidebar_obsidian' && (
              <div className="grid grid-cols-12 min-h-[960px] bg-white text-slate-900">
                {/* Left Dark Sidebar with 100% Height */}
                <div className="col-span-4 bg-[#0f172a] text-white p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    {data.showPhoto && data.photoUrl && (
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-slate-600 mx-auto shadow-lg ring-4 ring-white/10">
                        <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="text-center space-y-1">
                      <h1 className="text-xl font-black tracking-tight text-white leading-tight">{data.name}</h1>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                        {data.title}
                      </p>
                    </div>

                    <div className="space-y-2.5 text-[11px] text-slate-300 pt-3 border-t border-slate-800/80">
                      {data.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{data.email}</span>
                        </div>
                      )}
                      {data.phone && (
                        <div className="flex items-center gap-2 truncate">
                          <Phone size={13} className="text-slate-400 shrink-0" />
                          <span>{data.phone}</span>
                        </div>
                      )}
                      {data.location && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span>{data.location}</span>
                        </div>
                      )}
                      {data.website && (
                        <div className="flex items-center gap-2 truncate">
                          <Globe size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{data.website}</span>
                        </div>
                      )}
                      {data.linkedin && (
                        <div className="flex items-center gap-2 truncate">
                          <Linkedin size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{data.linkedin}</span>
                        </div>
                      )}
                      {data.github && (
                        <div className="flex items-center gap-2 truncate">
                          <Github size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{data.github}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Core Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 text-[10px] font-medium border border-slate-700/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Education at bottom of sidebar */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Education</h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px] space-y-0.5">
                        <p className="font-bold text-white leading-snug">{edu.degree}</p>
                        <p className="text-slate-400 text-[10px]">{edu.school}</p>
                        <p className="text-slate-500 text-[9px] font-mono">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clean Right Body */}
                <div className="col-span-8 p-6 sm:p-8 space-y-5 bg-white text-slate-900">
                  {data.summary && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                        Professional Summary
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                      Work Experience
                    </h3>
                    <div className="space-y-3.5">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                            <span className="text-[10px] font-mono text-slate-500 font-semibold">{exp.period}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600">
                            {exp.company} • {exp.location}
                          </p>
                          <ul className="list-disc ml-3.5 space-y-0.5 text-xs text-slate-600 leading-relaxed">
                            {exp.bullets.filter(Boolean).map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {data.projects.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                        Key Projects
                      </h3>
                      {data.projects.map((p) => (
                        <div key={p.id} className="text-xs space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-900">{p.title}</span>
                            <span className="text-slate-500 text-[10px] font-mono">({p.tech})</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEMPLATE 2: Modern Tech Two-Column */}
            {template === 'modern_tech' && (
              <div className="grid grid-cols-12 p-6 sm:p-10 gap-6 min-h-[960px]">
                {/* Left Sidebar */}
                <div className="col-span-4 border-r border-slate-200 pr-5 space-y-4">
                  {data.showPhoto && data.photoUrl && (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mx-auto">
                      <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{data.name}</h1>
                    <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>
                      {data.title}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    {data.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail size={12} style={{ color: accentColor }} />
                        <span>{data.email}</span>
                      </div>
                    )}
                    {data.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone size={12} style={{ color: accentColor }} />
                        <span>{data.phone}</span>
                      </div>
                    )}
                    {data.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={12} style={{ color: accentColor }} />
                        <span>{data.location}</span>
                      </div>
                    )}
                    {data.website && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe size={12} style={{ color: accentColor }} />
                        <span>{data.website}</span>
                      </div>
                    )}
                    {data.github && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Github size={12} style={{ color: accentColor }} />
                        <span>{data.github}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Education</h3>
                    {data.education.map((edu) => (
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
                      <h3 className="text-[11px] font-black uppercase tracking-wider" style={{ color: accentColor }}>
                        Profile Summary
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-1" style={{ color: accentColor }}>
                      Work Experience
                    </h3>
                    <div className="space-y-3">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                            <span className="text-[10px] font-mono text-slate-500">{exp.period}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600">
                            {exp.company} • {exp.location}
                          </p>
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
                      <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-1" style={{ color: accentColor }}>
                        Featured Projects
                      </h3>
                      {data.projects.map((prj) => (
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

            {/* TEMPLATE 3: FAANG Standard (ATS Perfect) */}
            {template === 'faang_ats_perfect' && (
              <div className="p-6 sm:p-10 space-y-3.5 text-slate-900 text-xs min-h-[960px]">
                {/* Header */}
                <div className="text-center space-y-1 border-b border-slate-300 pb-2.5">
                  <h1 className="text-2xl font-black uppercase tracking-tight">{data.name}</h1>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-700">
                    <span>{data.location}</span>
                    <span>|</span>
                    <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>
                    <span>|</span>
                    <span>{data.phone}</span>
                    {data.linkedin && (
                      <>
                        <span>|</span>
                        <span>{data.linkedin}</span>
                      </>
                    )}
                    {data.github && (
                      <>
                        <span>|</span>
                        <span>{data.github}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {data.summary && (
                  <div className="space-y-0.5">
                    <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                      Summary
                    </h2>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{data.summary}</p>
                  </div>
                )}

                {/* Experience */}
                <div className="space-y-2.5">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                    Professional Experience
                  </h2>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{exp.company} <span className="font-normal text-slate-600">| {exp.role}</span></span>
                        <span className="font-mono text-[10px] text-slate-600">{exp.period}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">{exp.location}</p>
                      <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-slate-700 leading-relaxed">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                {data.projects.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                      Technical Projects
                    </h2>
                    {data.projects.map((p) => (
                      <div key={p.id} className="text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span>{p.title} <span className="font-normal text-slate-600 font-mono text-[10px]">({p.tech})</span></span>
                        </div>
                        <p className="text-slate-700">{p.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                    Technical Skills
                  </h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Core Technologies:</span> {data.skills.join(', ')}
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                    Education
                  </h2>
                  {data.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between text-[11px]">
                      <div>
                        <span className="font-bold">{edu.school}</span> — {edu.degree}
                        {edu.details && <span className="text-slate-500 italic"> ({edu.details})</span>}
                      </div>
                      <span className="font-mono text-slate-600 text-[10px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEMPLATE 4: Ivy League Classical Serif */}
            {template === 'ivy_league_serif' && (
              <div className="p-6 sm:p-10 space-y-4 font-serif text-slate-900 min-h-[960px]">
                <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
                  <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
                  <p className="text-xs italic text-slate-600">{data.title}</p>
                  <div className="flex flex-wrap justify-center gap-3 text-[11px] font-sans text-slate-600">
                    <span>{data.location}</span>
                    <span>•</span>
                    <span>{data.email}</span>
                    <span>•</span>
                    <span>{data.phone}</span>
                    {data.website && <><span>•</span><span>{data.website}</span></>}
                  </div>
                </div>

                {data.summary && (
                  <div className="space-y-1">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                      Executive Profile
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed italic">{data.summary}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                    Experience & Appointments
                  </h2>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{exp.role}, <span className="font-normal italic">{exp.company}</span></span>
                        <span className="font-sans text-[10px] text-slate-500">{exp.period}</span>
                      </div>
                      <p className="text-[10px] font-sans text-slate-500">{exp.location}</p>
                      <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700 leading-relaxed font-sans">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 font-sans">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Areas of Expertise
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed">{data.skills.join(' • ')}</p>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Academic Background
                    </h2>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500 font-serif italic">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 5: Berlin Creative Portfolio UI */}
            {template === 'berlin_creative_studio' && (
              <div className="p-6 sm:p-10 space-y-4 min-h-[960px]">
                <div className="flex items-start justify-between gap-4 border-b-4 pb-4" style={{ borderColor: accentColor }}>
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: accentColor }}>
                      Portfolio & CV
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">{data.name}</h1>
                    <p className="text-sm font-bold text-slate-600">{data.title}</p>
                  </div>

                  {data.showPhoto && data.photoUrl && (
                    <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-md shrink-0">
                      <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
                  <span>{data.email}</span>
                  <span>•</span>
                  <span>{data.phone}</span>
                  <span>•</span>
                  <span>{data.location}</span>
                  {data.website && <><span>•</span><span className="font-bold text-slate-900">{data.website}</span></>}
                </div>

                {data.summary && (
                  <p className="text-xs text-slate-700 leading-relaxed p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    {data.summary}
                  </p>
                )}

                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Career History</h2>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">{exp.role} @ {exp.company}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-600 mt-1">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Skillset</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Education</h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 6: Executive Clean */}
            {template === 'executive_clean' && (
              <div className="p-6 sm:p-10 space-y-4 min-h-[960px]">
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
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">
                          {exp.role} — <span className="font-medium text-slate-600">{exp.company}</span>
                        </span>
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
                      {data.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-800 font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Education</h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px]">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600 text-[10px]">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 7: Creative Banner */}
            {template === 'creative_indigo' && (
              <div className="p-6 sm:p-10 space-y-4 min-h-[960px]">
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
                    {data.experiences.map((exp) => (
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
                      {data.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-800">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Education</h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px]">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600 text-[10px]">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 8: Corporate Consulting */}
            {template === 'deloitte_corporate' && (
              <div className="p-6 sm:p-10 space-y-3.5 text-xs min-h-[960px]">
                <div className="border-b-2 pb-3 flex justify-between items-end" style={{ borderColor: accentColor }}>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">{data.name}</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-0.5">{data.title}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 space-y-0.5 font-medium">
                    <p>{data.email} | {data.phone}</p>
                    <p>{data.location} {data.linkedin && `| ${data.linkedin}`}</p>
                  </div>
                </div>

                {data.summary && (
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Executive Profile</h3>
                    <p className="text-slate-700 leading-relaxed">{data.summary}</p>
                  </div>
                )}

                <div className="space-y-2.5">
                  <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 text-slate-800">
                    Professional Engagements
                  </h3>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.role} — <span className="font-normal text-slate-700">{exp.company}</span></span>
                        <span className="font-mono text-[10px] text-slate-500">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-slate-700 leading-relaxed">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1 text-slate-800">
                      Core Competencies
                    </h3>
                    <p className="text-[11px] text-slate-700 font-medium">{data.skills.join(' • ')}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1 text-slate-800">
                      Education & Honors
                    </h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">{edu.degree}</span> ({edu.school}, {edu.year})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 9: Tokyo Minimalist */}
            {template === 'tokyo_metro_minimal' && (
              <div className="p-6 sm:p-10 space-y-3.5 font-sans text-xs min-h-[960px]">
                <div className="flex justify-between items-baseline border-b border-slate-300 pb-2">
                  <div>
                    <h1 className="text-xl font-bold tracking-widest uppercase text-slate-900">{data.name}</h1>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{data.title}</p>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500">
                    <p>{data.email}</p>
                    <p>{data.phone} • {data.location}</p>
                  </div>
                </div>

                {data.summary && <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{data.summary}</p>}

                <div className="space-y-2.5">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">01 / EXPERIENCE</h3>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="pl-3 border-l-2 border-slate-300 space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role} <span className="font-normal text-slate-500">({exp.company})</span></span>
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

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">02 / SKILLS</h3>
                    <p className="text-[11px] text-slate-700 font-mono">{data.skills.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">03 / EDUCATION</h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px] text-slate-700 font-mono">
                        {edu.degree} — {edu.school} ({edu.year})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 10: NYC High-Impact Monochrome */}
            {template === 'monochrome_bold' && (
              <div className="p-6 sm:p-10 space-y-4 text-slate-950 text-xs min-h-[960px]">
                <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">{data.name}</h1>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-300 mt-0.5">{data.title}</p>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-300">
                    <p>{data.email}</p>
                    <p>{data.phone}</p>
                    <p>{data.location}</p>
                  </div>
                </div>

                {data.summary && (
                  <div className="space-y-1">
                    <h3 className="font-black uppercase tracking-wider text-[11px] text-black">Profile</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{data.summary}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-black uppercase tracking-wider text-[11px] text-black border-b-2 border-black pb-0.5">
                    Experience
                  </h3>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between font-black text-xs">
                        <span>{exp.role} — <span className="font-bold text-slate-600">{exp.company}</span></span>
                        <span className="font-mono text-[10px]">{exp.period}</span>
                      </div>
                      <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <h3 className="font-black uppercase tracking-wider text-[11px] text-black border-b-2 border-black pb-0.5 mb-1.5">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-wider text-[11px] text-black border-b-2 border-black pb-0.5 mb-1.5">
                      Education
                    </h3>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <p className="font-bold">{edu.degree}</p>
                        <p className="text-slate-600 text-[11px]">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 11: Nordic Elegance */}
            {template === 'nordic_minimal' && (
              <div className="p-6 sm:p-10 space-y-4 font-serif min-h-[960px]">
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
                  {data.experiences.map((exp) => (
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
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.school} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 12: Compact 1-Page */}
            {template === 'compact_onepage' && (
              <div className="p-6 sm:p-10 space-y-3 text-xs leading-snug min-h-[960px]">
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

                {data.summary && <p className="text-[11px] text-slate-600 leading-tight">{data.summary}</p>}

                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Professional Experience</h3>
                  {data.experiences.map((exp) => (
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
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">{edu.degree}</span> ({edu.school})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 13: Left Accent Bar */}
            {template === 'left_accent_bar' && (
              <div className="p-6 sm:p-10 border-l-4 pl-5 space-y-4 min-h-[960px]" style={{ borderColor: accentColor }}>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">{data.name}</h1>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>{data.title}</p>
                  <p className="text-[11px] text-slate-500">{data.email} | {data.phone} | {data.location} | {data.website}</p>
                </div>

                {data.summary && <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>}

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">Experience</h3>
                  {data.experiences.map((exp) => (
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
                    {data.education.map((edu) => (
                      <div key={edu.id} className="text-xs text-slate-700">
                        <p className="font-bold">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 14: Minimal Plaintext ATS */}
            {template === 'minimal_ats' && (
              <div className="p-6 sm:p-10 space-y-4 font-mono text-xs leading-relaxed min-h-[960px]">
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
                    {data.experiences.map((exp) => (
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
                  {data.education.map((edu) => (
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
