import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { ContactSceneClient } from "@/components/3d/ContactSceneClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaboration, projects, or just a conversation.",
};

const socialLinks = [
  { href: "https://github.com/Abhijit1018", label: "GitHub", handle: "@Abhijit1018" },
  { href: "https://www.linkedin.com/in/abhijit-singh10", label: "LinkedIn", handle: "abhijit-singh10" },
  { href: "https://abhijitsingh01.netlify.app", label: "Portfolio (old)", handle: "abhijitsingh01.netlify.app" },
  { href: "mailto:hello@example.com", label: "Email", handle: "hello@example.com" },
];

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 min-h-screen" aria-label="Contact">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start py-16">
            {/* Left: 3D scene + info */}
            <div>
              <p className="section-number mb-4">Contact</p>
              <h1
                className="font-serif mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
              >
                Let's Build Something
              </h1>
              <p
                className="leading-relaxed mb-10 max-w-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Open to select freelance engagements, full-time opportunities, and
                interesting conversations. If you have something worth building, I want
                to hear about it.
              </p>

              {/* 3D Scene */}
              <div
                className="rounded-xl overflow-hidden mb-10"
                style={{
                  height: "280px",
                  border: "1px solid var(--border-subtle)",
                }}
                aria-hidden="true"
              >
                <ContactSceneClient />
              </div>

              {/* Social links */}
              <div className="space-y-4">
                <p className="section-number">Find me at</p>
                {socialLinks.map(({ href, label, handle }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group py-2"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {label}
                    </span>
                    <span
                      className="text-sm group-hover:text-[var(--accent-sage)] transition-colors"
                      style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
                    >
                      {handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:sticky lg:top-32">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
