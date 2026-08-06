/**
 * Tests quiz croquettes UDP : node scripts/test-food.mjs
 * Aligné questionnaire 7 questions (appétit+digestion fusionnés, santé simple).
 */
import { readFileSync, readdirSync } from "fs";
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
function isPuppy(a) {
  const age = single(a, "age");
  return age === "age-lt4m" || age === "age-4-11m";
}
function isSenior(a) {
  const age = single(a, "age");
  return age === "age-7-9" || age === "age-10p";
}
function isAdult(a) {
  return !isPuppy(a) && !isSenior(a);
}
function digestionLevel(a) {
  const ad = single(a, "appetit_digestion");
  if (ad === "ad-fragile") return 1;
  if (ad === "ad-sensitive") return 2;
  return 0;
}
function silhouetteWeightScore(a) {
  const s = single(a, "silhouette");
  if (s === "sil-hard") return 4;
  if (s === "sil-round") return 2;
  return 0;
}
function isSterilized(a) {
  return single(a, "sterilisation") === "ster-yes";
}
function isLowActivity(a) {
  return single(a, "activite") === "act-low";
}
function hasStrongAppetite(a) {
  return single(a, "appetit_digestion") === "ad-greedy";
}
function needsMedicalReview(a) {
  return single(a, "sante") === "health-medical";
}
function needsWeightControl(a) {
  if (!isAdult(a)) return false;
  const sil = silhouetteWeightScore(a);
  if (sil >= 2) return true;
  if (isSterilized(a)) {
    if (isLowActivity(a) || hasStrongAppetite(a) || sil > 0) return true;
  }
  if (hasStrongAppetite(a) && isLowActivity(a)) return true;
  return false;
}
function needsSensitive(a) {
  if (digestionLevel(a) >= 1) return true;
  return single(a, "sante") === "health-itch";
}
function pickFoodProfileId(a) {
  if (needsMedicalReview(a)) return "medical_review";
  if (isPuppy(a)) {
    if (needsSensitive(a)) return "puppy_sensitive";
    return "puppy_standard";
  }
  if (isSenior(a)) return "senior";
  if (needsWeightControl(a)) return "adult_weight_control";
  if (needsSensitive(a)) return "adult_sensitive";
  return "adult_standard";
}

const FORBIDDEN = [
  "nous avons comparé toutes les croquettes",
  "meilleure croquette du marché",
  "meilleure marque",
  "recommandation vétérinaire",
  "recette parfaite pour votre chien",
  "garantit une bonne digestion",
  "empêche le surpoids",
  "évite les allergies",
  "alimentation idéale pour tous les Beagles",
  "votre chien est obèse",
];

function base(over = {}) {
  return {
    age: "age-1-6",
    poids: "p-8-12",
    silhouette: "sil-ok",
    sterilisation: "ster-no",
    activite: "act-normal",
    appetit_digestion: "ad-normal",
    sante: "health-none",
    ...over,
  };
}

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("✓", name);
  } catch (e) {
    console.error("✗", name, "—", e.message);
    process.exitCode = 1;
  }
}

test("chiot sans sensibilité → puppy_standard", () => {
  assert(
    pickFoodProfileId(base({ age: "age-4-11m" })) === "puppy_standard",
    "expected puppy_standard"
  );
});

test("chiot digestion fragile → puppy_sensitive", () => {
  assert(
    pickFoodProfileId(
      base({ age: "age-lt4m", appetit_digestion: "ad-fragile" })
    ) === "puppy_sensitive",
    "expected puppy_sensitive"
  );
});

test("adulte actif poids stable → adult_standard", () => {
  assert(
    pickFoodProfileId(base({ activite: "act-high" })) === "adult_standard",
    "expected adult_standard"
  );
});

test("adulte arrondi, peu actif, stérilisé → adult_weight_control", () => {
  assert(
    pickFoodProfileId(
      base({
        silhouette: "sil-round",
        activite: "act-low",
        sterilisation: "ster-yes",
      })
    ) === "adult_weight_control",
    "expected adult_weight_control"
  );
});

test("adulte digestion fragile → adult_sensitive", () => {
  assert(
    pickFoodProfileId(base({ appetit_digestion: "ad-fragile" })) ===
      "adult_sensitive",
    "expected adult_sensitive"
  );
});

test("adulte peau sensible (sante) → adult_sensitive", () => {
  assert(
    pickFoodProfileId(base({ sante: "health-itch" })) === "adult_sensitive",
    "expected adult_sensitive from skin"
  );
});

test("7 ans ou plus → senior", () => {
  assert(
    pickFoodProfileId(base({ age: "age-7-9" })) === "senior",
    "expected senior"
  );
  assert(
    pickFoodProfileId(base({ age: "age-10p", silhouette: "sil-round" })) ===
      "senior",
    "senior beats weight_control"
  );
});

