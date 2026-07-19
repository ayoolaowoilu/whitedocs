"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Plus,
  Pencil,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// --- Custom Logo SVG ---
const LogoSVG = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Section Component with Scroll Trigger ---
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Feature Card ---
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group p-6 rounded-xl bg-white border border-gray-100 hover:border-red-100 hover:shadow-lg hover:shadow-red-50 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
        <Icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// --- Main Landing Page ---
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div className="min-h-screen bg-white">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-red-600">
                <LogoSVG className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-gray-900 tracking-tight">
                WhiteDocs
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              <Link
                href="/editor/new"
                className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <Plus size={14} /> New PDF
              </Link>
              <Link
                href="/editor"
                className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
              >
                <Pencil size={14} /> Edit PDF
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-medium mb-6"
            >
              <Zap size={12} />
              <span>Free PDF editor — no signup required</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6"
            >
              Edit PDFs like{" "}
              <span className="text-red-600">editing a Word doc</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-500 mb-10 leading-relaxed"
            >
              WhiteDocs is the fastest way to create, edit, and manage PDFs
              online. No bloat. No watermarks. Just clean documents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/editor/new"
                className="group flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-200"
              >
                <Plus size={16} />
                Create New PDF
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/editor"
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Pencil size={16} />
                Edit Existing PDF
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-4xl rounded-xl border border-gray-200 bg-gray-50 shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="h-8 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-auto text-xs text-gray-400">document.pdf</div>
              </div>
              <div className="p-8 sm:p-12 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-32 bg-red-50 rounded-lg border-2 border-dashed border-red-200 flex items-center justify-center mt-6">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-red-300 mx-auto mb-2" />
                    <p className="text-xs text-red-400 font-medium">
                      Drop your PDF here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-red-600 rounded-2xl shadow-xl flex items-center justify-center text-white"
            >
              <Check size={28} strokeWidth={3} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
            >
              <Layers className="w-6 h-6 text-red-600" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400"
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete PDF toolkit designed for speed and simplicity.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Process PDFs in seconds. Our engine handles large documents without breaking a sweat."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your files never leave your browser. All processing happens locally on your device."
              delay={0.15}
            />
            <FeatureCard
              icon={Layers}
              title="All-in-One"
              description="Create, edit, merge, split, and convert. One tool for every PDF task you have."
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Three steps to a perfect PDF
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gray-200" />

            {[
              {
                step: "01",
                title: "Upload or Create",
                desc: "Start from scratch or drop in an existing PDF file.",
              },
              {
                step: "02",
                title: "Edit Freely",
                desc: "Add text, images, signatures, and annotations.",
              },
              {
                step: "03",
                title: "Download & Share",
                desc: "Export as PDF, Word, or send directly via link.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.2} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white text-sm font-bold mb-4 shadow-lg shadow-red-200">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to ditch your old PDF tool?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of users who switched to WhiteDocs for faster,
              cleaner PDF editing.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/editor/new"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-900/50"
              >
                <Plus size={18} />
                Start Editing Now
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoSVG className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">
              WhiteDocs
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Built for speed. No bullshit.
          </p>
        </div>
      </footer>
    </div>
  );
}