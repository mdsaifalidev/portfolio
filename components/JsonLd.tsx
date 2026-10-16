import { certifications, education, experience, profile, skills } from "@/content/profile";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/** Renders schema.org structured data. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const personRef = { "@type": "Person", "@id": `${SITE_URL}/#person`, name: profile.name, url: SITE_URL };

export function personSchema() {
  const current = experience.find((job) => job.end === "Present");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...personRef,
        jobTitle: profile.role,
        description: profile.headline,
        email: `mailto:${profile.email}`,
        image: absoluteUrl("/me.jpg"),
        sameAs: [profile.linkedin, profile.github],
        address: { "@type": "PostalAddress", addressLocality: "Durgapur", addressRegion: "West Bengal", addressCountry: "IN" },
        ...(current && { worksFor: { "@type": "Organization", name: current.company } }),
        alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
        hasCredential: certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.label, url: c.href })),
        knowsAbout: skills.flatMap((g) => g.items),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: profile.name,
        author: { "@id": personRef["@id"] },
      },
    ],
  };
}
