export interface StatItem {
  n: number;
  s: string;
  labelKey: string;
  descKey: string;
  dec: number;
}

export const STAT_KEYS: StatItem[] = [
  { n: 10, s: "x", labelKey: "landing.stats.faster", descKey: "landing.stats.vsManual", dec: 0 },
  { n: 40, s: "%", labelKey: "landing.stats.interruptions", descKey: "landing.stats.colleaguesStop", dec: 0 },
  { n: 0.4, s: "s", labelKey: "landing.stats.responseTime", descKey: "landing.stats.aiQuery", dec: 1 },
  { n: 99.9, s: "%", labelKey: "landing.stats.uptime", descKey: "landing.stats.reliability", dec: 1 },
];
