export interface QAResult {
  docKey: string;
  pageKey: string;
  score: number;
  snippetKey: string;
}

export interface QAItem {
  qKey: string;
  results: QAResult[];
}

export const QA_KEYS: QAItem[] = [
  {
    qKey: "landing.searchDemo.questions.vacation",
    results: [
      { docKey: "landing.searchDemo.results.hrPolicy", pageKey: "§8.3", score: 98, snippetKey: "landing.searchDemo.results.vacationSnippet" },
      { docKey: "landing.searchDemo.results.employmentContract", pageKey: "Clause 12", score: 87, snippetKey: "landing.searchDemo.results.refundSnippet" },
    ],
  },
  {
    qKey: "landing.searchDemo.questions.refund",
    results: [
      { docKey: "landing.searchDemo.results.bitrixCrm", pageKey: "Ch.6", score: 96, snippetKey: "landing.searchDemo.results.processSnippet" },
      { docKey: "landing.searchDemo.results.financeSop", pageKey: "p.14", score: 82, snippetKey: "landing.searchDemo.results.approvalSnippet" },
    ],
  },
  {
    qKey: "landing.searchDemo.questions.servers",
    results: [
      { docKey: "landing.searchDemo.results.infrastructure", pageKey: "Live", score: 99, snippetKey: "landing.searchDemo.results.productionSnippet" },
      { docKey: "landing.searchDemo.results.deploymentRunbook", pageKey: "§2", score: 78, snippetKey: "landing.searchDemo.results.maintenanceSnippet" },
    ],
  },
];
