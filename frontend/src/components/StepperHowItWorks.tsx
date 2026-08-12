import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  CalendarPlus, 
  Share2, 
  UserCheck, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Copy, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Ticket,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Create Workspace',
    subtitle: 'Setup an isolated environment for your organization, team, or community chapter.',
    icon: Building2,
    details: [
      'Define custom workspace name & branding',
      'Automatic Owner (Admin) role assignment',
      'Invite team co-hosts & workspace members'
    ],
    actionText: 'Next: Schedule Event',
    previewType: 'workspace'
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Schedule Event',
    subtitle: 'Fill in event details, set seat capacities, venue location, and upload cover art.',
    icon: CalendarPlus,
    details: [
      'Set seat limits & registration prices',
      'Location, category & date scheduling',
      'Instant default published status'
    ],
    actionText: 'Next: Share & Invite',
    previewType: 'event'
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Invite & Share',
    subtitle: 'Distribute your event URL to workspace members or make it public for everyone.',
    icon: Share2,
    details: [
      'One-click shareable public event link',
      'Instant RSVP & ticket generation',
      'Social & messaging share previews'
    ],
    actionText: 'Next: Track Attendees',
    previewType: 'share'
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Track Registrations',
    subtitle: 'Monitor attendee RSVPs in real-time and manage guest entry list effortlessly.',
    icon: UserCheck,
    details: [
      'Real-time confirmed attendee count',
      'Workspace isolated dashboard feed',
      'Instant RSVP ticket cancellation'
    ],
    actionText: 'Launch Your Workspace',
    previewType: 'analytics'
  }
];

export const StepperHowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const currentStep = STEPS[activeStep];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      {/* Top Stepper Track (Horizontal Progress Bar) */}
      <div className="relative mb-12 px-4">
        {/* Progress Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-neutral-200/70 -translate-y-1/2 z-0 hidden md:block rounded-full" />
        <div 
          className="absolute top-1/2 left-8 h-1 bg-neutral-950 -translate-y-1/2 z-0 hidden md:block transition-all duration-500 rounded-full"
          style={{ width: `${(activeStep / (STEPS.length - 1)) * 88}%` }}
        />

        {/* Step Nodes Row */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
          {STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className="flex-1 group flex md:flex-col items-center gap-3 md:gap-2.5 focus:outline-none cursor-pointer text-left md:text-center w-full"
              >
                {/* Node Pill Icon */}
                <div 
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 font-extrabold ${
                    isActive 
                      ? 'bg-neutral-950 text-white shadow-xl shadow-neutral-950/20 scale-110 ring-4 ring-neutral-950/10' 
                      : isCompleted
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-800'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} className="stroke-[3]" />
                  ) : (
                    <span className="text-sm font-mono font-black">{step.id}</span>
                  )}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-neutral-950 ring-2 ring-white" />
                  )}
                </div>

                {/* Step Label */}
                <div className="flex flex-col">
                  <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-neutral-950' : 'text-neutral-400'
                  }`}>
                    Step 0{step.id}
                  </span>
                  <span className={`text-xs font-bold transition-colors ${
                    isActive ? 'text-neutral-900 font-extrabold' : 'text-neutral-500 group-hover:text-neutral-800'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Step Content Box */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-neutral-200/90 p-6 md:p-10 shadow-2xl shadow-neutral-200/60 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[340px]"
          >
            {/* Left Column: Copy & Details */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Big Bold Watermark Number on Left Above Text */}
                <div className="text-neutral-100 font-display font-black text-6xl sm:text-7xl select-none pointer-events-none tracking-tighter leading-none mb-1">
                  0{currentStep.id}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-display leading-tight">
                  {currentStep.title}
                </h3>

                <p className="text-sm text-neutral-500 font-medium mt-3 leading-relaxed">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Bullet Highlights */}
              <ul className="space-y-3 pt-2">
                {currentStep.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-semibold text-neutral-800">
                    <div className="h-5 w-5 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                      <Check size={11} className="stroke-[3]" />
                    </div>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom Text Link Navigation Controls */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between gap-4 select-none">
                {/* Previous Text Link */}
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeStep === 0
                      ? 'opacity-0 pointer-events-none'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  <ChevronLeft size={15} />
                  <span>Previous step</span>
                </button>

                {/* Next / CTA Text Link */}
                {activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-950 hover:text-neutral-600 transition-colors cursor-pointer group"
                  >
                    <span>{currentStep.actionText}</span>
                    <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-950 hover:text-neutral-600 transition-colors group"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Visual Mockup Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-black p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-neutral-800/90 backdrop-blur-md">

                {/* Step Mockup 1: Workspace Creation */}
                {currentStep.previewType === 'workspace' && (
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
                          P
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Acme Corp Workshops</p>
                          <p className="text-[10px] text-neutral-400">Workspace Owner Admin</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white border border-white/20">
                        Active Workspace
                      </span>
                    </div>

                    <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span>Organization Members</span>
                        <span className="font-bold text-white">12 Invited</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-3/4 rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-white" /> Multi-Tenant Scope
                      </span>
                      <span className="text-neutral-400">Planora SaaS</span>
                    </div>
                  </div>
                )}

                {/* Step Mockup 2: Schedule Event */}
                {currentStep.previewType === 'event' && (
                  <div className="space-y-5 relative z-10">
                    <div className="aspect-[16/8] rounded-xl bg-neutral-900 overflow-hidden relative border border-white/10">
                      <img 
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" 
                        alt="Event Mockup" 
                        className="w-full h-full object-cover opacity-90"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white text-black backdrop-blur-sm">
                        Technical
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-white">AI & Next-Gen Tech Summit 2026</h4>
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> Aug 24, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> Main Auditorium
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs font-bold border-t border-neutral-800">
                      <span className="text-neutral-400">Seat Capacity: 250</span>
                      <span className="text-white font-mono">Status: Published</span>
                    </div>
                  </div>
                )}

                {/* Step Mockup 3: Share & Invite */}
                {currentStep.previewType === 'share' && (
                  <div className="space-y-5 relative z-10">
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-neutral-300">Public Registration Link</p>
                      <p className="text-[11px] text-neutral-400">Share with guests or workspace members</p>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/15">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://planora.events/e/tech-summit-2026" 
                        className="bg-transparent text-xs text-neutral-200 px-2 flex-grow focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold flex items-center gap-1 hover:bg-neutral-200 transition"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 size={13} className="text-black" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <Ticket size={18} className="mx-auto mb-1 text-white" />
                        <p className="text-[11px] font-bold text-white">Instant Tickets</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <Zap size={18} className="mx-auto mb-1 text-white" />
                        <p className="text-[11px] font-bold text-white">Zero Ticket Fees</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Mockup 4: Analytics & RSVP Tracking */}
                {currentStep.previewType === 'analytics' && (
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-white">Live RSVP Analytics</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-white">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> Live Tracking
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[11px] text-neutral-400">Confirmed RSVPs</p>
                        <p className="text-2xl font-black text-white mt-1">184 <span className="text-xs text-neutral-400 font-normal">/ 250</span></p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[11px] text-neutral-400">Available Seats</p>
                        <p className="text-2xl font-black text-white mt-1">66</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-neutral-200">
                      <span>Recent RSVP: Alex Johnson</span>
                      <span className="font-mono text-[10px] text-neutral-400">2 mins ago</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
