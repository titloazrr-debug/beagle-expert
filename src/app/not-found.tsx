import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span className="text-6xl" aria-hidden>
        🐕
      </span>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold">
        Page introuvable
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Ce {`Beagle`} a suivi une piste… et s&apos;est perdu. Revenez à
        l&apos;accueil ou explorez les quiz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/quizzes">Quiz</Link>
        </Button>
      </div>
    </div>
  );
}
