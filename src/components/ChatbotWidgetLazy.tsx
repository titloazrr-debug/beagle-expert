"use client";

import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(
  () =>
    import("@/components/ChatbotWidget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);

/**
 * Le bouton flottant n’est pas dans le HTML initial : son JavaScript
 * arrive après l’hydratation, sans changer le comportement du widget.
 */
export function ChatbotWidgetLazy() {
  return <ChatbotWidget />;
}
