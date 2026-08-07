/**
 * Tests quiz harnais / promenade : node scripts/test-walking.mjs
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function single(answers, id) {
  const v = answers[id];
  if (Array.isArray(v)) return v[0];
  return v;
}
function multi(answers, id) {
  const v = answers[id];
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
}
function ownedEquipment(answers) {
  const ids = multi(answers, "equipment");
  if (ids.includes("eq-none")) return new Set();
  return new Set(ids);
}
function isSenior(a) {
  const age = single(a, "age");
  return age === "age-senior" || age === "age-senior-adv";
}
function isSeniorAdvanced(a) {
  return single(a, "age") === "age-senior-adv";
}
function isHighEscapeRisk(a) {
  const e = single(a, "escape");
  return e === "escape-high" || e === "escape-history";
}
function isMediumEscapeRisk(a) {
  return single(a, "escape") === "escape-medium";
}
function isLostSignificant(a) {
  const l = single(a, "lost");
  return l === "lost-significant" || l === "lost-repeated";
}
function isRecallLow(a) {
  const r = single(a, "recall");
  return r === "recall-low" || r === "recall-variable";
}
function isRecallScentSensitive(a) {
  return single(a, "recall") === "recall-scent";
}
function isScentPuller(a) {
  const p = single(a, "pull");
  return p === "pull-scent" || p === "pull-frequent" || p === "pull-strong";
}
function wantsExtendedFreedom(a) {
  const f = single(a, "freedom");
  return f === "free-extended" || f === "free-max" || f === "free-offleash";
}
function wantsMaxFreedom(a) {
  return single(a, "freedom") === "free-max";
}
function isHikingEnv(a) {
  return single(a, "environment") === "env-hiking";
}
function isOpenEnv(a) {
  const e = single(a, "environment");
  return (
    e === "env-country" ||
    e === "env-forest" ||
    e === "env-hiking" ||
    e === "env-mixed"
  );
}
function isCityEnv(a) {
  return single(a, "environment") === "env-city";
}

function pickWalkingProfileId(answers) {
  if (isHighEscapeRisk(answers)) return "escape_artist";
  if (
    isMediumEscapeRisk(answers) &&
    (isLostSignificant(answers) || isRecallLow(answers))
  ) {
    return "escape_artist";
  }
  if (isSenior(answers)) {
    const calmPull =
      single(answers, "pull") === "pull-low" ||
      single(answers, "pull") === "pull-variable";
    const quietFreedom =
      single(answers, "freedom") === "free-close" ||
      single(answers, "freedom") === "free-moderate";
    if (
      isSeniorAdvanced(answers) ||
      (calmPull && quietFreedom && !isHikingEnv(answers))
    ) {
      return "senior_comfort";
    }
  }
  if (isHikingEnv(answers) && !isHighEscapeRisk(answers)) return "hiking";

  const secured =
    (wantsMaxFreedom(answers) ||
      (wantsExtendedFreedom(answers) && isOpenEnv(answers))) &&
    (isRecallLow(answers) ||
      isRecallScentSensitive(answers) ||
      isLostSignificant(answers) ||
      single(answers, "recall") === "recall-never");
  if (secured) return "secured_explorer";

  if (
    (single(answers, "pull") === "pull-scent" ||
      isRecallScentSensitive(answers)) &&
    (single(answers, "environment") === "env-park" ||
      isOpenEnv(answers) ||
      wantsExtendedFreedom(answers))
  ) {
    return "scent_explorer";
  }

  if (
    isScentPuller(answers) ||
    isRecallScentSensitive(answers)
  ) {
    if (
      !(
        isCityEnv(answers) &&
        single(answers, "freedom") === "free-close" &&
        single(answers, "recall") === "recall-good" &&
        single(answers, "pull") === "pull-low"
      )
    ) {
      if (
        isScentPuller(answers) ||
        isRecallScentSensitive(answers) ||
        wantsExtendedFreedom(answers)
      ) {
        return "scent_explorer";
      }
    }
  }

  return "daily_walk";
}

function computeGpsRelevance(answers) {
  let score = 0;
  const recall = single(answers, "recall");
  if (recall === "recall-low") score += 2;
  else if (recall === "recall-variable") score += 1;
  else if (recall === "recall-scent") score += 1;
  const lost = single(answers, "lost");
  if (lost === "lost-repeated") score += 3;
  else if (lost === "lost-significant") score += 2;
  else if (lost === "lost-short") score += 1;
  if (isHighEscapeRisk(answers)) score += 1;
  const env = single(answers, "environment");
  if (env === "env-hiking" || env === "env-forest") score += 1;
  else if (env === "env-country") score += 1;
  if (wantsMaxFreedom(answers) || single(answers, "freedom") === "free-offleash") {
    score += 1;
  }
  if (isScentPuller(answers) && isOpenEnv(answers)) score += 1;
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

function base(over = {}) {
  return {
    age: "age-adult",
    pull: "pull-low",
    escape: "escape-low",
    recall: "recall-good",
    lost: "lost-never",
    environment: "env-city",
    freedom: "free-close",
    equipment: ["eq-none"],
    ...over,
  };
}

// ——— Profile tests ———
const cases = [
  {
    name: "1. calme + rappel correct + ville → daily_walk",
    answers: base(),
    profile: "daily_walk",
  },
  {
    name: "2. odeurs + rappel moyen + parc → scent_explorer",
    answers: base({
      pull: "pull-scent",
      recall: "recall-scent",
      environment: "env-park",
      freedom: "free-moderate",
    }),
    profile: "scent_explorer",
  },
  {
    name: "3. rappel faible + forêt + liberté importante → secured_explorer",
    answers: base({
      pull: "pull-scent",
      recall: "recall-low",
      environment: "env-forest",
      freedom: "free-max",
    }),
    profile: "secured_explorer",
    gpsMin: "medium",
  },
  {
    name: "4. déjà sorti du harnais → escape_artist",
    answers: base({
      escape: "escape-history",
      pull: "pull-low",
      recall: "recall-good",
      environment: "env-city",
    }),
    profile: "escape_artist",
  },
  {
    name: "5. perdu plusieurs fois → GPS high",
    answers: base({
      lost: "lost-repeated",
      recall: "recall-low",
      environment: "env-forest",
      freedom: "free-extended",
    }),
    gps: "high",
    missingTag: true,
  },
  {
    name: "6. senior + promenade tranquille → senior_comfort",
    answers: base({
      age: "age-senior-adv",
      pull: "pull-low",
      freedom: "free-close",
      environment: "env-park",
    }),
    profile: "senior_comfort",
  },
  {
    name: "7. randonnée + longs espaces sans évasion → hiking",
    answers: base({
      environment: "env-hiking",
      freedom: "free-extended",
      pull: "pull-variable",
      recall: "recall-scent",
      escape: "escape-low",
    }),
    profile: "hiking",
  },
  {
    name: "8. médaille déjà possédée → has_tag",
    answers: base({ equipment: ["eq-tag", "eq-harness"] }),
    hasTag: true,
  },
  {
    name: "9. GPS déjà possédé → has_gps",
    answers: base({
      equipment: ["eq-gps", "eq-harness"],
      lost: "lost-significant",
      recall: "recall-low",
      environment: "env-forest",
    }),
    hasGps: true,
  },
];

let failed = 0;
for (const c of cases) {
  try {
    if (c.profile) {
      const p = pickWalkingProfileId(c.answers);
      assert(p === c.profile, `profile got ${p}, expected ${c.profile}`);
    }
    if (c.gps) {
      const g = computeGpsRelevance(c.answers);
      assert(g === c.gps, `gps got ${g}, expected ${c.gps}`);
    }
    if (c.gpsMin) {
      const g = computeGpsRelevance(c.answers);
      const order = { low: 0, medium: 1, high: 2 };
      assert(
        order[g] >= order[c.gpsMin],
        `gps got ${g}, expected >= ${c.gpsMin}`
      );
    }
    if (c.hasTag) {
      assert(ownedEquipment(c.answers).has("eq-tag"), "expected has tag");
    }
    if (c.missingTag) {
      assert(!ownedEquipment(c.answers).has("eq-tag"), "expected missing tag");
    }
    if (c.hasGps) {
      assert(ownedEquipment(c.answers).has("eq-gps"), "expected has gps");
    }
    console.log("OK ", c.name);
  } catch (e) {
    failed++;
    console.error("FAIL", c.name, "—", e.message);
  }
}

// almost escaped still escape_artist
try {
  const p = pickWalkingProfileId(base({ escape: "escape-high" }));
  assert(p === "escape_artist", `almost escape got ${p}`);
  console.log("OK  4b. presque sorti → escape_artist");
} catch (e) {
  failed++;
  console.error("FAIL 4b", e.message);
}

// inactive products never "active true" placeholders stay false except gps
const productsPath = join(root, "src/data/walkingProducts.ts");
const productsSrc = readFileSync(productsPath, "utf8");
assert(
  productsSrc.includes("active: false"),
  "placeholders should be inactive"
);
assert(
  productsSrc.includes('id: "gps-tractive-walking"'),
  "gps product present"
);
assert(
  productsSrc.includes("BEAGLE_EXPERT_TAG_ENABLED = false"),
  "tag product disabled by default"
);
console.log("OK  10. produits placeholders inactive + tag flag false");

// quiz JSON exists and has 8 questions
const quizPath = join(root, "content/quizzes/harnais-beagle.json");
assert(existsSync(quizPath), "quiz json missing");
const quiz = JSON.parse(readFileSync(quizPath, "utf8"));
assert(quiz.slug === "harnais-beagle", "slug");
assert(quiz.questions.length === 8, `expected 8 questions, got ${quiz.questions.length}`);
const multiQ = quiz.questions.find((q) => q.id === "equipment");
assert(multiQ?.type === "multi", "equipment should be multi");
console.log("OK  quiz JSON 8 questions + multi equipment");

// global quiz count includes new quiz
const quizDir = join(root, "content/quizzes");
const quizFiles = readdirSync(quizDir).filter((f) => f.endsWith(".json"));
assert(quizFiles.includes("harnais-beagle.json"), "harnais file listed");
assert(quizFiles.length >= 7, `expected >= 7 quizzes, got ${quizFiles.length}`);
console.log("OK  13. compteur quiz fichiers =", quizFiles.length);

// no coercive gear wording in walking-quiz.ts
const logic = readFileSync(join(root, "src/lib/walking-quiz.ts"), "utf8").toLowerCase();
const forbidden = [
  "collier étrangleur",
  "collier a pointes",
  "collier électrique",
  "vous pouvez le lâcher sans problème",
  "meilleur harnais du marché",
  "100 % anti-fugue",
  "garantit la sécurité",
];
for (const f of forbidden) {
  assert(!logic.includes(f), `forbidden phrase: ${f}`);
}
console.log("OK  pas de formulations interdites dans walking-quiz.ts");

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log("\nAll walking quiz tests passed.");
