/**
 * Tests légers (exécutables via: npx tsx src/lib/insurance-quiz.test.ts)
 * ou importés dans un runner ultérieur.
 */
import { readFileSync } from "fs";
import path from "path";
import {
  aggregateScores,
  pickResultProfile,
} from "@/lib/content/quiz-logic";
import type { Quiz } from "@/types";
import {
  canShowAffiliateButton,
  getInsuranceProviders,
  getProviderAffiliateUrl,
  INSURANCE_PROVIDERS,
} from "@/data/insuranceProviders";
import { FORBIDDEN_INSURANCE_PHRASES } from "@/lib/compliance";
import { hasPreExistingFlag, isSeniorAge } from "@/lib/insurance-quiz";

function loadQuiz(): Quiz {
  const raw = JSON.parse(
    readFileSync(
      path.join(
        process.cwd(),
        "content/quizzes/assurance-sante-beagle.json"
      ),
      "utf8"
    )
  );
  return {
    ...raw,
    productCatalog: [],
  } as Quiz;
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

export function runInsuranceQuizTests() {
  const quiz = loadQuiz();

  // 5 profils
  assert(quiz.results.length === 5, "5 profils attendus");

  // Antécédents
  const answersPre = {
    age: "age-1-3",
    sante: "sante-diag",
    remboursement: "rem-eq",
    plafond: "pl-mid",
    avance: "av-oui",
    prevention: "prev-plus",
    priorite: "prio-compare",
  };
  assert(hasPreExistingFlag(answersPre), "flag antécédents");
  const scoresPre = aggregateScores(quiz, answersPre);
  const { profile: pPre } = pickResultProfile(quiz, scoresPre);
  assert(
    pPre.id === "antecedents",
    `profil antécédents attendu, reçu ${pPre.id}`
  );

  // Senior 8–12
  const answersSenior = {
    age: "age-8-12",
    sante: "sante-non",
    remboursement: "rem-eq",
    plafond: "pl-mid",
    avance: "av-oui",
    prevention: "prev-nsp",
    priorite: "prio-age",
  };
  assert(isSeniorAge(answersSenior), "flag senior");
  const scoresSenior = aggregateScores(quiz, answersSenior);
  const { profile: pSenior } = pickResultProfile(quiz, scoresSenior);
  assert(
    pSenior.id === "age-admission",
    `profil âge attendu, reçu ${pSenior.id}`
  );

  // Providers inactifs → pas de bouton
  for (const p of getInsuranceProviders()) {
    assert(p.active === false, `${p.id} doit être inactive par défaut`);
    assert(
      !canShowAffiliateButton(p),
      `${p.id} ne doit pas afficher de bouton affilié`
    );
    assert(
      getProviderAffiliateUrl(p) === null,
      `${p.id} URL null si inactive`
    );
  }

  // Ordre stable
  assert(
    INSURANCE_PROVIDERS.map((p) => p.id).join(",") ===
      "santevet,patolo,kozoo",
    "ordre neutre stable"
  );

  // Expressions interdites absentes des textes profils
  const blob = quiz.results.map((r) => r.title + r.description).join(" ");
  for (const phrase of FORBIDDEN_INSURANCE_PHRASES) {
    assert(
      !blob.toLowerCase().includes(phrase.toLowerCase()),
      `phrase interdite trouvée: ${phrase}`
    );
  }

  // Essentielle
  const answersEss = {
    age: "age-1-3",
    sante: "sante-non",
    remboursement: "rem-ess",
    plafond: "pl-bas",
    avance: "av-non",
    prevention: "prev-non",
    priorite: "prio-plafond",
  };
  const { profile: pEss } = pickResultProfile(
    quiz,
    aggregateScores(quiz, answersEss)
  );
  assert(
    pEss.id === "essentielle" || pEss.id === "renforcee" || pEss.id === "equilibre",
    `profil couverture reçu: ${pEss.id}`
  );

  return "ok";
}

// Exécution directe
if (typeof require !== "undefined" && require.main === module) {
  console.log(runInsuranceQuizTests());
}
