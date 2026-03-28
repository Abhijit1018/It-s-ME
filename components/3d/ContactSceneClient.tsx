"use client";

import dynamic from "next/dynamic";

const ContactScene = dynamic(
  () => import("./ContactScene").then((m) => m.ContactScene),
  { ssr: false }
);

export function ContactSceneClient() {
  return <ContactScene />;
}
