"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Rocket } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      {/* Animated glow / blur shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: "var(--eco-glow-1)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 right-1/5 h-[380px] w-[380px] rounded-full blur-3xl"
          style={{ background: "var(--eco-glow-2)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "var(--eco-glow-3)" }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-6 flex w-full items-center justify-between">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eco-glass inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
            style={{ borderColor: "var(--eco-border-strong)", color: "var(--eco-text-secondary)" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan-light" />
            Built by KasarTech.ai
          </motion.span>
          <ThemeToggle />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
        >
          One Platform.{" "}
          <span className="bg-gradient-to-r from-brand-blue via-purple-400 to-brand-cyan-light bg-clip-text text-transparent">
            Multiple AI-Powered
          </span>{" "}
          Products.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="eco-text-secondary mt-6 max-w-xl text-balance text-base sm:text-lg"
        >
          Discover intelligent software for Education, Finance, and Business — all designed to work together in
          one growing ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#ecosystem-products"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan-light px-6 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/analyzer"
            className="eco-glass inline-flex h-12 items-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: "var(--eco-border-strong)" }}
          >
            <Rocket className="h-4 w-4" />
            View Live Apps
          </a>
        </motion.div>
      </div>
    </section>
  );
}
