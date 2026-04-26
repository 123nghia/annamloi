import { SiteContent } from "@/lib/types";
import { calculateDaysLeft } from "@/lib/site-utils";
import { AppIcon } from "@/components/ui/app-icon";
import { FinanceCalculator } from "@/components/public/finance-calculator";
import { LeadForm } from "@/components/public/lead-form";

interface LandingPageProps {
  content: SiteContent;
}

function SectionHead({
  index,
  kicker,
  title,
  summaryTitle,
  summaryText,
  narrow
}: {
  index: string;
  kicker: string;
  title: string;
  summaryTitle: string;
  summaryText: string;
  narrow?: boolean;
}) {
  return (
    <div className={`section-head${narrow ? " narrow" : ""}`}>
      <div className="section-heading">
        <div className="section-kicker-row">
          <span className="section-index">{index}</span>
          <p className="kicker">{kicker}</p>
        </div>
        <h2>{title}</h2>
      </div>
      <div className="section-summary">
        <strong>{summaryTitle}</strong>
        <p>{summaryText}</p>
      </div>
    </div>
  );
}

export function LandingPage({ content }: LandingPageProps) {
  const spotlightDays = calculateDaysLeft(content.spotlight.deadline);

  return (
    <>
      <header className="site-header" id="top">
        <nav className="nav" aria-label="Điều hướng chính">
          <a className="brand" href="#top" aria-label={content.site.brandName}>
            <img src={content.site.logoUrl} alt={`Logo ${content.site.brandName}`} />
          </a>
          <div className="nav-links">
            {content.site.navLinks.map((item) => (
              <a key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="nav-action" href={content.site.supportButton.href}>
            <AppIcon name="phone-call" />
            <span>{content.site.supportButton.label}</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <img src={content.hero.heroImageUrl} alt="" />
          </div>
          <div className="hero-copy">
            <div className="hero-icon" aria-hidden="true">
              <AppIcon name="sun" size={32} />
            </div>
            <p className="eyebrow">
              <AppIcon name="shield-check" />
              {content.hero.eyebrow}
            </p>
            <h1 id="hero-title">
              <span>{content.hero.title}</span>
              <span className="hero-accent">{content.hero.accent}</span>
            </h1>
            <p className="hero-lead">{content.hero.lead}</p>
            <div className="hero-actions" aria-label="Hành động chính">
              <a className="button button-primary" href={content.hero.primaryCta.href}>
                <AppIcon name="zap" />
                {content.hero.primaryCta.label}
              </a>
              <a className="button button-secondary" href={content.hero.secondaryCta.href}>
                <AppIcon name="badge-check" />
                {content.hero.secondaryCta.label}
              </a>
            </div>
            <div className="hero-kpis" aria-label="Thông số chính">
              {content.hero.metrics.map((item) => (
                <div key={`${item.label}-${item.value}`}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <p className="risk-note">{content.hero.riskNote}</p>
          </div>
        </section>

        <section className="trust-strip" aria-label="Yếu tố tăng niềm tin">
          {content.trustStrip.map((item) => (
            <div className="trust-item" key={`${item.icon}-${item.text}`}>
              <AppIcon name={item.icon} />
              <span>{item.text}</span>
            </div>
          ))}
        </section>

        <section className="section visual-story" aria-labelledby="visual-story-title">
          <SectionHead
            index="01"
            kicker={content.visualStory.kicker}
            title={content.visualStory.title}
            summaryTitle={content.visualStory.summaryTitle}
            summaryText={content.visualStory.summaryText}
          />
          <div className="story-grid">
            {content.visualStory.cards.map((card) => (
              <article
                className={`story-card${card.featured ? " story-card-large" : ""}`}
                key={card.title}
              >
                <img src={card.imageUrl} alt={card.alt} />
                <div className="story-content">
                  <span className="story-tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section trust-proof" aria-labelledby="trust-proof-title">
          <div className="trust-proof-head">
            <p className="kicker">{content.trustProof.kicker}</p>
            <h2 id="trust-proof-title">{content.trustProof.title}</h2>
          </div>
          <div className="trust-proof-grid">
            {content.trustProof.cards.map((card) => (
              <article className="trust-proof-card" key={card.title}>
                <div className="trust-proof-icon">
                  <AppIcon name={card.icon} size={24} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="deal-spotlight" aria-labelledby="deal-spotlight-title">
          <div className="deal-spotlight-shell">
            <p className="deal-spotlight-kicker">
              {content.spotlight.badgeText}
              {" • "}
              {spotlightDays ? `Đóng booking trong ${spotlightDays} ngày` : "Sắp đóng"}
              {" • "}
              {content.spotlight.roiText}
            </p>
            <h2 id="deal-spotlight-title">
              {content.spotlight.titlePrefix}{" "}
              <span className="deal-spotlight-highlight">{content.spotlight.highlight}</span>{" "}
              {content.spotlight.titleSuffix}
            </h2>
            <p className="deal-spotlight-note">{content.spotlight.note}</p>
            <a className="button button-amber" href={content.spotlight.cta.href}>
              <AppIcon name="zap" />
              {content.spotlight.cta.label}
            </a>
          </div>
        </section>

        <section className="section" id="deals">
          <SectionHead
            index="02"
            kicker={content.deals.kicker}
            title={content.deals.title}
            summaryTitle={content.deals.summaryTitle}
            summaryText={content.deals.summaryText}
          />
          <div className="deal-grid">
            {content.deals.items.map((deal) => (
              <article className={`deal-card${deal.featured ? " featured" : ""}`} key={deal.title}>
                <div className="deal-image">
                  <img src={deal.imageUrl} alt={deal.alt} />
                  <span className={`badge${deal.statusTone === "live" ? " live" : deal.statusTone === "closed" ? " closed" : ""}`}>
                    <AppIcon name={deal.statusIcon} />
                    {deal.statusLabel}
                  </span>
                </div>
                <div className="deal-body">
                  <div className="deal-title">
                    <h3>{deal.title}</h3>
                    <span>{deal.capacity}</span>
                  </div>
                  <div className="progress-row">
                    <span>{deal.fillLabel}</span>
                    <strong>{deal.fillValue}</strong>
                  </div>
                  <div className="progress" aria-label={deal.fillLabel}>
                    <span style={{ width: `${deal.fillPercent}%` }} />
                  </div>
                  <div className="deal-metrics">
                    {deal.metrics.map((metric) => (
                      <div key={`${deal.title}-${metric.label}`}>
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </div>
                    ))}
                  </div>
                  <a
                    className={`button ${deal.ctaTone === "primary" ? "button-primary" : "button-light"} full`}
                    href={deal.ctaHref}
                  >
                    <AppIcon name={deal.ctaTone === "primary" ? "arrow-right" : "bell"} />
                    {deal.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="deal-detail">
          <SectionHead
            index="03"
            kicker={content.dealDetail.kicker}
            title={content.dealDetail.title}
            summaryTitle={content.dealDetail.summaryTitle}
            summaryText={content.dealDetail.summaryText}
            narrow
          />
          <div className="detail-layout">
            <div className="asset-panel" id="asset">
              <div className="panel-image">
                <img src={content.dealDetail.assetImageUrl} alt={content.dealDetail.assetImageAlt} />
              </div>
              <div className="asset-grid">
                {content.dealDetail.metrics.map((metric) => (
                  <div key={`${metric.label}-${metric.value}`}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="legal-panel">
              <h3>{content.dealDetail.checklistTitle}</h3>
              <ul className="check-list">
                {content.dealDetail.checklist.map((item) => (
                  <li key={item}>
                    <AppIcon name="file-text" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="cta-stack">
                <a className="button button-primary" href={content.dealDetail.primaryCta.href}>
                  <AppIcon name="file-signature" />
                  {content.dealDetail.primaryCta.label}
                </a>
                <a className="button button-secondary" href={content.dealDetail.secondaryCta.href}>
                  <AppIcon name="calculator" />
                  {content.dealDetail.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section finance" id="cashflow">
          <SectionHead
            index="04"
            kicker={content.finance.kicker}
            title={content.finance.title}
            summaryTitle={content.finance.summaryTitle}
            summaryText={content.finance.summaryText}
          />
          <div className="finance-layout">
            <FinanceCalculator content={content.finance} />
          </div>
        </section>

        <section className="section dashboard" id="dashboard">
          <SectionHead
            index="05"
            kicker={content.dashboard.kicker}
            title={content.dashboard.title}
            summaryTitle={content.dashboard.summaryTitle}
            summaryText={content.dashboard.summaryText}
          />
          <div className="dashboard-grid">
            <article className="phone-frame" aria-label="Investor dashboard">
              <div className="phone-top">
                <img src={content.site.logoUrl} alt={`Logo ${content.site.brandName}`} />
                <span>{content.dashboard.investor.role}</span>
              </div>
              <div className="phone-hero">
                <span>{content.dashboard.investor.totalLabel}</span>
                <strong>{content.dashboard.investor.totalValue}</strong>
                <small>{content.dashboard.investor.project}</small>
              </div>
              <div className="mini-grid">
                {content.dashboard.investor.metrics.map((metric) => (
                  <div key={`${metric.label}-${metric.value}`}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
              <div className="timeline-list">
                {content.dashboard.investor.timeline.map((item) => (
                  <div key={item.label}>
                    <AppIcon name="circle-dot" />
                    {item.label}
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel" id="admin">
              <div className="panel-head">
                <div>
                  <p className="kicker">{content.dashboard.adminPreview.kicker}</p>
                  <h3>{content.dashboard.adminPreview.title}</h3>
                </div>
                <AppIcon name="settings-2" size={22} />
              </div>
              <div className="admin-table" role="table" aria-label="Admin deal table">
                <div role="row">
                  <span role="columnheader">Deal</span>
                  <span role="columnheader">kWp</span>
                  <span role="columnheader">% fill</span>
                  <span role="columnheader">Status</span>
                </div>
                {content.dashboard.adminPreview.rows.map((row) => (
                  <div key={row.deal} role="row">
                    <span>{row.deal}</span>
                    <span>{row.kwp}</span>
                    <span>{row.fill}</span>
                    <span>{row.status}</span>
                  </div>
                ))}
              </div>
              <div className="admin-actions">
                {content.dashboard.adminPreview.actions.map((action) => (
                  <button key={action.label} type="button">
                    <AppIcon name={action.icon} />
                    {action.label}
                  </button>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="lead-section" id="lead">
          <div className="lead-copy">
            <p className="kicker">{content.lead.kicker}</p>
            <h2>{content.lead.title}</h2>
            <p>{content.lead.description}</p>
            <div className="lead-photo">
              <img src={content.lead.illustrationUrl} alt={content.lead.illustrationAlt} />
            </div>
          </div>
          <LeadForm content={content.lead} />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <p className="footer-risk">{content.footer.riskNote}</p>
          <div className="footer-identity">
            <h3>{content.footer.companyName}</h3>
            <p>MST: {content.footer.taxCode}</p>
          </div>
          <div className="footer-contact-row" aria-label="Thông tin doanh nghiệp">
            {content.footer.contacts.map((contact) => {
              const body = (
                <>
                  <AppIcon name={contact.icon} />
                  <span>{contact.value}</span>
                </>
              );

              if (contact.href) {
                const external = /^https?:\/\//.test(contact.href);
                return (
                  <a
                    className="footer-contact-item"
                    href={contact.href}
                    key={`${contact.label}-${contact.value}`}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {body}
                  </a>
                );
              }

              return (
                <div className="footer-contact-item" key={`${contact.label}-${contact.value}`}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </footer>

      <div className="mobile-sticky" aria-label="Hành động nhanh">
        <a href="#deals">
          <AppIcon name="list-filter" />
          Deal
        </a>
        <a href="#lead">
          <AppIcon name="phone-call" />
          Tư vấn
        </a>
      </div>
    </>
  );
}
