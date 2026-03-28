import type { Metadata } from "next";
import { SkillsPage } from "@/components/sections/SkillsPage";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Skills",
  description: "An orbital view of the technologies, tools, and disciplines I work with.",
};

export default function Skills() {
  return (
    <>
      <SkillsPage />
      <Footer />
    </>
  );
}
