import React from "react";
import { CVData } from "../cvTypes";
import { formatDateRange, hasEntries } from "../cvFormat";

interface TemplateProps {
  data: CVData;
}

// Deliberately no color, no gradients, single column — the most
// ATS-parser-safe of the three templates, per Module C's brief.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-bold uppercase tracking-wide text-black border-b border-black pb-1 mb-2.5 mt-5 first:mt-0">{children}</h2>;
}

export default function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo: p } = data;
  return (
    <div className="font-sans text-black bg-white p-8 text-[13px] leading-relaxed">
      <header className="mb-5">
        <h1 className="text-xl font-bold">{p.fullName || "Your Name"}</h1>
        <p className="text-[12px] text-black mt-1">
          {[p.email, p.phone, p.location, p.linkedIn, p.portfolio].filter(Boolean).join(" | ")}
        </p>
      </header>

      {data.summary && (
        <section>
          <SectionHeading>Summary</SectionHeading>
          <p>{data.summary}</p>
        </section>
      )}

      {hasEntries(data, "workExperience") && (
        <section>
          <SectionHeading>Work Experience</SectionHeading>
          {data.workExperience.map((e) => (
            <div key={e.id} className="mb-2.5">
              <div className="flex justify-between font-bold">
                <span>{e.role as string}{e.organization ? `, ${e.organization}` : ""}</span>
                <span className="font-normal">{formatDateRange(e.startDate as string, e.endDate as string)}</span>
              </div>
              {e.description && <p className="mt-0.5">{e.description as string}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEntries(data, "education") && (
        <section>
          <SectionHeading>Education</SectionHeading>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between font-bold">
                <span>{e.institution as string}</span>
                <span className="font-normal">{formatDateRange(e.startDate as string, e.endDate as string)}</span>
              </div>
              <div>{[e.degree, e.field].filter(Boolean).join(", ")}{e.gpa ? ` — GPA: ${e.gpa}` : ""}</div>
            </div>
          ))}
        </section>
      )}

      {hasEntries(data, "leadership") && (
        <section>
          <SectionHeading>Leadership Experience</SectionHeading>
          {data.leadership.map((e) => (
            <div key={e.id} className="mb-2">
              <span className="font-bold">{e.role as string}</span>{e.organization ? `, ${e.organization}` : ""}
              {e.description && <p className="mt-0.5">{e.description as string}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEntries(data, "volunteering") && (
        <section>
          <SectionHeading>Volunteering</SectionHeading>
          {data.volunteering.map((e) => (
            <div key={e.id} className="mb-2">
              <span className="font-bold">{e.role as string}</span>{e.organization ? `, ${e.organization}` : ""}
              {e.description && <p className="mt-0.5">{e.description as string}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEntries(data, "researchExperience") && (
        <section>
          <SectionHeading>Research Experience</SectionHeading>
          {data.researchExperience.map((e) => (
            <div key={e.id} className="mb-2">
              <span className="font-bold">{e.title as string}</span>{e.institution ? `, ${e.institution}` : ""}
              {e.description && <p className="mt-0.5">{e.description as string}</p>}
            </div>
          ))}
        </section>
      )}

      {hasEntries(data, "publications") && (
        <section>
          <SectionHeading>Publications</SectionHeading>
          <ul className="list-disc pl-5 space-y-1">
            {data.publications.map((e) => (
              <li key={e.id}>{e.title as string}{e.venue ? `, ${e.venue}` : ""}{e.year ? ` (${e.year})` : ""}</li>
            ))}
          </ul>
        </section>
      )}

      {hasEntries(data, "conferences") && (
        <section>
          <SectionHeading>Conferences</SectionHeading>
          <ul className="list-disc pl-5 space-y-1">
            {data.conferences.map((e) => <li key={e.id}>{e.name as string}{e.role ? ` — ${e.role}` : ""}</li>)}
          </ul>
        </section>
      )}

      {hasEntries(data, "awards") && (
        <section>
          <SectionHeading>Awards</SectionHeading>
          <ul className="list-disc pl-5 space-y-1">
            {data.awards.map((e) => <li key={e.id}>{e.title as string}{e.issuer ? `, ${e.issuer}` : ""}{e.year ? ` (${e.year})` : ""}</li>)}
          </ul>
        </section>
      )}

      {hasEntries(data, "scholarships") && (
        <section>
          <SectionHeading>Scholarships</SectionHeading>
          <ul className="list-disc pl-5 space-y-1">
            {data.scholarships.map((e) => <li key={e.id}>{e.name as string}{e.issuer ? `, ${e.issuer}` : ""}{e.year ? ` (${e.year})` : ""}</li>)}
          </ul>
        </section>
      )}

      {hasEntries(data, "certifications") && (
        <section>
          <SectionHeading>Certifications</SectionHeading>
          <ul className="list-disc pl-5 space-y-1">
            {data.certifications.map((e) => <li key={e.id}>{e.name as string}{e.issuer ? `, ${e.issuer}` : ""}{e.year ? ` (${e.year})` : ""}</li>)}
          </ul>
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <SectionHeading>Skills</SectionHeading>
          <p>{data.skills.map((s) => s.name).join(", ")}</p>
        </section>
      )}

      {hasEntries(data, "languages") && (
        <section>
          <SectionHeading>Languages</SectionHeading>
          <p>{data.languages.map((l) => [l.name, l.proficiency].filter(Boolean).join(" — ")).join(", ")}</p>
        </section>
      )}

      {hasEntries(data, "references") && (
        <section>
          <SectionHeading>References</SectionHeading>
          {data.references.map((e) => (
            <div key={e.id} className="mb-1.5">
              <span className="font-bold">{e.name as string}</span>
              {[e.title, e.organization].filter(Boolean).length > 0 ? `, ${[e.title, e.organization].filter(Boolean).join(", ")}` : ""}
              {(e.email || e.phone) && <div>{[e.email, e.phone].filter(Boolean).join(" | ")}</div>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}