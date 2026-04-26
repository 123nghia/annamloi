import { iconOptions } from "@/lib/icon-map";

export type FieldSchema =
  | {
      key: string;
      label: string;
      type: "text" | "textarea" | "url" | "number" | "date";
      placeholder?: string;
      description?: string;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: { label: string; value: string }[];
      description?: string;
    }
  | {
      key: string;
      label: string;
      type: "image";
      folder: string;
      description?: string;
    }
  | {
      key: string;
      label: string;
      type: "group";
      description?: string;
      fields: FieldSchema[];
    }
  | {
      key: string;
      label: string;
      type: "array";
      description?: string;
      itemLabel: string;
      of: "text" | "group";
      fields?: FieldSchema[];
      defaultItem: unknown;
    };

export interface ContentSectionSchema {
  id: string;
  title: string;
  description: string;
  fields: FieldSchema[];
}

const statusToneOptions = [
  { label: "Đang mở", value: "live" },
  { label: "Trung tính", value: "default" },
  { label: "Đã đóng", value: "closed" }
];

const buttonToneOptions = [
  { label: "Primary", value: "primary" },
  { label: "Light", value: "light" }
];

export const contentSchema: ContentSectionSchema[] = [
  {
    id: "seo",
    title: "SEO & Chia sẻ",
    description: "Tiêu đề, mô tả và ảnh preview cho Google, Facebook, Zalo.",
    fields: [
      { key: "seo.title", label: "SEO title", type: "text" },
      { key: "seo.description", label: "SEO description", type: "textarea" },
      { key: "seo.canonicalUrl", label: "Canonical URL", type: "url" },
      { key: "seo.themeColor", label: "Theme color", type: "text" },
      { key: "seo.ogImageUrl", label: "Ảnh share", type: "image", folder: "seo" },
      { key: "seo.ogImageAlt", label: "Alt ảnh share", type: "text" }
    ]
  },
  {
    id: "site",
    title: "Thuong hieu",
    description: "Ten thuong hieu va logo hien thi tren header.",
    fields: [
      { key: "site.brandName", label: "Ten thuong hieu", type: "text" },
      { key: "site.logoUrl", label: "Logo", type: "image", folder: "brand" }
    ]
  },
  {
    id: "site-nav",
    title: "Menu header",
    description: "Chinh cac muc menu tren thanh dau trang, thu tu hien thi va nut tu van ben phai.",
    fields: [
      {
        key: "site.navLinks",
        label: "Menu dieu huong",
        type: "array",
        itemLabel: "Muc menu",
        of: "group",
        defaultItem: { label: "Menu", href: "#top" },
        fields: [
          { key: "label", label: "Ten menu", type: "text" },
          { key: "href", label: "Link den section", type: "text" }
        ]
      },
      {
        key: "site.supportButton",
        label: "Nut tu van",
        type: "group",
        description: "Nut o goc phai header.",
        fields: [
          { key: "label", label: "Ten nut", type: "text" },
          { key: "href", label: "Link", type: "text" }
        ]
      }
    ]
  },
  {
    id: "hero",
    title: "Hero",
    description: "Khối mở đầu, CTA và các chỉ số niềm tin.",
    fields: [
      { key: "hero.eyebrow", label: "Dòng badge", type: "text" },
      { key: "hero.title", label: "Tiêu đề dòng 1", type: "text" },
      { key: "hero.accent", label: "Tiêu đề accent", type: "text" },
      { key: "hero.lead", label: "Mô tả", type: "textarea" },
      { key: "hero.heroImageUrl", label: "Ảnh hero", type: "image", folder: "hero" },
      {
        key: "hero.primaryCta",
        label: "CTA chính",
        type: "group",
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      },
      {
        key: "hero.secondaryCta",
        label: "CTA phụ",
        type: "group",
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      },
      {
        key: "hero.metrics",
        label: "Chỉ số hero",
        type: "array",
        itemLabel: "Chỉ số",
        of: "group",
        defaultItem: { value: "0", label: "Chỉ số" },
        fields: [
          { key: "value", label: "Giá trị", type: "text" },
          { key: "label", label: "Nhãn", type: "text" }
        ]
      },
      { key: "hero.riskNote", label: "Ghi chú rủi ro", type: "textarea" }
    ]
  },
  {
    id: "trust-strip",
    title: "Trust strip",
    description: "4 dòng niềm tin nằm ngay dưới hero.",
    fields: [
      {
        key: "trustStrip",
        label: "Các mục trust",
        type: "array",
        itemLabel: "Trust item",
        of: "group",
        defaultItem: { icon: "shield-check", text: "Nội dung trust" },
        fields: [
          { key: "icon", label: "Icon", type: "select", options: iconOptions },
          { key: "text", label: "Nội dung", type: "text" }
        ]
      }
    ]
  },
  {
    id: "visual-story",
    title: "Kiểm chứng deal",
    description: "Section kể chuyện bằng ảnh tài sản, pháp lý và dòng tiền.",
    fields: [
      { key: "visualStory.kicker", label: "Kicker", type: "text" },
      { key: "visualStory.title", label: "Tiêu đề", type: "textarea" },
      { key: "visualStory.summaryTitle", label: "Tiêu đề tóm tắt", type: "text" },
      { key: "visualStory.summaryText", label: "Nội dung tóm tắt", type: "textarea" },
      {
        key: "visualStory.cards",
        label: "Story cards",
        type: "array",
        itemLabel: "Story card",
        of: "group",
        defaultItem: {
          tag: "Tag",
          title: "Tiêu đề",
          description: "Mô tả",
          imageUrl: "/assets/story-asset.svg",
          alt: "Ảnh story"
        },
        fields: [
          { key: "tag", label: "Tag", type: "text" },
          { key: "title", label: "Tiêu đề", type: "text" },
          { key: "description", label: "Mô tả", type: "textarea" },
          { key: "imageUrl", label: "Ảnh", type: "image", folder: "story" },
          { key: "alt", label: "Alt ảnh", type: "text" }
        ]
      }
    ]
  },
  {
    id: "trust-proof",
    title: "Lý do tạo niềm tin",
    description: "4 thẻ giải thích vì sao mô hình đáng tin.",
    fields: [
      { key: "trustProof.kicker", label: "Kicker", type: "text" },
      { key: "trustProof.title", label: "Tiêu đề", type: "textarea" },
      {
        key: "trustProof.cards",
        label: "Trust proof cards",
        type: "array",
        itemLabel: "Proof card",
        of: "group",
        defaultItem: {
          icon: "shield-check",
          title: "Tiêu đề",
          description: "Mô tả"
        },
        fields: [
          { key: "icon", label: "Icon", type: "select", options: iconOptions },
          { key: "title", label: "Tiêu đề", type: "text" },
          { key: "description", label: "Mô tả", type: "textarea" }
        ]
      }
    ]
  },
  {
    id: "spotlight",
    title: "Deal spotlight",
    description: "Band nổi bật dùng để chốt hành động vào deal đang mở.",
    fields: [
      { key: "spotlight.badgeText", label: "Badge text", type: "text" },
      { key: "spotlight.deadline", label: "Ngày đóng booking", type: "date" },
      { key: "spotlight.roiText", label: "Dòng ROI", type: "text" },
      { key: "spotlight.titlePrefix", label: "Tiêu đề trước highlight", type: "text" },
      { key: "spotlight.highlight", label: "Highlight", type: "text" },
      { key: "spotlight.titleSuffix", label: "Tiêu đề sau highlight", type: "text" },
      { key: "spotlight.note", label: "Ghi chú", type: "textarea" },
      {
        key: "spotlight.cta",
        label: "CTA spotlight",
        type: "group",
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      }
    ]
  },
  {
    id: "deals",
    title: "Danh sách deal",
    description: "Quản lý toàn bộ card deal hiển thị ở section chính.",
    fields: [
      { key: "deals.kicker", label: "Kicker", type: "text" },
      { key: "deals.title", label: "Tiêu đề", type: "textarea" },
      { key: "deals.summaryTitle", label: "Tiêu đề tóm tắt", type: "text" },
      { key: "deals.summaryText", label: "Nội dung tóm tắt", type: "textarea" },
      {
        key: "deals.items",
        label: "Deal items",
        type: "array",
        itemLabel: "Deal",
        of: "group",
        defaultItem: {
          title: "Tên deal",
          capacity: "500kWp",
          imageUrl: "/assets/deal-open.svg",
          alt: "Ảnh deal",
          statusLabel: "Đang mở",
          statusIcon: "radio",
          statusTone: "live",
          fillLabel: "Đã fill 0%",
          fillPercent: 0,
          fillValue: "Còn 0kWp",
          metrics: [
            { label: "ROI mục tiêu", value: "1.9%/tháng" },
            { label: "Min booking", value: "100kWp" },
            { label: "Countdown", value: "30 ngày" }
          ],
          ctaLabel: "Xem deal",
          ctaHref: "#deal-detail",
          ctaTone: "primary"
        },
        fields: [
          { key: "title", label: "Tên deal", type: "text" },
          { key: "capacity", label: "Công suất", type: "text" },
          { key: "imageUrl", label: "Ảnh deal", type: "image", folder: "deals" },
          { key: "alt", label: "Alt ảnh", type: "text" },
          { key: "statusLabel", label: "Trạng thái", type: "text" },
          { key: "statusIcon", label: "Icon trạng thái", type: "select", options: iconOptions },
          { key: "statusTone", label: "Màu trạng thái", type: "select", options: statusToneOptions },
          { key: "fillLabel", label: "Nhãn progress", type: "text" },
          { key: "fillPercent", label: "% progress", type: "number" },
          { key: "fillValue", label: "Giá trị progress", type: "text" },
          {
            key: "metrics",
            label: "Metric nhỏ",
            type: "array",
            itemLabel: "Metric",
            of: "group",
            defaultItem: { label: "Nhãn", value: "Giá trị" },
            fields: [
              { key: "label", label: "Nhãn", type: "text" },
              { key: "value", label: "Giá trị", type: "text" }
            ]
          },
          { key: "ctaLabel", label: "CTA label", type: "text" },
          { key: "ctaHref", label: "CTA href", type: "text" },
          { key: "ctaTone", label: "CTA tone", type: "select", options: buttonToneOptions }
        ]
      }
    ]
  },
  {
    id: "deal-detail",
    title: "Chi tiết deal",
    description: "Ảnh tài sản, metric và checklist pháp lý.",
    fields: [
      { key: "dealDetail.kicker", label: "Kicker", type: "text" },
      { key: "dealDetail.title", label: "Tiêu đề", type: "textarea" },
      { key: "dealDetail.summaryTitle", label: "Tiêu đề tóm tắt", type: "text" },
      { key: "dealDetail.summaryText", label: "Tóm tắt", type: "textarea" },
      { key: "dealDetail.assetImageUrl", label: "Ảnh tài sản", type: "image", folder: "detail" },
      { key: "dealDetail.assetImageAlt", label: "Alt ảnh tài sản", type: "text" },
      {
        key: "dealDetail.metrics",
        label: "Metrics chi tiết deal",
        type: "array",
        itemLabel: "Metric",
        of: "group",
        defaultItem: { label: "Nhãn", value: "Giá trị" },
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "value", label: "Giá trị", type: "text" }
        ]
      },
      { key: "dealDetail.checklistTitle", label: "Tiêu đề checklist", type: "text" },
      {
        key: "dealDetail.checklist",
        label: "Checklist",
        type: "array",
        itemLabel: "Checklist item",
        of: "text",
        defaultItem: "Nội dung checklist"
      },
      {
        key: "dealDetail.primaryCta",
        label: "CTA hồ sơ",
        type: "group",
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      },
      {
        key: "dealDetail.secondaryCta",
        label: "CTA dòng tiền",
        type: "group",
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      }
    ]
  },
  {
    id: "finance",
    title: "Mô phỏng dòng tiền",
    description: "Mặc định của calculator và cụm số liệu dòng tiền.",
    fields: [
      { key: "finance.kicker", label: "Kicker", type: "text" },
      { key: "finance.title", label: "Tiêu đề", type: "textarea" },
      { key: "finance.summaryTitle", label: "Tiêu đề tóm tắt", type: "text" },
      { key: "finance.summaryText", label: "Tóm tắt", type: "textarea" },
      { key: "finance.kwpLabel", label: "Label kWp", type: "text" },
      { key: "finance.roiLabel", label: "Label ROI", type: "text" },
      { key: "finance.priceLabel", label: "Label giá/kWp", type: "text" },
      { key: "finance.hint", label: "Hint", type: "textarea" },
      { key: "finance.defaults.kwp", label: "kWp mặc định", type: "number" },
      { key: "finance.defaults.roi", label: "ROI mặc định", type: "number" },
      { key: "finance.defaults.pricePerKwp", label: "Giá/kWp mặc định", type: "number" },
      { key: "finance.cash.eyebrow", label: "Eyebrow cash card", type: "text" },
      { key: "finance.cash.amountPrefix", label: "Nhãn tổng vốn", type: "text" },
      { key: "finance.cash.investorShare", label: "Tỷ lệ NĐT", type: "text" },
      { key: "finance.cash.operationsShare", label: "Tỷ lệ O&M", type: "text" },
      { key: "finance.cash.payoutSchedule", label: "Lịch chi trả", type: "text" },
      {
        key: "finance.payments",
        label: "Danh sách thanh toán",
        type: "array",
        itemLabel: "Payment row",
        of: "group",
        defaultItem: { month: "04/2026", status: "Đã chi trả", amount: "0" },
        fields: [
          { key: "month", label: "Tháng", type: "text" },
          { key: "status", label: "Trạng thái", type: "text" },
          { key: "amount", label: "Số tiền", type: "text" }
        ]
      }
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard sau booking",
    description: "Màn investor và preview admin vận hành.",
    fields: [
      { key: "dashboard.kicker", label: "Kicker", type: "text" },
      { key: "dashboard.title", label: "Tiêu đề", type: "textarea" },
      { key: "dashboard.summaryTitle", label: "Tiêu đề tóm tắt", type: "text" },
      { key: "dashboard.summaryText", label: "Tóm tắt", type: "textarea" },
      { key: "dashboard.investor.role", label: "Vai trò investor", type: "text" },
      { key: "dashboard.investor.totalLabel", label: "Nhãn tổng sở hữu", type: "text" },
      { key: "dashboard.investor.totalValue", label: "Giá trị tổng sở hữu", type: "text" },
      { key: "dashboard.investor.project", label: "Tên project", type: "text" },
      {
        key: "dashboard.investor.metrics",
        label: "Metrics investor",
        type: "array",
        itemLabel: "Metric",
        of: "group",
        defaultItem: { label: "Nhãn", value: "Giá trị" },
        fields: [
          { key: "label", label: "Nhãn", type: "text" },
          { key: "value", label: "Giá trị", type: "text" }
        ]
      },
      {
        key: "dashboard.investor.timeline",
        label: "Timeline investor",
        type: "array",
        itemLabel: "Mốc timeline",
        of: "group",
        defaultItem: { label: "Funding" },
        fields: [{ key: "label", label: "Nhãn", type: "text" }]
      },
      { key: "dashboard.adminPreview.kicker", label: "Kicker admin preview", type: "text" },
      { key: "dashboard.adminPreview.title", label: "Tiêu đề admin preview", type: "textarea" },
      {
        key: "dashboard.adminPreview.rows",
        label: "Dòng bảng admin",
        type: "array",
        itemLabel: "Row",
        of: "group",
        defaultItem: { deal: "ANL-BD-500", kwp: "500", fill: "76%", status: "Funding" },
        fields: [
          { key: "deal", label: "Deal", type: "text" },
          { key: "kwp", label: "kWp", type: "text" },
          { key: "fill", label: "% fill", type: "text" },
          { key: "status", label: "Status", type: "text" }
        ]
      },
      {
        key: "dashboard.adminPreview.actions",
        label: "Nút admin preview",
        type: "array",
        itemLabel: "Action",
        of: "group",
        defaultItem: { icon: "plus", label: "Tạo deal" },
        fields: [
          { key: "icon", label: "Icon", type: "select", options: iconOptions },
          { key: "label", label: "Nhãn", type: "text" }
        ]
      }
    ]
  },
  {
    id: "lead",
    title: "Form tư vấn",
    description: "Copy, placeholder và lựa chọn vai trò.",
    fields: [
      { key: "lead.kicker", label: "Kicker", type: "text" },
      { key: "lead.title", label: "Tiêu đề", type: "textarea" },
      { key: "lead.description", label: "Mô tả", type: "textarea" },
      { key: "lead.illustrationUrl", label: "Ảnh minh họa", type: "image", folder: "lead" },
      { key: "lead.illustrationAlt", label: "Alt ảnh minh họa", type: "text" },
      { key: "lead.nameLabel", label: "Label họ tên", type: "text" },
      { key: "lead.phoneLabel", label: "Label điện thoại", type: "text" },
      { key: "lead.roleLabel", label: "Label vai trò", type: "text" },
      { key: "lead.needLabel", label: "Label nhu cầu", type: "text" },
      { key: "lead.needPlaceholder", label: "Placeholder nhu cầu", type: "textarea" },
      { key: "lead.submitLabel", label: "Nhãn nút gửi", type: "text" },
      { key: "lead.successMessage", label: "Thông báo thành công", type: "text" },
      {
        key: "lead.roles",
        label: "Vai trò",
        type: "array",
        itemLabel: "Vai trò",
        of: "text",
        defaultItem: "Nhà đầu tư cá nhân"
      }
    ]
  },
  {
    id: "footer",
    title: "Footer",
    description: "Thông tin pháp nhân và contact cuối trang.",
    fields: [
      { key: "footer.riskNote", label: "Ghi chú pháp lý", type: "textarea" },
      { key: "footer.companyName", label: "Tên công ty", type: "text" },
      { key: "footer.taxCode", label: "Mã số thuế", type: "text" },
      {
        key: "footer.contacts",
        label: "Contact footer",
        type: "array",
        itemLabel: "Contact item",
        of: "group",
        defaultItem: {
          icon: "mail",
          label: "Email",
          value: "contact@annamloi.vn",
          href: "mailto:contact@annamloi.vn"
        },
        fields: [
          { key: "icon", label: "Icon", type: "select", options: iconOptions },
          { key: "label", label: "Nhãn", type: "text" },
          { key: "value", label: "Giá trị", type: "text" },
          { key: "href", label: "Liên kết", type: "text" }
        ]
      }
    ]
  }
];