test("senior Care jamais grain_free", () => {
  const src = readFileSync(join(root, "src/data/foodProducts.ts"), "utf8");
  assert(src.includes('id: "upd-senior-care"'), "senior product exists");
  assert(
    /id:\s*"upd-senior-care"[\s\S]*?grainStatus:\s*"contains_grain"/.test(src),
    "senior contains_grain"
  );
});

test("maladie sous suivi → medical_review", () => {
  assert(
    pickFoodProfileId(base({ sante: "health-medical" })) === "medical_review",
    "expected medical"
  );
});

test("poids seul ne déclenche pas surpoids", () => {
  assert(
    pickFoodProfileId(base({ poids: "p-20p", silhouette: "sil-ok" })) ===
      "adult_standard",
    "weight alone ok"
  );
});

test("stérilisation seule ≠ light", () => {
  assert(
    pickFoodProfileId(
      base({
        sterilisation: "ster-yes",
        silhouette: "sil-ok",
        activite: "act-normal",
        appetit_digestion: "ad-normal",
      })
    ) === "adult_standard",
    "sterile alone not light"
  );
});

test("gourmand + stérilisé → weight_control", () => {
  assert(
    pickFoodProfileId(
      base({
        sterilisation: "ster-yes",
        appetit_digestion: "ad-greedy",
      })
    ) === "adult_weight_control",
    "greedy + sterile"
  );
});

test("7 questions dans le JSON", () => {
  const quiz = JSON.parse(
    readFileSync(
      join(root, "content/quizzes/alimentation-croquettes.json"),
      "utf8"
    )
  );
  assert(quiz.questions.length === 7, `got ${quiz.questions.length}`);
  assert(
    quiz.questions.some((q) => q.id === "appetit_digestion"),
    "merged appetit_digestion"
  );
  assert(
    !quiz.questions.some((q) => q.id === "appetit" || q.id === "digestion"),
    "old questions removed"
  );
  assert(
    quiz.questions.find((q) => q.id === "sante")?.type !== "multi",
    "sante is single"
  );
  for (const r of quiz.results) {
    assert(r.description && r.description.length > 40, `${r.id} description`);
    assert(Array.isArray(r.reasons) && r.reasons.length >= 1, `${r.id} reasons`);
  }
});

test("produits actifs pour affichage", () => {
  const src = readFileSync(join(root, "src/data/foodProducts.ts"), "utf8");
  assert(
    (src.match(/active:\s*true/g) || []).length >= 6,
    "active recipes"
  );
});

test("pas de lien # inventé", () => {
  const quiz = readFileSync(
    join(root, "content/quizzes/alimentation-croquettes.json"),
    "utf8"
  );
  assert(!quiz.includes('"affiliateUrl": "#"'), "no #");
});

test("rel sponsored dans FoodQuizResult", () => {
  const src = readFileSync(
    join(root, "src/components/food/FoodQuizResult.tsx"),
    "utf8"
  );
  assert(src.includes('rel="sponsored noopener noreferrer"'), "rel");
});

test("formulations interdites absentes", () => {
  const paths = [
    "src/lib/food-quiz.ts",
    "src/data/foodProducts.ts",
    "src/components/food/FoodQuizResult.tsx",
    "content/quizzes/alimentation-croquettes.json",
  ];
  let text = paths.map((p) => readFileSync(join(root, p), "utf8")).join("\n");
  text = text.replace(
    /FORBIDDEN_FOOD_PHRASES\s*=\s*\[[\s\S]*?\]\s*as const/g,
    ""
  );
  text = text.toLowerCase();
  for (const f of FORBIDDEN) {
    assert(!text.includes(f.toLowerCase()), `forbidden: ${f}`);
  }
});

test("compteur quiz dynamique", () => {
  const files = readdirSync(join(root, "content/quizzes")).filter((f) =>
    f.endsWith(".json")
  );
  assert(files.length >= 1, "quizzes exist");
  const hero = readFileSync(
    join(root, "src/components/home/Hero.tsx"),
    "utf8"
  );
  assert(
    hero.includes("quizzes.length") || hero.includes("quizCount"),
    "dynamic count"
  );
});

test("chiot gourmand ≠ light adulte", () => {
  const id = pickFoodProfileId(
    base({
      age: "age-4-11m",
      silhouette: "sil-round",
      appetit_digestion: "ad-greedy",
      sterilisation: "ster-yes",
    })
  );
  assert(id === "puppy_standard" || id === "puppy_sensitive", `got ${id}`);
});

console.log(`\n${passed} tests passed`);
