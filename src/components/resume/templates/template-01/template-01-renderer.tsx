import type { ResumeData } from "@/lib/resume/types";
import styles from "./template-01.module.css";

/**
 * Template 01 — a from-scratch React/CSS recreation of the visual design in
 * public/resumes/template-01/{resume.pdf,preview.png} (used only as a design
 * reference; that PDF/DOCX is never read or modified at runtime). Renders
 * ResumeData directly — no template-specific fields, no fabricated content, no
 * hardcoded example-person data. See docs/RESUME-ENHANCEMENT.md §Resume Builder.
 *
 * A plain function component (no hooks, no "use client") so it can also be
 * exercised in tests via react-dom/server without a DOM.
 */

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** No explicit "headline" field exists in ResumeData (see docs/RESUME-ENHANCEMENT.md
 * §Template independence — nothing template-specific is added to the shared model).
 * The most relevant current/most-recent role is used as a display-only headline
 * instead, falling back to nothing rather than guessing. */
function deriveHeadline(data: ResumeData): string | undefined {
  const current = data.experience.find((e) => e.current && hasText(e.role));
  if (current) return current.role;
  const first = data.experience.find((e) => hasText(e.role));
  return first?.role;
}

function formatDateRange(startDate?: string, endDate?: string, current?: boolean): string | undefined {
  const start = hasText(startDate) ? startDate.trim() : undefined;
  const end = current ? "Present" : hasText(endDate) ? endDate!.trim() : undefined;
  if (start && end) return `${start} – ${end}`;
  return start ?? end;
}

export function Template01Renderer({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, achievements } = data;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    ...personalInfo.links.filter((l) => hasText(l.url)).map((l) => l.url),
  ].filter(hasText);

  const headline = deriveHeadline(data);
  const hasSkills = skills.some((g) => g.items.length > 0);
  const hasCertifications = certifications.length > 0;
  const cleanedAchievements = achievements.filter(hasText);
  const hasAchievements = cleanedAchievements.length > 0;
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasProjects = projects.length > 0;

  const hasLeftColumn = hasSkills || hasCertifications || hasAchievements;
  const hasRightColumn = hasExperience || hasEducation || hasProjects;

  return (
    <div className={styles.page}>
      <div className={styles.nameRow}>
        <h1 className={hasText(personalInfo.fullName) ? styles.name : `${styles.name} ${styles.namePlaceholder}`}>
          {hasText(personalInfo.fullName) ? personalInfo.fullName : "Your Name"}
        </h1>
        {hasText(headline) && <span className={styles.headline}>{headline}</span>}
      </div>

      {contactItems.length > 0 && (
        <div className={styles.contactRow}>
          {contactItems.map((item, i) => (
            <span key={i} className={styles.contactItem}>
              <span className={styles.contactDot} aria-hidden />
              {item}
            </span>
          ))}
        </div>
      )}

      {hasText(summary) && <p className={styles.summary}>{summary.trim()}</p>}

      {(hasLeftColumn || hasRightColumn) && (
        <div className={hasLeftColumn && hasRightColumn ? styles.columns : `${styles.columns} ${styles.columnsSingle}`}>
          {hasLeftColumn && (
            <div>
              {hasSkills && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Skills</h2>
                  {skills
                    .filter((g) => g.items.length > 0)
                    .map((group) => (
                      <div key={group.id}>
                        {hasText(group.category) && <h3 className={styles.groupTitle}>{group.category}</h3>}
                        <ul className={styles.list}>
                          {group.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}

              {hasCertifications && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Certifications</h2>
                  {certifications.map((cert) => (
                    <div key={cert.id} className={styles.certEntry}>
                      <div className={styles.entryTitle}>{cert.name}</div>
                      {(hasText(cert.issuer) || hasText(cert.date)) && (
                        <div className={styles.entryMeta}>{[cert.issuer, cert.date].filter(hasText).join(" — ")}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {hasAchievements && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Achievements</h2>
                  <ul className={styles.plainList}>
                    {cleanedAchievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {hasRightColumn && (
            <div>
              {hasExperience && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  {experience.map((entry) => {
                    const dateRange = formatDateRange(entry.startDate, entry.endDate, entry.current);
                    const bullets = entry.bullets.filter(hasText);
                    return (
                      <div key={entry.id} className={styles.entry}>
                        <div>
                          {hasText(entry.role) && <span className={styles.entryTitle}>{entry.role}</span>}
                          {hasText(entry.role) && hasText(entry.company) && ", "}
                          {hasText(entry.company) && <span className={styles.entrySub}>{entry.company}</span>}
                        </div>
                        {(dateRange || hasText(entry.location)) && (
                          <div className={styles.entryMeta}>{[dateRange, entry.location].filter(hasText).join(" | ")}</div>
                        )}
                        {bullets.length > 0 && (
                          <ul className={styles.list}>
                            {bullets.map((bullet, i) => (
                              <li key={i}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {hasEducation && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  {education.map((entry) => {
                    const dateRange = formatDateRange(entry.startDate, entry.endDate);
                    const degreeLine = [entry.degree, entry.field].filter(hasText).join(", ");
                    return (
                      <div key={entry.id} className={styles.entry}>
                        {hasText(entry.institution) && <div className={styles.entryTitle}>{entry.institution}</div>}
                        {hasText(degreeLine) && <div className={styles.entrySub}>{degreeLine}</div>}
                        {dateRange && <div className={styles.entryMeta}>{dateRange}</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              {hasProjects && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Projects</h2>
                  {projects.map((entry) => {
                    const bullets = entry.bullets.filter(hasText);
                    return (
                      <div key={entry.id} className={styles.entry}>
                        {hasText(entry.name) && <div className={styles.entryTitle}>{entry.name}</div>}
                        {hasText(entry.description) && <div className={styles.entrySub}>{entry.description}</div>}
                        {hasText(entry.link) && (
                          <div className={styles.entryMeta}>
                            <span className={styles.link}>{entry.link}</span>
                          </div>
                        )}
                        {bullets.length > 0 && (
                          <ul className={styles.list}>
                            {bullets.map((bullet, i) => (
                              <li key={i}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
