"use client";

import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Mail,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Support", href: "#support" },
  { label: "Contact", action: "contact" },
];

const whyUsPoints = [
  {
    icon: UserRound,
    title: "Client-Centered Approach",
    description: "We design around your goals, users, and long-term business growth.",
  },
  {
    icon: Sparkles,
    title: "Custom Solutions, Not Templates",
    description: "Every product is crafted for your workflow, brand, and ambitions.",
  },
  {
    icon: Building2,
    title: "Modern Technologies",
    description: "We build with current, reliable stacks that scale with your needs.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-Focused Development",
    description: "Clean architecture, performance, and thoughtful UX are built in from day one.",
  },
  {
    icon: MessageSquareText,
    title: "Reliable Communication",
    description: "Clear updates, honest timelines, and collaborative decision-making.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Long-Term Technology Partnership",
    description: "We help you evolve, refine, and grow your digital platform over time.",
  },
];

const services = [
  {
    title: "Web Development",
    detail: "Modern, responsive websites and web applications.",
    icon: GlobeIcon,
  },
  {
    title: "Mobile Application Development",
    detail: "Functional and user-friendly Android and iOS applications.",
    icon: SmartphoneIcon,
  },
  {
    title: "Custom Software Development",
    detail: "Tailored software designed around specific business requirements.",
    icon: CodeIcon,
  },
  {
    title: "AI-Powered Solutions",
    detail: "Intelligent digital solutions that use AI to solve practical problems.",
    icon: BrainIcon,
  },
  {
    title: "Business Automation",
    detail: "Streamlined workflows and custom automation solutions.",
    icon: WorkflowIcon,
  },
];

const contactOptions = [
  {
    platform: "LinkedIn",
    value: "relyqon01",
    href: "https://www.linkedin.com/company/relyqon01/",
    icon: BriefcaseBusiness,
  },
  {
    platform: "Email",
    value: "relyqon@gmail.com",
    href: "mailto:relyqon@gmail.com",
    icon: Mail,
  },
  {
    platform: "Instagram",
    value: "@relyqon",
    href: "https://www.instagram.com/relyqon?exln=Nmhld2RxYmh4cnEz",
    icon: Camera,
  },
];

const initialIdeaForm = { email: "", message: "", website: "" };
const initialSupportForm = { name: "", email: "", problem: "", website: "" };

