import React from "react";
import { CVData } from "../cvTypes";
import { formatDateRange, hasEntries } from "../cvFormat";

interface TemplateProps {
  data: CVData;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-extrabold uppercase tracking-wider text-nepal-crimson mb-2.5 mt-5 first:mt-0">
      {children}
    </h2>
  );
}

export default function ScholarshipTemplate({ data }: TemplateProps) {
  const { personalInfo: p } = data;
  return (
    <div className="font-sans text-slate-800 bg-white text-[13px] leading-relaxed">
      <header className="bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light text-white p-8">
        <h1 className="text-2xl font-extrabold">{p.fullName || "Your Name"}</h1>
        <p className="text-[12px] opacity-90 mt-1.5">
          {[p.email, p.phone, p.location].filter(Boolean).join("  •  ")}
        </p>
        {(p.linkedIn || p.portfolio) && (
          <p className="text-[12px] opacity-90">{[p.linkedIn, p.portfolio].filter(Boolean).join("  •  ")}</p>
        )}
      </header>

      <div className="p-8">
        {data.summary && (
          <section>
            <SectionHeading>Profile</SectionHeading>
            <p>{data.summary}</p>
          </section>
        )}

        {hasEntries(data, "scholarships") && (
          <section>
            <SectionHeading>Scholarships Received</SectionHeading>
            <ul className="space-y-1.5">
              {data.scholarships.map((e) => (
                <li key={e.id} className="flex justify-between">
                  <span className="font-semibold">{e.name as string}{e.issuer ? ` — ${e.issuer}` : ""}</span>
                  <span className="text-slate-500">{e.year as string}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasEntries(data, "awards") && (
          <section>
            <SectionHeading>Awards & Honors</SectionHeading>
            <ul className="space-y-1.5">
              {data.awards.map((e) => (
                <li key={e.id} className="flex justify-between">
                  <span className="font-semibold">{e.title as string}{e.issuer ? ` — ${e.issuer}` : ""}</span>
                  <span className="text-slate-500">{e.year as string}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasEntries(data, "education") && (
          <section>
            <SectionHeading>Education</SectionHeading>
            {data.education.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between font-semibold">
                  <span>{e.institution as string}</span>
                  <span className="text-slate-500 font-normal">{formatDateRange(e.startDate as string, e.endDate as string)}</span>
                </div>
                <div className="text-slate-600">
                  {[e.degree, e.field].filter(Boolean).join(", ")}
                  {e.gpa ? ` — GPA: ${e.gpa}` : ""}
                </div>
                {e.description && <p className="mt-0.5">{e.description as string}</p>}
              </div>
            ))}
          </section>
        )}

        {hasEntries(data, "leadership") && (
          <section>
            <SectionHeading>Leadership</SectionHeading>
            {data.leadership.map((e) => (
              <div key={e.id} className="mb-2">
                <span className="font-semibold">{e.role as string}</span>
                {e.organization ? `, ${e.organization}` : ""}
                {e.description && <p className="mt-0.5 text-slate-600">{e.description as string}</p>}
              </div>
            ))}
          </section>
        )}

        {hasEntries(data, "volunteering") && (
          <section>
            <SectionHeading>Volunteering & Community Impact</SectionHeading>
            {data.volunteering.map((e) => (
              <div key={e.id} className="mb-2">
                <span className="font-semibold">{e.role as string}</span>
                {e.organization ? `, ${e.organization}` : ""}
                {e.description && <p className="mt-0.5 text-slate-600">{e.description as string}</p>}
              </div>
            ))}
          </section>
        )}

        {hasEntries(data, "workExperience") && (
          <section>
            <SectionHeading>Work Experience</SectionHeading>
            {data.workExperience.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between font-semibold">
                  <span>{e.role as string}{e.organization ? `, ${e.organization}` : ""}</span>
                  <span className="text-slate-500 font-normal">{formatDateRange(e.startDate as string, e.endDate as string)}</span>
                </div>
                {e.description && <p className="mt-0.5 text-slate-600">{e.description as string}</p>}
              </div>
            ))}
          </section>
        )}

        {hasEntries(data, "researchExperience") && (
          <section>
            <SectionHeading>Research Experience</SectionHeading>
            {data.researchExperience.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="font-semibold">{e.title as string}</div>
                {e.institution && <div className="text-slate-600">{e.institution as string}</div>}
                {e.description && <p className="mt-0.5 text-slate-600">{e.description as string}</p>}
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
              {data.conferences.map((e) => (
                <li key={e.id}>{e.name as string}{e.role ? ` — ${e.role}` : ""}</li>
              ))}
            </ul>
          </section>
        )}

        {hasEntries(data, "certifications") && (
          <section>
            <SectionHeading>Certifications</SectionHeading>
            <ul className="list-disc pl-5 space-y-1">
              {data.certifications.map((e) => (
                <li key={e.id}>{e.name as string}{e.issuer ? `, ${e.issuer}` : ""}{e.year ? ` (${e.year})` : ""}</li>
              ))}
            </ul>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <SectionHeading>Skills</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s.id} className="px-2.5 py-1 rounded-full bg-nepal-crimson/10 text-nepal-crimson text-[11px] font-bold">
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasEntries(data, "languages") && (
          <section>
            <SectionHeading>Languages</SectionHeading>
            <p>{data.languages.map((l) => [l.name, l.proficiency].filter(Boolean).join(" — ")).join("  •  ")}</p>
          </section>
        )}

        {hasEntries(data, "references") && (
          <section>
            <SectionHeading>References</SectionHeading>
            {data.references.map((e) => (
              <div key={e.id} className="mb-1.5">
                <span className="font-semibold">{e.name as string}</span>
                {[e.title, e.organization].filter(Boolean).length > 0 ? `, ${[e.title, e.organization].filter(Boolean).join(", ")}` : ""}
                {(e.email || e.phone) && <div className="text-slate-500">{[e.email, e.phone].filter(Boolean).join(" • ")}</div>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}