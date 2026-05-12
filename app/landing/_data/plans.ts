export interface PlanItem {
  nameKey: string;
  priceKey: string;
  perKey: string;
  descKey: string;
  featuresKeys: string[];
  hi: boolean;
  ctaKey: string;
}

export const PLAN_KEYS: PlanItem[] = [
  {
    nameKey: "landing.pricing.plans.starter.name",
    priceKey: "landing.pricing.plans.starter.price",
    perKey: "landing.pricing.plans.starter.per",
    descKey: "landing.pricing.plans.starter.desc",
    featuresKeys: [
      "landing.pricing.plans.starter.features.0",
      "landing.pricing.plans.starter.features.1",
      "landing.pricing.plans.starter.features.2",
      "landing.pricing.plans.starter.features.3",
      "landing.pricing.plans.starter.features.4",
      "landing.pricing.plans.starter.features.5",
    ],
    hi: false,
    ctaKey: "landing.pricing.plans.starter.cta",
  },
  {
    nameKey: "landing.pricing.plans.business.name",
    priceKey: "landing.pricing.plans.business.price",
    perKey: "landing.pricing.plans.business.per",
    descKey: "landing.pricing.plans.business.desc",
    featuresKeys: [
      "landing.pricing.plans.business.features.0",
      "landing.pricing.plans.business.features.1",
      "landing.pricing.plans.business.features.2",
      "landing.pricing.plans.business.features.3",
      "landing.pricing.plans.business.features.4",
      "landing.pricing.plans.business.features.5",
      "landing.pricing.plans.business.features.6",
      "landing.pricing.plans.business.features.7",
    ],
    hi: true,
    ctaKey: "landing.pricing.plans.business.cta",
  },
  {
    nameKey: "landing.pricing.plans.enterprise.name",
    priceKey: "landing.pricing.plans.enterprise.price",
    perKey: "",
    descKey: "landing.pricing.plans.enterprise.desc",
    featuresKeys: [
      "landing.pricing.plans.enterprise.features.0",
      "landing.pricing.plans.enterprise.features.1",
      "landing.pricing.plans.enterprise.features.2",
      "landing.pricing.plans.enterprise.features.3",
      "landing.pricing.plans.enterprise.features.4",
      "landing.pricing.plans.enterprise.features.5",
      "landing.pricing.plans.enterprise.features.6",
      "landing.pricing.plans.enterprise.features.7",
    ],
    hi: false,
    ctaKey: "landing.pricing.plans.enterprise.cta",
  },
];
