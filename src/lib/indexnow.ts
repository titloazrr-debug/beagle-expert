/** IndexNow — ping Bing / Yandex / Brave et les moteurs participants. */

export const INDEXNOW_KEY = "4e677eaeac30ef2db51f6cde697be4c8";
export const INDEXNOW_HOST = "expert-beagle.fr";

export function indexNowKeyPath(): string {
  return `/${INDEXNOW_KEY}.txt`;
}

export function indexNowKeyLocation(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${indexNowKeyPath()}`;
}
