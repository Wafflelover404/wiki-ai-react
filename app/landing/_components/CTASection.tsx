"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/i18n";
import { renderRichText } from "./rich-text";

export default function CTASection() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <section className="px-[6%] pt-20 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[780px] mx-auto text-center"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-sky-500/7 to-indigo-500/6 border border-primary/20 rounded-[22px] p-12 md:p-16">
          <div className="absolute w-[400px] h-[400px] rounded-full top-[-30%] left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)" }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-lg font-semibold uppercase tracking-[0.07em] bg-primary/10 text-blue-400 border border-primary/20 mb-3.5">
              AI
            </span>
            <h2
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
              dangerouslySetInnerHTML={renderRichText(t("landing.cta.title"))}
            />
            <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed mb-8">
              {t("landing.cta.subtitle")}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:shadow-[0_8px_28px_rgba(59,130,246,0.35)] hover:-translate-y-px transition-all"
              >
                {t("landing.cta.startNow")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
