import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "dev-secret-change-this",
  admin: {
    user: "users",
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 30_000,
      max: 5,
    },
  }),
  collections: [
    // ─── Users (admin) ────────────────────────────────────────
    {
      slug: "users",
      auth: true,
      fields: [
        { name: "name", type: "text" },
      ],
    },

    // ─── Projects ─────────────────────────────────────────────
    {
      slug: "projects",
      admin: { useAsTitle: "title" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true, unique: true },
        { name: "year", type: "text" },
        { name: "category", type: "text" },
        { name: "color", type: "text", defaultValue: "#7B9E87" },
        { name: "coverImage", type: "upload", relationTo: "media" },
        { name: "images", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
        { name: "summary", type: "textarea" },
        { name: "problem", type: "richText" },
        { name: "solution", type: "richText" },
        { name: "techStack", type: "array", fields: [{ name: "name", type: "text" }] },
        { name: "liveUrl", type: "text" },
        { name: "githubRepo", type: "text" },
        { name: "featured", type: "checkbox", defaultValue: false },
        { name: "published", type: "checkbox", defaultValue: false },
        { name: "order", type: "number", defaultValue: 0 },
      ],
    },

    // ─── Skills ───────────────────────────────────────────────
    {
      slug: "skills",
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "category",
          type: "select",
          options: ["Frontend", "Backend", "AI", "Enterprise", "DevOps", "Design", "Other"],
          required: true,
        },
        { name: "proficiency", type: "number", min: 1, max: 5 },
        { name: "visible", type: "checkbox", defaultValue: true },
        { name: "currentlyLearning", type: "checkbox", defaultValue: false },
        { name: "order", type: "number", defaultValue: 0 },
      ],
    },

    // ─── Experience ───────────────────────────────────────────
    {
      slug: "experience",
      admin: { useAsTitle: "role" },
      fields: [
        { name: "company", type: "text", required: true },
        { name: "role", type: "text", required: true },
        { name: "startDate", type: "date", required: true },
        { name: "endDate", type: "date" },
        { name: "description", type: "richText" },
        { name: "logo", type: "upload", relationTo: "media" },
        {
          name: "type",
          type: "select",
          options: ["Full-time", "Contract", "Freelance"],
        },
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },

    // ─── Writing ──────────────────────────────────────────────
    {
      slug: "writing",
      admin: { useAsTitle: "title" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true, unique: true },
        { name: "publishedAt", type: "date" },
        { name: "updatedAt", type: "date" },
        { name: "excerpt", type: "textarea" },
        { name: "content", type: "richText" },
        { name: "coverImage", type: "upload", relationTo: "media" },
        { name: "tags", type: "array", fields: [{ name: "tag", type: "text" }] },
        { name: "readingTime", type: "text" },
        { name: "published", type: "checkbox", defaultValue: false },
        {
          name: "source",
          type: "select",
          options: ["local", "dev.to", "hashnode"],
          defaultValue: "local",
        },
        { name: "externalUrl", type: "text" },
      ],
    },

    // ─── Testimonials ─────────────────────────────────────────
    {
      slug: "testimonials",
      admin: { useAsTitle: "authorName" },
      fields: [
        { name: "authorName", type: "text", required: true },
        { name: "authorRole", type: "text" },
        { name: "authorCompany", type: "text" },
        { name: "authorAvatar", type: "upload", relationTo: "media" },
        { name: "quote", type: "textarea", required: true },
        { name: "projectRef", type: "relationship", relationTo: "projects" },
        { name: "visible", type: "checkbox", defaultValue: true },
        { name: "order", type: "number", defaultValue: 0 },
      ],
    },

    // ─── Milestones (timeline entries) ────────────────────────
    {
      slug: "milestones",
      admin: { useAsTitle: "title" },
      fields: [
        { name: "year", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "company", type: "text" },
        {
          name: "type",
          type: "select",
          options: ["Open Source", "Certification", "Projects", "Learning", "Milestone", "Other"],
        },
        { name: "description", type: "textarea" },
        { name: "order", type: "number", defaultValue: 0 },
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },

    // ─── Social Posts (LinkedIn, GitHub, etc.) ─────────────────
    {
      slug: "social-posts",
      admin: { useAsTitle: "title" },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: ["linkedin", "github", "twitter", "other"],
        },
        { name: "title", type: "text", required: true },
        { name: "excerpt", type: "textarea" },
        { name: "url", type: "text" },
        { name: "publishedAt", type: "date" },
        {
          name: "source",
          type: "select",
          options: ["manual", "api"],
          defaultValue: "manual",
        },
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },

    // ─── Media ────────────────────────────────────────────────
    {
      slug: "media",
      upload: true,
      fields: [
        { name: "alt", type: "text" },
      ],
    },
  ],

  // ─── Globals ────────────────────────────────────────────────
  globals: [
    {
      slug: "now",
      fields: [
        { name: "building", type: "array", fields: [{ name: "item", type: "text" }] },
        { name: "learning", type: "array", fields: [{ name: "item", type: "text" }] },
        { name: "reading", type: "array", fields: [{ name: "item", type: "text" }] },
        { name: "location", type: "text" },
        { name: "lastUpdated", type: "date" },
        { name: "availableForWork", type: "checkbox", defaultValue: true },
      ],
    },
    {
      slug: "uses",
      fields: [
        {
          name: "hardware",
          type: "array",
          fields: [
            { name: "name", type: "text" },
            { name: "note", type: "text" },
          ],
        },
        {
          name: "software",
          type: "array",
          fields: [
            { name: "name", type: "text" },
            { name: "note", type: "text" },
          ],
        },
        {
          name: "devEnv",
          type: "array",
          fields: [
            { name: "name", type: "text" },
            { name: "note", type: "text" },
          ],
        },
        {
          name: "fonts",
          type: "array",
          fields: [
            { name: "name", type: "text" },
            { name: "note", type: "text" },
          ],
        },
        {
          name: "productivity",
          type: "array",
          fields: [
            { name: "name", type: "text" },
            { name: "note", type: "text" },
          ],
        },
      ],
    },

    // ─── Beliefs (Manifesto) ──────────────────────────────────
    {
      slug: "beliefs",
      fields: [
        {
          name: "items",
          type: "array",
          fields: [
            { name: "number", type: "text" },
            { name: "statement", type: "textarea", required: true },
          ],
        },
      ],
    },

    // ─── Stats ────────────────────────────────────────────────
    {
      slug: "stats",
      fields: [
        {
          name: "items",
          type: "array",
          fields: [
            { name: "value", type: "text", required: true },
            { name: "label", type: "text", required: true },
            { name: "description", type: "text" },
          ],
        },
      ],
    },
  ],

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
});
