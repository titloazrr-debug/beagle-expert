"use client";

import { FaqAccordion } from "@/components/FaqAccordion";
import { WALKING_FAQ } from "@/lib/walking-quiz";

export function WalkingQuizFaq() {
  return (
    <FaqAccordion
      title="Questions fréquentes — harnais & promenade"
      items={WALKING_FAQ.map((f) => ({
        question: f.question,
        answer: f.answer,
      }))}
    />
  );
}
