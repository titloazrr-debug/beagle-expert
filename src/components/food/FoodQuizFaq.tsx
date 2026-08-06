import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/seo";

export const FOOD_QUIZ_FAQ = [
  {
    question: "Quelles croquettes choisir pour un Beagle adulte ?",
    answer:
      "Le choix dépend notamment de sa silhouette, de son activité, de sa stérilisation, de sa digestion et de sa tolérance individuelle. Une recette adulte classique peut convenir à un chien actif et au poids stable, tandis qu’une recette moins énergétique peut être plus pertinente lorsqu’il prend facilement du poids.",
  },
  {
    question: "Un Beagle stérilisé doit-il forcément manger des croquettes light ?",
    answer:
      "Non. La stérilisation est un facteur à prendre en compte, mais la silhouette, l’activité et la ration réellement distribuée restent essentielles. Le quiz ne sélectionne une recette light que lorsque plusieurs indicateurs concordent.",
  },
  {
    question:
      "Les croquettes sans céréales sont-elles forcément meilleures pour un Beagle ?",
    answer:
      "Non. L’absence de céréales est une caractéristique de formulation, pas une garantie automatique de meilleure qualité ou de meilleure tolérance. Le choix doit surtout tenir compte de l’âge du chien, de sa silhouette, de son activité, de sa digestion, de la composition complète de l’aliment et de l’avis du vétérinaire lorsqu’un problème de santé existe.",
  },
  {
    question: "Comment savoir si mon Beagle est en surpoids ?",
    answer:
      "Le poids doit être interprété avec la silhouette. Une taille peu visible et des côtes difficiles à sentir peuvent justifier un contrôle plus précis. En cas de doute, demandez au vétérinaire d’évaluer son état corporel.",
  },
  {
    question: "Puis-je utiliser le quiz si mon Beagle est malade ?",
    answer:
      "Le quiz peut expliquer les critères généraux, mais il ne doit pas remplacer l’alimentation prescrite. En présence d’une maladie, d’une allergie diagnostiquée ou de troubles persistants, demandez l’avis du vétérinaire avant de changer de recette.",
  },
  {
    question: "Pourquoi recommandez-vous Ultra Premium Direct ?",
    answer:
      "Le quiz détermine d’abord le type de croquettes adapté (chiot, adulte, light, digestion sensible, senior). Nous illustrons ensuite ce type avec Ultra Premium Direct, une marque française en vente directe dont la gamme couvre ces besoins, avec un bon rapport qualité-prix. Ce n’est pas un classement de toutes les marques du marché. Certains liens sont affiliés et peuvent rémunérer Beagle Expert sans surcoût pour le visiteur.",
  },
] as const;

export function FoodQuizFaq() {
  const items = FOOD_QUIZ_FAQ.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));
  const ld = faqPageJsonLd(items);

  return (
    <>
      {ld && <JsonLd data={ld} />}
      <FaqAccordion
        items={items}
        title="Questions fréquentes sur les croquettes Beagle"
        className="mt-10"
      />
    </>
  );
}
