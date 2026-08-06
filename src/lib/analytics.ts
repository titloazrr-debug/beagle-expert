/**
 * Abstraction analytics légère (pas de SDK tiers imposé).
 * Branchez ici Plausible / GA / etc. plus tard.
 */

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

export function trackEvent(
  name: string,
  payload: AnalyticsPayload = {}
): void {
  try {
    // Ne jamais envoyer de réponses médicales / PII dans ce helper
    const safe = { ...payload };
    if (typeof window !== "undefined") {
      const w = window as Window & {
        dataLayer?: unknown[];
        plausible?: (n: string, o?: { props?: AnalyticsPayload }) => void;
      };
      w.dataLayer?.push?.({ event: name, ...safe });
      w.plausible?.(name, { props: safe });
    }
    if (isDev) {
      console.debug("[analytics]", name, safe);
    }
  } catch {
    // silence
  }
}

export const InsuranceAnalytics = {
  view: () => trackEvent("insurance_quiz_view"),
  start: () => trackEvent("insurance_quiz_start"),
  answer: (questionId: string) =>
    trackEvent("insurance_quiz_answer", { question_id: questionId }),
  complete: (resultProfile: string) =>
    trackEvent("insurance_quiz_complete", { result_profile: resultProfile }),
  providerExpand: (providerId: string) =>
    trackEvent("insurance_provider_expand", { provider_id: providerId }),
  affiliateClick: (input: {
    providerId: string;
    placement: string;
    resultProfile: string;
  }) =>
    trackEvent("insurance_affiliate_click", {
      provider_id: input.providerId,
      placement: input.placement,
      result_profile: input.resultProfile,
    }),
};

/** Analytics quiz croquettes UDP — pas de données médicales / poids / symptômes. */
export const FoodAnalytics = {
  view: () => trackEvent("food_quiz_view"),
  start: () => trackEvent("food_quiz_start"),
  answer: (questionId: string) =>
    trackEvent("food_quiz_answer", { question_id: questionId }),
  complete: (resultProfile: string) =>
    trackEvent("food_quiz_complete", { result_profile: resultProfile }),
  resultView: (resultProfile: string) =>
    trackEvent("food_result_view", { result_profile: resultProfile }),
  productExpand: (productId: string) =>
    trackEvent("food_product_expand", { product_id: productId }),
  affiliateClick: (input: {
    productId: string;
    placement: string;
    resultProfile: string;
  }) =>
    trackEvent("food_affiliate_click", {
      product_id: input.productId,
      placement: input.placement,
      result_profile: input.resultProfile,
    }),
  restart: () => trackEvent("food_quiz_restart"),
};
