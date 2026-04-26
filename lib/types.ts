export type IconName =
  | "phone-call"
  | "shield-check"
  | "file-check-2"
  | "map-pin"
  | "wallet-cards"
  | "lock-keyhole"
  | "layout-dashboard"
  | "radio"
  | "clock-3"
  | "check-circle-2"
  | "file-text"
  | "landmark"
  | "handshake"
  | "clipboard-check"
  | "shield-alert"
  | "file-signature"
  | "calculator"
  | "circle-dot"
  | "settings-2"
  | "plus"
  | "users"
  | "chart-no-axes-combined"
  | "sun"
  | "badge-check"
  | "zap"
  | "arrow-right"
  | "bell"
  | "mail"
  | "building-2"
  | "globe"
  | "headset"
  | "house"
  | "images"
  | "list-filter"
  | "notebook-pen"
  | "send"
  | "wallet"
  | "monitor-smartphone";

export interface NavLink {
  label: string;
  href: string;
}

export interface LinkAction {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TrustItem {
  icon: IconName;
  text: string;
}

export interface StoryCard {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
  featured?: boolean;
}

export interface ProofCard {
  icon: IconName;
  title: string;
  description: string;
}

export interface DealMetric {
  label: string;
  value: string;
}

export interface DealCard {
  title: string;
  capacity: string;
  imageUrl: string;
  alt: string;
  statusLabel: string;
  statusIcon: IconName;
  statusTone: "live" | "default" | "closed";
  featured?: boolean;
  fillLabel: string;
  fillPercent: number;
  fillValue: string;
  metrics: DealMetric[];
  ctaLabel: string;
  ctaHref: string;
  ctaTone: "primary" | "light";
}

export interface PaymentItem {
  month: string;
  status: string;
  amount: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
}

export interface TimelineItem {
  label: string;
}

export interface AdminPreviewRow {
  deal: string;
  kwp: string;
  fill: string;
  status: string;
}

export interface AdminPreviewAction {
  icon: IconName;
  label: string;
}

export interface FooterContact {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
}

export interface SiteContent {
  site: {
    brandName: string;
    logoUrl: string;
    navLinks: NavLink[];
    supportButton: LinkAction;
  };
  seo: {
    title: string;
    description: string;
    ogImageUrl: string;
    ogImageAlt: string;
    themeColor: string;
    canonicalUrl: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    primaryCta: LinkAction;
    secondaryCta: LinkAction;
    heroImageUrl: string;
    metrics: StatItem[];
    riskNote: string;
  };
  trustStrip: TrustItem[];
  visualStory: {
    kicker: string;
    title: string;
    summaryTitle: string;
    summaryText: string;
    cards: StoryCard[];
  };
  trustProof: {
    kicker: string;
    title: string;
    cards: ProofCard[];
  };
  spotlight: {
    badgeText: string;
    deadline: string;
    roiText: string;
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    note: string;
    cta: LinkAction;
  };
  deals: {
    kicker: string;
    title: string;
    summaryTitle: string;
    summaryText: string;
    items: DealCard[];
  };
  dealDetail: {
    kicker: string;
    title: string;
    summaryTitle: string;
    summaryText: string;
    assetImageUrl: string;
    assetImageAlt: string;
    metrics: DealMetric[];
    checklistTitle: string;
    checklist: string[];
    primaryCta: LinkAction;
    secondaryCta: LinkAction;
  };
  finance: {
    kicker: string;
    title: string;
    summaryTitle: string;
    summaryText: string;
    kwpLabel: string;
    roiLabel: string;
    priceLabel: string;
    hint: string;
    defaults: {
      kwp: number;
      roi: number;
      pricePerKwp: number;
    };
    cash: {
      eyebrow: string;
      amountPrefix: string;
      investorShare: string;
      operationsShare: string;
      payoutSchedule: string;
    };
    payments: PaymentItem[];
  };
  dashboard: {
    kicker: string;
    title: string;
    summaryTitle: string;
    summaryText: string;
    investor: {
      role: string;
      totalLabel: string;
      totalValue: string;
      project: string;
      metrics: DashboardMetric[];
      timeline: TimelineItem[];
    };
    adminPreview: {
      kicker: string;
      title: string;
      rows: AdminPreviewRow[];
      actions: AdminPreviewAction[];
    };
  };
  lead: {
    kicker: string;
    title: string;
    description: string;
    illustrationUrl: string;
    illustrationAlt: string;
    nameLabel: string;
    phoneLabel: string;
    roleLabel: string;
    needLabel: string;
    needPlaceholder: string;
    submitLabel: string;
    successMessage: string;
    roles: string[];
  };
  footer: {
    riskNote: string;
    companyName: string;
    taxCode: string;
    contacts: FooterContact[];
  };
}

export interface ConsultRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  role: string;
  need: string;
  status: "new" | "contacted" | "closed";
  source: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
