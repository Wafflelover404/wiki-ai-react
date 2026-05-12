"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/i18n";

import SplashScreen from "./_components/SplashScreen";
import LandingNav from "./_components/LandingNav";
import HeroSection from "./_components/HeroSection";
import ProblemComparison from "./_components/ProblemComparison";
import SearchDemo from "./_components/SearchDemo";
import FeaturesGrid from "./_components/FeaturesGrid";
import EmployeeJourney from "./_components/EmployeeJourney";
import IntegrationHub from "./_components/IntegrationHub";
import TerminalDemo from "./_components/TerminalDemo";
import UseCasesGrid from "./_components/UseCasesGrid";
import StatsCounter from "./_components/StatsCounter";
import PricingSection from "./_components/PricingSection";
import CTASection from "./_components/CTASection";
import FooterSection from "./_components/FooterSection";

import { useMobile } from "./_hooks/use-mobile";
import { FEATURE_KEYS } from "./_data/features";
import { STAT_KEYS } from "./_data/stats";
import { PLAN_KEYS } from "./_data/plans";
import { QA_KEYS } from "./_data/search-qa";
import { renderRichText } from "./_components/rich-text";

export default function WikiAILanding() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const isMobile = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const aiAgentFeatures = [
    t("landing.aiAgentBridge.features.0"),
    t("landing.aiAgentBridge.features.1"),
    t("landing.aiAgentBridge.features.2"),
    t("landing.aiAgentBridge.features.3"),
    t("landing.aiAgentBridge.features.4"),
  ];

  return (
    <div className="landing min-h-screen bg-background text-foreground overflow-x-hidden antialiased font-sans">

      <SplashScreen show={splash} />

      {!splash && (
        <>
          <LandingNav scrolled={scrolled} />
          <HeroSection />
          <ProblemComparison />

          <section id="how-it-works" className="px-[6%] py-20">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
            <div className="max-w-[1060px] mx-auto">
              <div className="text-center mb-14">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20 mb-3.5">
                  {t("landing.searchDemo.tag")}
                </span>
                <h2
                  className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
                  dangerouslySetInnerHTML={renderRichText(t("landing.searchDemo.title"))}
                />
                <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
                  {t("landing.searchDemo.subtitle")}
                </p>
              </div>
              <div>
                <SearchDemo qa={QA_KEYS} />
              </div>
            </div>
          </section>

          <FeaturesGrid features={FEATURE_KEYS} />
          <EmployeeJourney />
          <IntegrationHub isMobile={isMobile} />

          <section className="px-[6%] py-20 bg-gradient-to-b from-transparent via-primary/[0.025] to-transparent">
            <div className="max-w-[1060px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div style={{ order: 2 }}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-green-500/8 text-green-400 border border-green-500/20 mb-4">
                    {t("landing.aiAgentBridge.tag")}
                  </span>
                  <h2
                    className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-4"
                    dangerouslySetInnerHTML={renderRichText(t("landing.aiAgentBridge.title"))}
                  />
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                    {t("landing.aiAgentBridge.subtitle")}
                  </p>
                  <div className="flex flex-col gap-3">
                    {aiAgentFeatures.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ order: 1 }}>
                  <TerminalDemo />
                </div>
              </div>
            </div>
          </section>

          <UseCasesGrid />
          <StatsCounter stats={STAT_KEYS} />
          <PricingSection plans={PLAN_KEYS} />
          <CTASection />
          <FooterSection />
        </>
      )}
    </div>
  );
}
