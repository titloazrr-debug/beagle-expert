/**
 * Tests assurance : node scripts/test-insurance.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function aggregateScores(quiz, answers) {
  const totals = {};
  for (const question of quiz.questions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [tag, value] of Object.entries(option.scores)) {
      totals[tag] = (totals[tag] ?? 0) + value;
    }
  }
  return totals;
}

function pickResultProfile(quiz, scores) {
  let best = quiz.results[quiz.results.length - 1];
  let bestScore = -Infinity;
  for (const result of quiz.results) {
    const tagScore = result.tags.reduce(
      (sum, tag) => sum + (scores[tag] ?? 0),
      0
    );
    if (tagScore > bestScore) {
      bestScore = tagScore;
      best = result;
    }
  }
  if (best.minScore !== undefined && bestScore < best.minScore) {
    const fallback = [...quiz.results].reverse().find((r) => {
      const s = r.tags.reduce((sum, tag) => sum + (scores[tag] ?? 0), 0);
      return r.minScore === undefined || s >= r.minScore;
    });
    if (fallback) best = fallback;
  }
  return { profile: best, matchScore: bestScore };
}

function pickInsurance(quiz, answers) {
  const sante = answers.sante;
  if (
    sante === "sante-diag" ||
    sante === "sante-sympt" ||
    sante === "sante-nsp"
  ) {
    return quiz.results.find((r) => r.id === "antecedents");
  }
  if (answers.age === "age-8-12" || answers.age === "age-12p") {
    return quiz.results.find((r) => r.id === "age-admission");
  }
  const scores = aggregateScores(quiz, answers);
  const filtered = {
    ...quiz,
    results: quiz.results.filter(
      (r) => r.id !== "antecedents" && r.id !== "age-admission"
    ),
  };
  return pickResultProfile(filtered, scores).profile;
}

const quiz = JSON.parse(
  readFileSync(
    join(root, "content/quizzes/assurance-sante-beagle.json"),
    "utf8"
  )
);

assert(quiz.results.length === 5, "5 profils");
assert(quiz.questions.length === 7, "7 questions");

const pre = {
  age: "age-1-3",
  sante: "sante-diag",
  remboursement: "rem-eq",
  plafond: "pl-mid",
  avance: "av-oui",
  prevention: "prev-plus",
  priorite: "prio-compare",
};
assert(pickInsurance(quiz, pre).id === "antecedents", "profil antécédents");

const senior = {
  age: "age-8-12",
  sante: "sante-non",
  remboursement: "rem-eq",
  plafond: "pl-mid",
  avance: "av-oui",
  prevention: "prev-nsp",
  priorite: "prio-age",
};
assert(pickInsurance(quiz, senior).id === "age-admission", "profil âge");

const ess = {
  age: "age-1-3",
  sante: "sante-non",
  remboursement: "rem-ess",
  plafond: "pl-bas",
  avance: "av-non",
  prevention: "prev-non",
  priorite: "prio-compare",
};
assert(pickInsurance(quiz, ess).id === "essentielle", "profil essentielle");

const renf = {
  age: "age-1-3",
  sante: "sante-non",
  remboursement: "rem-max",
  plafond: "pl-illim",
  avance: "av-oui",
  prevention: "prev-oui",
  priorite: "prio-plafond",
};
assert(pickInsurance(quiz, renf).id === "renforcee", "profil renforcée");

const forbidden = [
  "meilleure assurance pour vous",
  "nous vous recommandons de choisir",
  "remboursement assuré",
];
const blob = quiz.results
  .map((r) => r.title + r.description)
  .join(" ")
  .toLowerCase();
for (const p of forbidden) {
  assert(!blob.includes(p), `phrase interdite: ${p}`);
}

const providersSrc = readFileSync(
  join(root, "src/data/insuranceProviders.ts"),
  "utf8"
);
assert(providersSrc.includes("active: false"), "providers inactifs");
assert(
  providersSrc.includes("NEXT_PUBLIC_SANTEVET_AFFILIATE_URL"),
  "env SantéVet"
);
assert(providersSrc.includes('rel="sponsored') === false); // rel is in component
const compareSrc = readFileSync(
  join(root, "src/components/insurance/InsuranceProvidersCompare.tsx"),
  "utf8"
);
assert(
  compareSrc.includes('rel="sponsored noopener noreferrer"'),
  "rel sponsored"
);
assert(compareSrc.includes("Demander un devis"), "CTA devis");
assert(!compareSrc.includes('href="#"'), "pas de # faux lien");

console.log("insurance tests: OK");
