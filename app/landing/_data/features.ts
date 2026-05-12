import { Brain, Plug, Bot, Search, Building, BarChart3, LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  tagKey: string;
  tagStyle: "" | "tag-indigo" | "tag-green" | "tag-amber";
}

export const FEATURE_KEYS: FeatureItem[] = [
  { icon: Brain, titleKey: "landing.features.singleHub.title", descKey: "landing.features.singleHub.desc", tagKey: "landing.features.singleHub.tag", tagStyle: "" },
  { icon: Plug, titleKey: "landing.features.integrations.title", descKey: "landing.features.integrations.desc", tagKey: "landing.features.integrations.tag", tagStyle: "tag-indigo" },
  { icon: Bot, titleKey: "landing.features.aiAgent.title", descKey: "landing.features.aiAgent.desc", tagKey: "landing.features.aiAgent.tag", tagStyle: "tag-green" },
  { icon: Search, titleKey: "landing.features.semanticSearch.title", descKey: "landing.features.semanticSearch.desc", tagKey: "landing.features.semanticSearch.tag", tagStyle: "" },
  { icon: Building, titleKey: "landing.features.multiDepartment.title", descKey: "landing.features.multiDepartment.desc", tagKey: "landing.features.multiDepartment.tag", tagStyle: "tag-indigo" },
  { icon: BarChart3, titleKey: "landing.features.analytics.title", descKey: "landing.features.analytics.desc", tagKey: "landing.features.analytics.tag", tagStyle: "tag-amber" },
];
