import Link from "next/link";
import { MessageSquare, Calendar, FileText, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function Home() {
  const tools = [
    {
      name: "Campaign Message Drafter",
      description: "Draft polished, on-brand internal announcements, Slack updates, or company-wide emails tailored to your target audience.",
      href: "/campaign",
      icon: MessageSquare,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/10",
      features: ["Tone Customization", "Audience Targeting", "Slack/Email Formats"],
    },
    {
      name: "Meeting Agenda Generator",
      description: "Create highly structured, time-blocked meeting agendas with assigned discussion leads and clear objectives per section.",
      href: "/agenda",
      icon: Calendar,
      color: "from-purple-500 to-pink-600",
      shadow: "shadow-purple-500/10",
      features: ["Duration Time Blocks", "Role Assignments", "Objective Mapping"],
    },
    {
      name: "Follow-up Summarizer",
      description: "Transform chaotic, raw meeting bullet points and notes into a professional executive summary with clear, assignable action items.",
      href: "/summary",
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/10",
      features: ["Auto-Summary", "Action Item Tracker", "Owner & Due Dates"],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-between overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="container mx-auto px-6 py-16 md:py-24 flex-1 flex flex-col justify-center relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-indigo-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Empowering Internal Communications with AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6">
            Make Corporate Comms <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fast, Precise & Effective
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-normal leading-relaxed">
            The ultimate productivity suite for communications leads. Draft announcements, schedule meeting agendas, and summarize notes in seconds.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl ${t.shadow} backdrop-blur-md`}
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-white shadow-lg mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3">
                    {t.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.description}
                  </p>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {t.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs font-medium text-slate-300 bg-white/5 border border-white/5 rounded-md px-2 py-1"
                      >
                        <CheckCircle2 className="h-3 w-3 text-indigo-400 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-md py-6 z-10">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} CommsAI Pro. Designed for high-performance communication teams.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 transition-colors cursor-default flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-slate-400" /> Powered by Claude & Gemini
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-default flex items-center">
              <Users className="h-4 w-4 mr-1 text-slate-400" /> Internal Use Only
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