async function getResponseMessage(response: Response) {
  try {
    const data: unknown = await response.json();

    if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export default function Home() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [ideaForm, setIdeaForm] = useState(initialIdeaForm);
  const [ideaStatus, setIdeaStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [ideaSubmitting, setIdeaSubmitting] = useState(false);
  const [supportForm, setSupportForm] = useState(initialSupportForm);
  const [supportStatus, setSupportStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const ideaSubmittingRef = useRef(false);
  const supportSubmittingRef = useRef(false);
  const contactDialogRef = useRef<HTMLDivElement>(null);
  const contactCloseButtonRef = useRef<HTMLButtonElement>(null);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const navigationToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = ["home", "about", "support"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(`#${visibleSection.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isContactOpen) return;

    const returnFocusTarget = contactTriggerRef.current;
    const fallbackFocusTarget = navigationToggleRef.current;
    contactCloseButtonRef.current?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusable = contactDialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");

        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const focusIsOutsideDialog = !contactDialogRef.current?.contains(document.activeElement);

        if (focusIsOutsideDialog || (event.shiftKey && document.activeElement === first)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (returnFocusTarget?.isConnected) {
        returnFocusTarget.focus();
      } else {
        fallbackFocusTarget?.focus();
      }
    };
  }, [isContactOpen]);

  const handleNavClick = (target: string) => {
    const section = document.getElementById(target.replace("#", ""));
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileNavOpen(false);
  };

  const handleIdeaSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ideaSubmittingRef.current) return;
    ideaSubmittingRef.current = true;
    setIdeaSubmitting(true);
    setIdeaStatus({ type: "idle", message: "" });

    const payload = {
      email: ideaForm.email,
      message: ideaForm.message,
      website: ideaForm.website,
    };

    try {
      const response = await fetch("/api/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const message = await getResponseMessage(response);

      if (!response.ok) {
        throw new Error(message ?? "Unable to send your idea right now.");
      }

      setIdeaStatus({ type: "success", message: message ?? "Your idea was sent successfully." });
      setIdeaForm(initialIdeaForm);
    } catch (error) {
      setIdeaStatus({
        type: "error",
        message: error instanceof Error ? error.message : "We couldn't send your idea. Please try again.",
      });
    } finally {
      ideaSubmittingRef.current = false;
      setIdeaSubmitting(false);
    }
  };

  const handleSupportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (supportSubmittingRef.current) return;
    supportSubmittingRef.current = true;
    setSupportSubmitting(true);
    setSupportStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportForm),
      });

      const message = await getResponseMessage(response);

      if (!response.ok) {
        throw new Error(message ?? "Unable to submit your support request.");
      }

      setSupportStatus({ type: "success", message: message ?? "Your support request was submitted." });
      setSupportForm(initialSupportForm);
    } catch (error) {
      setSupportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "We couldn't submit your request. Please try again.",
      });
    } finally {
      supportSubmittingRef.current = false;
      setSupportSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="ambient-orb orb-one" />
        <div className="ambient-orb orb-two" />
        <div className="ambient-orb orb-three" />
        <div className="ambient-wave wave-one" />
        <div className="ambient-wave wave-two" />
        {[...Array(22)].map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 37 + 8) % 100}%`,
              top: `${(index * 23 + 12) % 100}%`,
              width: index % 5 === 0 ? 5 : 3,
              height: index % 5 === 0 ? 5 : 3,
              animationDelay: `${Math.min(index * 0.035, 0.8)}s, ${index * 0.37}s, ${index * 0.21}s`,
              animationDuration: `0.7s, ${8 + (index % 5)}s, ${2.5 + (index % 4) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <header className="sticky top-3 z-40 mx-3 w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl border border-[#A78BFA]/20 bg-black/70 shadow-[0_12px_42px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:mx-auto">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="RELYQON home">
            <Image src="/relyqon-logo-crop.png" alt="" width={402} height={317} sizes="64px" className="h-10 w-14 object-contain" />
            <span className="text-sm tracking-[0.36em] text-white">RELYQON</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-white/75 md:flex">
            {navLinks.map((link) =>
              link.action === "contact" ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={(event) => {
                    contactTriggerRef.current = event.currentTarget;
                    setIsContactOpen(true);
                  }}
                  aria-current={isContactOpen ? "page" : undefined}
                  className={`rounded-full px-3 py-2 transition-colors hover:text-[#A78BFA] ${isContactOpen ? "bg-[#A78BFA]/10 text-[#A78BFA]" : ""}`}
                >
                  {link.label}
                </button>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    if (link.href) {
                      handleNavClick(link.href);
                    }
                  }}
                  aria-current={activeSection === link.href ? "location" : undefined}
                  className={`rounded-full px-3 py-2 transition-colors hover:text-[#A78BFA] ${activeSection === link.href ? "bg-[#A78BFA]/10 text-[#A78BFA]" : ""}`}
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>

          <button
            ref={navigationToggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white md:hidden"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileNavOpen && (
          <div className="overflow-hidden rounded-b-2xl border-t border-white/10 bg-black/90 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {navLinks.map((link) =>
                link.action === "contact" ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={(event) => {
                      contactTriggerRef.current = event.currentTarget;
                      setIsContactOpen(true);
                      setIsMobileNavOpen(false);
                    }}
                    className={`py-3 text-left text-sm transition-colors hover:text-[#A78BFA] ${isContactOpen ? "text-[#A78BFA]" : "text-white/80"}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      if (link.href) {
                        handleNavClick(link.href);
                      }
                    }}
                    aria-current={activeSection === link.href ? "location" : undefined}
                    className={`py-3 text-left text-sm transition-colors hover:text-[#A78BFA] ${activeSection === link.href ? "text-[#A78BFA]" : "text-white/80"}`}
                  >
                    {link.label}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10">
        <section id="home" className="hero-section relative mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center overflow-hidden px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <div className="hero-energy-orb" aria-hidden="true">
            <span className="hero-energy-surface" />
            <span className="hero-energy-ring hero-energy-ring-one" />
            <span className="hero-energy-ring hero-energy-ring-two" />
            <span className="hero-orbit-particle hero-orbit-particle-one" />
            <span className="hero-orbit-particle hero-orbit-particle-two" />
            <span className="hero-orbit-particle hero-orbit-particle-three" />
          </div>
          <div className="hero-content relative z-10 flex flex-col items-center text-center">
            <Image
              src="/relyqon-logo-crop.png"
              alt="RELYQON logo"
              width={402}
              height={317}
              sizes="(min-width: 1024px) 672px, (min-width: 640px) 544px, 84vw"
              className="hero-logo mb-8 h-auto w-[min(84vw,26rem)] sm:w-[min(70vw,34rem)] lg:w-[min(55vw,42rem)]"
            />
            <h1 className="hero-heading max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Connect Ideas.
              <span className="block text-[#A78BFA]">Build the Future.</span>
            </h1>
            <p className="hero-description mt-5 max-w-xl text-base leading-7 text-[#C4CDD8] sm:text-lg">
              Intelligent software and AI solutions built to move ambitious ideas forward.
            </p>
            <div className="hero-actions mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <a href="#about" className="hero-action-primary rounded-full bg-[#A78BFA] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#C4B5FD] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A78BFA]">
                Explore RELYQON
              </a>
              <a href="#idea" className="hero-action-secondary rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition hover:border-[#A78BFA]/50 hover:text-[#A78BFA] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A78BFA]">
                Share your idea
              </a>
            </div>
            <div className="hero-scroll mt-10 flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/65">
              <span>Scroll</span>
              <ArrowDown className="animate-bounce" size={18} />
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">About</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">We build digital experiences that move businesses forward.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "About RELYQON",
                summary: "RELYQON is a Software Development & AI company focused on transforming ideas into practical digital solutions.",
                details:
                  "We combine technology, creativity, and problem-solving to build modern applications, websites, and intelligent software that help businesses and individuals move forward. Our goal is simple: turn possibilities into reality through technology.",
                accent: "About Us",
              },
              {
                title: "Why Choose RELYQON?",
                summary: "Thoughtful, hands-on digital strategy and execution tailored to your growth goals.",
                details: "We focus on premium product thinking, collaborative communication, and reliable engineering to create systems people trust and teams enjoy using.",
                accent: "Why Us",
              },
              {
                title: "What We Build",
                summary: "Practical digital products designed to solve real-world problems with clarity and impact.",
                details: "From responsive websites to smart automations and AI integrations, RELYQON helps companies launch polished experiences that work beautifully and scale effectively.",
                accent: "Services",
              },
            ].map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`${card.title} card`}
                aria-pressed={activeCard === index}
                className="group h-[330px] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                onClick={() => setActiveCard(activeCard === index ? null : index)}
              >
                <div className={`card-shell ${activeCard === index ? "card-flipped" : ""}`}>
                  <div className="card-face card-front glass-panel rounded-[24px] p-6 transition-colors sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.28em] text-[#A78BFA]">{card.accent}</span>
                      <span className="text-white/50">Click to discover</span>
                    </div>
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#6495ED] transition-colors group-hover:border-[#A78BFA]/35 group-hover:text-[#A78BFA]">
                      {index === 0 ? <UserRound size={22} /> : index === 1 ? <Sparkles size={22} /> : <BriefcaseBusiness size={22} />}
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                  </div>

                  <div className="card-face card-back glass-panel overflow-y-auto rounded-[24px] p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.28em] text-[#A78BFA]">{card.accent}</span>
                      <ChevronRight className="text-white/60" size={18} />
                    </div>
                    <p className="text-base text-white/90">{card.summary}</p>
                    <p className="mt-4 text-sm leading-7 text-[#C4CDD8]">{card.details}</p>
                    {index === 1 && (
                      <ul className="mt-5 space-y-3 text-sm text-[#C4CDD8]">
                        {whyUsPoints.map((point) => (
                          <li key={point.title} className="flex items-center gap-3">
                            <point.icon size={15} className="text-[#6495ED]" />
                            <span>{point.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {index === 2 && (
                      <ul className="mt-5 space-y-3 text-sm text-[#C4CDD8]">
                        {services.map((service) => (
                          <li key={service.title} className="flex items-start gap-3">
                            <service.icon size={15} className="mt-0.5 text-[#6495ED]" />
                            <span>{service.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="idea" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[32px] p-8 sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Share your idea</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Have an Idea?</h2>
              <h3 className="mt-2 text-2xl font-medium text-[#A78BFA] sm:text-3xl">Let&apos;s Build It.</h3>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5 text-[#C4CDD8]">
                <p>
                  Every great product starts with an idea. Tell us what you&apos;re thinking, and let&apos;s explore how we can bring it to life.
                </p>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                  <Mail className="text-[#6495ED]" size={18} />
                  <a href="mailto:relyqon@gmail.com" className="text-white hover:text-[#A78BFA]">relyqon@gmail.com</a>
                </div>
              </div>

              <form onSubmit={handleIdeaSubmit} className="space-y-5">
                <div>
                  <label htmlFor="idea-email" className="mb-2 block text-sm text-[#C4CDD8]">Email Address</label>
                  <input
                    id="idea-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={ideaForm.email}
                    onChange={(event) => setIdeaForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none transition focus:border-[#A78BFA]"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="idea-website">Website</label>
                  <input
                    id="idea-website"
                    type="text"
                    value={ideaForm.website}
                    onChange={(event) => setIdeaForm((current) => ({ ...current, website: event.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="idea-message" className="mb-2 block text-sm text-[#C4CDD8]">Idea / Project Description</label>
                  <textarea
                    id="idea-message"
                    value={ideaForm.message}
                    onChange={(event) => setIdeaForm((current) => ({ ...current, message: event.target.value }))}
                    className="min-h-36 w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none transition focus:border-[#A78BFA]"
                    placeholder="Tell us about the product, problem, or vision you want to build..."
                    maxLength={5000}
                    required
                  />
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={ideaSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-[#A78BFA] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#C4B5FD] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {ideaSubmitting ? "Sending..." : "Send Your Idea"}
                    <ArrowUpRight size={16} />
                  </button>
                  {ideaStatus.type !== "idle" && (
                    <p role={ideaStatus.type === "error" ? "alert" : "status"} aria-live="polite" className={ideaStatus.type === "success" ? "text-emerald-400" : "text-rose-300"}>{ideaStatus.message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>

        <section id="support" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[32px] p-8 sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Support</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">We&apos;re Here to Help.</h2>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-5 text-[#C4CDD8]">
                <p>Having an issue or need assistance? Send us a message and our team will get back to you.</p>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                  <Mail className="text-[#6495ED]" size={18} />
                  <a href="mailto:relyqonteam@gmail.com" className="text-white hover:text-[#A78BFA]">relyqonteam@gmail.com</a>
                </div>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="support-website">Website</label>
                  <input
                    id="support-website"
                    type="text"
                    value={supportForm.website}
                    onChange={(event) => setSupportForm((current) => ({ ...current, website: event.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="support-name" className="mb-2 block text-sm text-[#C4CDD8]">Full Name</label>
                  <input
                    id="support-name"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={supportForm.name}
                    onChange={(event) => setSupportForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none transition focus:border-[#A78BFA]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="support-email" className="mb-2 block text-sm text-[#C4CDD8]">Email Address</label>
                  <input
                    id="support-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={supportForm.email}
                    onChange={(event) => setSupportForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none transition focus:border-[#A78BFA]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="support-problem" className="mb-2 block text-sm text-[#C4CDD8]">Problem Description</label>
                  <textarea
                    id="support-problem"
                    value={supportForm.problem}
                    onChange={(event) => setSupportForm((current) => ({ ...current, problem: event.target.value }))}
                    className="min-h-36 w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none transition focus:border-[#A78BFA]"
                    maxLength={5000}
                    required
                  />
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={supportSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-[#A78BFA] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#C4B5FD] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {supportSubmitting ? "Submitting..." : "Submit Support Request"}
                    <ArrowUpRight size={16} />
                  </button>
                  {supportStatus.type !== "idle" && (
                    <p role={supportStatus.type === "error" ? "alert" : "status"} aria-live="polite" className={supportStatus.type === "success" ? "text-emerald-400" : "text-rose-300"}>{supportStatus.message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setIsContactOpen(false)}>
          <div ref={contactDialogRef} className="glass-panel relative w-full max-w-lg rounded-[28px] p-6 sm:p-8" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
              <button ref={contactCloseButtonRef} type="button" onClick={() => setIsContactOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/80 hover:text-white" aria-label="Close contact dialog">
              <X size={18} />
            </button>

            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Connect</p>
              <h2 id="contact-modal-title" className="mt-3 text-3xl font-semibold text-white">Connect With Us</h2>
            </div>

            <div className="space-y-3">
              {contactOptions.map((option) => (
                <a
                  key={option.platform}
                  href={option.href}
                  target={option.href.startsWith("http") ? "_blank" : undefined}
                  rel={option.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#A78BFA]/40 hover:bg-[#A78BFA]/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6495ED]/30 bg-[#6495ED]/10 text-[#6495ED]">
                      <option.icon size={18} />
                    </div>
                    <div>
                      <p className="text-base font-medium text-white">{option.platform}</p>
                      <p className="text-sm text-[#C4CDD8]">{option.value}</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-[#C4CDD8] transition group-hover:text-[#A78BFA]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 border-t border-white/10 bg-black/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
            <Image src="/relyqon-logo-crop.png" alt="" width={402} height={317} sizes="104px" className="h-14 w-[104px] object-contain" />
              <span className="text-sm tracking-[0.36em] text-white">RELYQON</span>
            </div>
            <p className="mt-4 text-sm text-[#C4CDD8]">Connect Ideas. Build the Future.</p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Follow</p>
            <div className="mt-4 space-y-3 text-sm text-[#C4CDD8]">
              <a href="https://www.linkedin.com/company/relyqon01/" target="_blank" rel="noreferrer" className="block hover:text-[#A78BFA]">LinkedIn</a>
              <a href="https://www.instagram.com/relyqon?exln=Nmhld2RxYmh4cnEz" target="_blank" rel="noreferrer" className="block hover:text-[#A78BFA]">Instagram</a>
              <a href="mailto:relyqon@gmail.com" className="block hover:text-[#A78BFA]">Email</a>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Explore</p>
            <div className="mt-4 space-y-3 text-sm text-[#C4CDD8]">
              <button type="button" onClick={() => handleNavClick("#home")} className="block hover:text-[#A78BFA]">Home</button>
              <button type="button" onClick={() => handleNavClick("#about")} className="block hover:text-[#A78BFA]">About</button>
              <button type="button" onClick={() => handleNavClick("#support")} className="block hover:text-[#A78BFA]">Support</button>
              <button
                type="button"
                onClick={(event) => {
                  contactTriggerRef.current = event.currentTarget;
                  setIsContactOpen(true);
                }}
                className="block hover:text-[#A78BFA]"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-[#C4CDD8] sm:px-6 lg:px-8">
            © 2026 RELYQON. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function GlobeIcon(props: React.ComponentPropsWithoutRef<typeof Building2>) {
  return <Building2 {...props} />;
}

function SmartphoneIcon(props: React.ComponentPropsWithoutRef<typeof BriefcaseBusiness>) {
  return <BriefcaseBusiness {...props} />;
}

function CodeIcon(props: React.ComponentPropsWithoutRef<typeof MessageSquareText>) {
  return <MessageSquareText {...props} />;
}

function BrainIcon(props: React.ComponentPropsWithoutRef<typeof Sparkles>) {
  return <Sparkles {...props} />;
}

function WorkflowIcon(props: React.ComponentPropsWithoutRef<typeof CheckCircle2>) {
  return <CheckCircle2 {...props} />;
}
