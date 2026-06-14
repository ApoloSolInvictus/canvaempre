import PublicPageLayout from '../components/PublicPageLayout';
import { legalDocuments } from '../data/legal';

const LegalScreen = ({ documentId }) => {
  const document = legalDocuments[documentId] ?? legalDocuments.terminos;

  return (
    <PublicPageLayout
      description={document.description}
      eyebrow={document.eyebrow}
      title={document.title}
    >
      {document.sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-black text-ink">{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p
              className="mt-3 text-sm font-medium leading-7 text-muted"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-3 space-y-3">
              {section.bullets.map((bullet) => (
                <li
                  className="flex gap-3 text-sm font-medium leading-6 text-muted"
                  key={bullet}
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </PublicPageLayout>
  );
};

export default LegalScreen;

