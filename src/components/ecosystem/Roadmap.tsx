"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { roadmapProducts } from "@/config/ecosystem/products";

export function Roadmap() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eco-card eco-glass rounded-2xl border p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-cyan-light" />
            <h2 className="text-lg font-semibold" style={{ color: "var(--eco-text-primary)" }}>
              More Products <span className="text-brand-cyan-light">Coming Soon</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {roadmapProducts.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="flex flex-col gap-2 rounded-xl border p-4"
                style={{ borderColor: "var(--eco-border)" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-cyan/10">
                  <item.icon className="h-4.5 w-4.5 text-brand-cyan-light" />
                </span>
                <p className="text-sm font-medium" style={{ color: "var(--eco-text-primary)" }}>
                  {item.name}
                </p>
                <p className="eco-text-secondary text-xs leading-snug">{item.description}</p>
                <span className="eco-text-secondary mt-1 w-fit rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: "var(--eco-border)" }}>
                  Coming Soon
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
