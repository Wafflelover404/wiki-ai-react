"use client";
import { useTranslation } from "@/src/i18n";

interface FooterLink {
  key: string;
  textKey: string;
}

export default function FooterSection() {
  const { t } = useTranslation();

  const productLinks: FooterLink[] = [
    { key: "features", textKey: "landing.footer.links.features" },
    { key: "integrations", textKey: "landing.footer.links.integrations" },
    { key: "pricing", textKey: "landing.footer.links.pricing" },
    { key: "changelog", textKey: "landing.footer.links.changelog" },
    { key: "roadmap", textKey: "landing.footer.links.roadmap" },
  ];

  const useCaseLinks: FooterLink[] = [
    { key: "onboarding", textKey: "landing.footer.links.onboarding" },
    { key: "sales", textKey: "landing.footer.links.sales" },
    { key: "call-centers", textKey: "landing.footer.links.callCenters" },
    { key: "ecommerce", textKey: "landing.footer.links.ecommerce" },
  ];

  const companyLinks: FooterLink[] = [
    { key: "about", textKey: "landing.footer.links.about" },
    { key: "blog", textKey: "landing.footer.links.blog" },
    { key: "careers", textKey: "landing.footer.links.careers" },
    { key: "contact", textKey: "landing.footer.links.contact" },
    { key: "privacy", textKey: "landing.footer.links.privacy" },
  ];

  const bottomLinks: FooterLink[] = [
    { key: "privacy", textKey: "landing.footer.bottomLinks.privacy" },
    { key: "terms", textKey: "landing.footer.bottomLinks.terms" },
    { key: "security", textKey: "landing.footer.bottomLinks.security" },
  ];

  function LinkCol({ titleKey, links }: { titleKey: string; links: FooterLink[] }) {
    return (
      <div>
        <div className="text-xs font-bold text-foreground mb-3 uppercase tracking-[0.05em]">
          {t(titleKey)}
        </div>
        <div className="flex flex-col gap-2">
          {links.map((l) => (
            <a
              key={l.key}
              href={`#${l.key}`}
              className="text-xs text-muted-foreground/50 no-underline hover:text-muted-foreground transition-colors"
            >
              {t(l.textKey)}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <footer className="border-t border-border px-[6%] pt-14 pb-8">
      <div className="max-w-[1060px] mx-auto">
        <p className="text-xs text-muted-foreground/40 mb-5">
          {t("landing.footer.description")}
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-6 mb-8">
          <LinkCol titleKey="landing.footer.product" links={productLinks} />
          <LinkCol titleKey="landing.footer.useCases" links={useCaseLinks} />
          <LinkCol titleKey="landing.footer.company" links={companyLinks} />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-border flex-wrap gap-3">
          <div className="text-xs text-muted-foreground/40">
            {t("landing.footer.copyright")}
          </div>
          <div className="flex gap-5">
            {bottomLinks.map((l) => (
              <a
                key={l.key}
                href={`#${l.key}`}
                className="text-xs text-muted-foreground/50 no-underline hover:text-muted-foreground transition-colors"
              >
                {t(l.textKey)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
