"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import { User, Briefcase, Wrench, Brain, LucideIcon } from "lucide-react";
import { renderRichText } from "./rich-text";

export default function EmployeeJourney() {
  const { t } = useTranslation();

  const steps = [
    { who: User, roleKey: "landing.employeeJourney.roles.newEmployee", qKey: "landing.employeeJourney.roles.questions.vacation", aKey: "landing.employeeJourney.roles.answers.vacation", color: "#3b82f6" },
    { who: Briefcase, roleKey: "landing.employeeJourney.roles.salesManager", qKey: "landing.employeeJourney.roles.questions.discount", aKey: "landing.employeeJourney.roles.answers.discount", color: "#6366f1" },
    { who: Wrench, roleKey: "landing.employeeJourney.roles.supportAgent", qKey: "landing.employeeJourney.roles.questions.reset2fa", aKey: "landing.employeeJourney.roles.answers.reset2fa", color: "#8b5cf6" },
  ];

  const knowledgeTypes = [
    t("landing.employeeJourney.knowledgeTypes.0"),
    t("landing.employeeJourney.knowledgeTypes.1"),
    t("landing.employeeJourney.knowledgeTypes.2"),
    t("landing.employeeJourney.knowledgeTypes.3"),
  ];

  return (
    <section className="px-[6%] py-20 bg-gradient-to-b from-transparent via-primary/[0.025] to-transparent">
      <div className="max-w-[1060px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20 mb-4">
              {t("landing.employeeJourney.tag")}
            </span>
            <h2
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-4"
              dangerouslySetInnerHTML={renderRichText(t("landing.employeeJourney.title"))}
            />
            <p className="text-muted-foreground max-w-[480px] leading-relaxed mb-6">
              {t("landing.employeeJourney.subtitle")}
            </p>
            <div className="flex flex-col gap-2.5">
              {knowledgeTypes.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${s.color}18` }}>
                    <s.who size={18} color={s.color} />
                  </div>
                  <span className="text-[13px] font-semibold text-muted-foreground">{t(s.roleKey)}</span>
                </div>
                <div className="bg-primary/5 border rounded-lg px-3.5 py-2.5 mb-2.5 text-[13px] text-muted-foreground italic" style={{ borderColor: `${s.color}22` }}>
                  {t(s.qKey)}
                </div>
                <div className="bg-green-500/5 border border-green-500/15 rounded-lg px-3.5 py-2.5 text-[13px] text-green-300">
                  <Brain size={14} className="inline mr-1" /> {t(s.aKey)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
