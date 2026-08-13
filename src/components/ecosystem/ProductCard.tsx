"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import type { EcosystemProduct } from "@/config/ecosystem/products";
import { ProductVideo } from "./ProductVideo";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { StudyCartLivePreview, GenericPreviewPlaceholder } from "./ProductPreview";

function ProductMedia({ product }: { product: EcosystemProduct }) {
  if (product.demo?.webm || product.demo?.mp4 || product.demo?.gif) {
    return <ProductVideo demo={product.demo} productName={product.name} />;
  }
  if (product.demo?.screenshots && product.demo.screenshots.length > 0) {
    return <ScreenshotGallery screenshots={product.demo.screenshots} productName={product.name} />;
  }
  if (product.useLivePreview && product.id === "studycart") {
    return <StudyCartLivePreview />;
  }
  return <GenericPreviewPlaceholder label={product.name} />;
}

export function ProductCard({ product, index }: { product: EcosystemProduct; index: number }) {
  const isLive = product.status === "live";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="eco-card eco-glass group flex h-full flex-col overflow-hidden rounded-2xl border p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold " +
            (isLive ? "bg-success/15 text-success" : "bg-white/5 text-current opacity-70")
          }
        >
          {isLive ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
          {isLive ? "LIVE" : "Coming Soon"}
        </span>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
        >
          <product.icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--eco-text-primary)" }}>
            {product.name}
          </h3>
          <p className="eco-text-secondary text-xs">{product.tagline}</p>
        </div>
      </div>

      <p className="eco-text-secondary mb-4 text-sm leading-relaxed">{product.description}</p>

      <div className="mb-4">
        <ProductMedia product={product} />
      </div>

      <ul className="mb-5 grid grid-cols-1 gap-x-3 gap-y-1.5 sm:grid-cols-2">
        {product.features.map((feature) => (
          <li key={feature} className="eco-text-secondary flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>

      {product.technologies && product.technologies.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {product.technologies.map((tech) => (
            <span
              key={tech}
              className="eco-text-secondary rounded-full border px-2 py-0.5 text-[10px]"
              style={{ borderColor: "var(--eco-border)" }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        {isLive && product.liveUrl ? (
          <Link
            href={product.liveUrl}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
          >
            Explore {product.name}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className="eco-text-secondary inline-flex h-10 flex-1 cursor-default items-center justify-center rounded-lg border text-sm font-medium"
            style={{ borderColor: "var(--eco-border)" }}
          >
            Coming Soon
          </span>
        )}
        {product.learnMoreUrl && (
          <Link
            href={product.learnMoreUrl}
            className="eco-text-secondary inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors hover:opacity-80"
            style={{ borderColor: "var(--eco-border)" }}
          >
            Learn More
          </Link>
        )}
      </div>
    </motion.article>
  );
}
