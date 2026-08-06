import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/seo";
import { INSURANCE_FAQ } from "@/lib/insurance-quiz";

export function InsuranceQuizFaq() {
  const items = INSURANCE_FAQ.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));
  const ld = faqPageJsonLd(items);

  return (
    <>
      {ld && <JsonLd data={ld} />}
      <FaqAccordion
        items={items}
        title="Questions fréquentes sur l’assurance santé Beagle"
        className="mt-10"
      />
    </>
  );
}
