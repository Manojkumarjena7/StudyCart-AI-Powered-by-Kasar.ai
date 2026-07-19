import { TrendingBanner } from "@/components/home/trending-banner";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyUse } from "@/components/home/why-use";
import { FeaturesPreview } from "@/components/home/features-preview";
import { BrandStory } from "@/components/home/brand-story";
import { EcosystemPreview } from "@/components/home/ecosystem-preview";
import { AboutPreview } from "@/components/home/about-preview";
import { trendingExamsRepository } from "@/lib/supabase/repositories/trendingExams.repository";

export default async function HomePage() {
  const trendingExam = await trendingExamsRepository.getActive();

  return (
    <>
      <TrendingBanner exam={trendingExam} />
      <Hero />
      <HowItWorks />
      <WhyUse />
      <FeaturesPreview />
      <BrandStory />
      <EcosystemPreview />
      <AboutPreview />
    </>
  );
}
