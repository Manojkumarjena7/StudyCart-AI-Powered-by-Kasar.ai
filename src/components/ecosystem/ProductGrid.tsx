"use client";

import { motion } from "framer-motion";
import { ecosystemProducts } from "@/config/ecosystem/products";
import { ProductCard } from "./ProductCard";
import { CompanyCard } from "./CompanyCard";

export function ProductGrid() {
  return (
    <section id="ecosystem-products" className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--eco-text-primary)" }}>
            Explore the{" "}
            <span className="bg-gradient-to-r from-brand-blue via-purple-400 to-brand-cyan-light bg-clip-text text-transparent">
              KasarTech
            </span>{" "}
            Ecosystem
          </h2>
          <p className="eco-text-secondary mx-auto mt-2 max-w-lg text-sm">
            AI-powered products for education, finance, and business — built to work together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ecosystemProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
          <CompanyCard index={ecosystemProducts.length} />
        </div>
      </div>
    </section>
  );
}
