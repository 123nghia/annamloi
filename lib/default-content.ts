import { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  site: {
    brandName: "An Nam Lợi",
    logoUrl: "/logo.png",
    navLinks: [
      { label: "Deal", href: "#deals" },
      { label: "Tài sản", href: "#asset" },
      { label: "Dòng tiền", href: "#cashflow" },
      { label: "Dashboard", href: "#dashboard" }
    ],
    supportButton: {
      label: "Tư vấn deal",
      href: "#lead"
    }
  },
  seo: {
    title: "An Nam Lợi | Đầu tư điện mặt trời áp mái theo từng deal",
    description:
      "An Nam Lợi kết nối bên thuê điện mặt trời áp mái từ 300kWp với nhà đầu tư cá nhân từ 100kWp. Theo dõi tài sản, hồ sơ pháp lý, nghiệm thu và dòng tiền minh bạch theo từng deal.",
    ogImageUrl: "/image.jpg",
    ogImageAlt: "An Nam Lợi - đầu tư điện mặt trời áp mái theo từng deal",
    themeColor: "#f7faf8",
    canonicalUrl: "https://annamloi.vn/"
  },
  hero: {
    eyebrow: "Deal độc lập | KYC | Hợp đồng | Nghiệm thu",
    title: "Đầu tư điện mặt trời",
    accent: "2%/tháng - Tài sản thật",
    lead:
      "Kết nối bên thuê hệ thống từ 300kWp với nhà đầu tư cá nhân từ 100kWp. Mỗi deal có tài sản, hồ sơ pháp lý, dòng tiền và lịch chi trả riêng.",
    primaryCta: {
      label: "Xem deal còn kWp",
      href: "#deals"
    },
    secondaryCta: {
      label: "Đăng ký KYC nhanh",
      href: "#lead"
    },
    heroImageUrl: "/assets/hero-solar.svg",
    metrics: [
      { value: "247+", label: "Nhà đầu tư" },
      { value: "1,200+ kWp", label: "Đã huy động" },
      { value: "100%", label: "Thanh toán đúng hạn" },
      { value: "2%", label: "Lợi nhuận/tháng" }
    ],
    riskNote:
      "*Mục tiêu lợi nhuận là số liệu dự kiến theo từng hợp đồng, không phải cam kết cố định."
  },
  trustStrip: [
    { icon: "file-check-2", text: "Hồ sơ pháp lý trước khi booking" },
    { icon: "map-pin", text: "Vị trí hệ thống và trạng thái vận hành" },
    { icon: "wallet-cards", text: "Lịch sử thanh toán theo tháng" },
    { icon: "lock-keyhole", text: "OTP, KYC và hợp đồng điện tử" }
  ],
  visualStory: {
    kicker: "Kiểm chứng deal",
    title: "Kiểm tra ảnh tài sản, hồ sơ pháp lý và lịch tiền về trước khi quyết định",
    summaryTitle: "Người dùng thấy gì ở đây?",
    summaryText:
      "3 tín hiệu niềm tin đặt cạnh nhau: ảnh hệ thống, checklist pháp lý và dòng tiền mẫu.",
    cards: [
      {
        tag: "Tài sản thật",
        title: "500kWp trên mái nhà xưởng Bình Dương",
        description:
          "Nắm vị trí, công suất, bên thuê và phần sở hữu của mình trước khi booking.",
        imageUrl: "/assets/story-asset.svg",
        alt: "Hệ thống điện mặt trời áp mái nhà xưởng",
        featured: true
      },
      {
        tag: "Pháp lý",
        title: "Checklist trước tiền",
        description:
          "Hợp đồng thuê, đấu nối, PCCC, bảo hiểm và phụ lục sau nghiệm thu.",
        imageUrl: "/assets/story-legal.svg",
        alt: "Checklist pháp lý và nghiệm thu"
      },
      {
        tag: "Dòng tiền",
        title: "Chi trả theo tháng",
        description:
          "ROI mục tiêu, lịch đối soát và lịch sử thanh toán hiển thị rõ ràng.",
        imageUrl: "/assets/story-cashflow.svg",
        alt: "Mô phỏng dòng tiền theo tháng"
      }
    ]
  },
  trustProof: {
    kicker: "Lý do tạo niềm tin",
    title: "Tại sao nhà đầu tư tin An Nam Lợi trước khi xuống tiền?",
    cards: [
      {
        icon: "file-check-2",
        title: "Hợp đồng theo từng deal",
        description:
          "Mỗi phần sở hữu có hồ sơ pháp lý, hợp đồng đồng tài trợ và mốc nghiệm thu riêng để rà soát trước khi booking."
      },
      {
        icon: "map-pin",
        title: "Tài sản thật, vị trí rõ",
        description:
          "Ảnh hệ thống, công suất, bên thuê và trạng thái vận hành được gắn trực tiếp vào từng deal thay vì mô tả chung chung."
      },
      {
        icon: "layout-dashboard",
        title: "Minh bạch dòng tiền",
        description:
          "Dashboard hiển thị phần kWp sở hữu, lịch chi trả, ROI mục tiêu và payment history theo tháng để theo dõi sau đầu tư."
      },
      {
        icon: "shield-check",
        title: "Checklist trước và sau nghiệm thu",
        description:
          "Từ đấu nối, PCCC, bảo hiểm đến phụ lục nghiệm thu đều có checklist rõ ràng để đội vận hành và nhà đầu tư cùng kiểm chứng."
      }
    ]
  },
  spotlight: {
    badgeText: "Deal Bình Dương đang mở",
    deadline: "2026-05-25",
    roiText: "ROI mục tiêu 1.9%/tháng",
    titlePrefix: "Còn",
    highlight: "120kWp",
    titleSuffix: "để giữ chỗ trong đợt mở hiện tại",
    note:
      "Hồ sơ pháp lý, ảnh tài sản và mô phỏng dòng tiền cho phần sở hữu 100kWp đã sẵn sàng để rà soát ngay.",
    cta: {
      label: "Xem deal đang mở",
      href: "#deal-detail"
    }
  },
  deals: {
    kicker: "Danh sách deal đang mở",
    title: "So sánh deal theo kWp, ROI mục tiêu, phần còn lại và hạn đóng vốn",
    summaryTitle: "Người dùng thấy gì ở đây?",
    summaryText:
      "Danh sách để lướt nhanh và biết ngay deal nào còn chỗ, deal nào sắp mở, deal nào đã vận hành.",
    items: [
      {
        title: "ANL-BD-500 | Nhà xưởng Bình Dương",
        capacity: "500kWp",
        imageUrl: "/assets/deal-open.svg",
        alt: "Nhà xưởng có hệ thống điện mặt trời áp mái",
        statusLabel: "Đang mở",
        statusIcon: "radio",
        statusTone: "live",
        featured: true,
        fillLabel: "Đã fill 76%",
        fillPercent: 76,
        fillValue: "Còn 120kWp",
        metrics: [
          { label: "ROI mục tiêu", value: "1.9%/tháng" },
          { label: "Min booking", value: "100kWp" },
          { label: "Countdown", value: "29 ngày" }
        ],
        ctaLabel: "Còn 120kWp - giữ chỗ 100kWp",
        ctaHref: "#deal-detail",
        ctaTone: "primary"
      },
      {
        title: "ANL-DN-720 | KCN Đồng Nai",
        capacity: "720kWp",
        imageUrl: "/assets/deal-review.svg",
        alt: "Hồ sơ dự án điện mặt trời áp mái đang rà soát",
        statusLabel: "Sắp mở",
        statusIcon: "clock-3",
        statusTone: "default",
        fillLabel: "Đã đăng ký 41%",
        fillPercent: 41,
        fillValue: "Còn 425kWp",
        metrics: [
          { label: "ROI mục tiêu", value: "1.8%/tháng" },
          { label: "Min booking", value: "100kWp" },
          { label: "Hồ sơ", value: "Đang rà soát" }
        ],
        ctaLabel: "Nhận thông báo mở deal",
        ctaHref: "#lead",
        ctaTone: "light"
      },
      {
        title: "ANL-LA-360 | Nhà máy Long An",
        capacity: "360kWp",
        imageUrl: "/assets/deal-operating.svg",
        alt: "Dashboard vận hành hệ thống điện mặt trời",
        statusLabel: "Đã đóng",
        statusIcon: "check-circle-2",
        statusTone: "closed",
        fillLabel: "Đã fill 100%",
        fillPercent: 100,
        fillValue: "Operating",
        metrics: [
          { label: "Chi trả", value: "Hàng tháng" },
          { label: "Nghiệm thu", value: "Đã ký" },
          { label: "Trạng thái", value: "Vận hành" }
        ],
        ctaLabel: "Xem dashboard mẫu",
        ctaHref: "#dashboard",
        ctaTone: "light"
      }
    ]
  },
  dealDetail: {
    kicker: "Chi tiết một deal",
    title: "Đi sâu vào một deal cụ thể: tài sản, vị trí, tỷ lệ sở hữu và hồ sơ trước khi giữ chỗ",
    summaryTitle: "Người dùng thấy gì ở đây?",
    summaryText:
      "Một deal duy nhất với ảnh tài sản, chỉ số sở hữu và checklist pháp lý ngay cạnh CTA.",
    assetImageUrl: "/assets/detail-asset.svg",
    assetImageAlt: "Ảnh dự án điện mặt trời áp mái nhà xưởng",
    metrics: [
      { label: "Phần sở hữu", value: "100kWp" },
      { label: "Tỷ lệ deal", value: "20.00%" },
      { label: "Vị trí", value: "Bình Dương" },
      { label: "Trạng thái", value: "Funding" }
    ],
    checklistTitle: "Checklist pháp lý trước booking",
    checklist: [
      "Hợp đồng thuê điện với bên thuê ≥300kWp",
      "Hồ sơ pháp nhân, quyền sử dụng mái, đấu nối, PCCC",
      "Hợp đồng đồng tài trợ theo từng deal độc lập",
      "Biên bản nghiệm thu và phụ lục sau nghiệm thu",
      "Rủi ro sản lượng, thanh toán và O&M được nêu riêng"
    ],
    primaryCta: {
      label: "Nhận hồ sơ pháp lý",
      href: "#lead"
    },
    secondaryCta: {
      label: "Xem dòng tiền 100kWp",
      href: "#cashflow"
    }
  },
  finance: {
    kicker: "Mô phỏng dòng tiền",
    title: "Ước tính số vốn, lợi nhuận tháng và lịch chi trả cho phần kWp muốn booking",
    summaryTitle: "Người dùng thấy gì ở đây?",
    summaryText:
      "Phần này trả lời rất thẳng: đầu tư bao nhiêu tiền, lợi nhuận tháng ra sao và nhận tiền khi nào.",
    kwpLabel: "Số kWp muốn booking",
    roiLabel: "ROI mục tiêu/tháng",
    priceLabel: "Suất đầu tư tham chiếu/kWp",
    hint: "Số liệu demo cho UX. Giá/kWp, sản lượng và chi phí thật lấy từ hợp đồng và nghiệm thu.",
    defaults: {
      kwp: 100,
      roi: 1.9,
      pricePerKwp: 12800000
    },
    cash: {
      eyebrow: "Dự kiến cho NĐT",
      amountPrefix: "Vốn dự kiến",
      investorShare: "80%",
      operationsShare: "20%",
      payoutSchedule: "Ngày 10 hàng tháng"
    },
    payments: [
      { month: "04/2026", status: "Đã chi trả", amount: "24.320.000" },
      { month: "05/2026", status: "Đang đối soát", amount: "--" },
      { month: "06/2026", status: "Dự kiến", amount: "24.320.000" }
    ]
  },
  dashboard: {
    kicker: "Dashboard sau booking",
    title: "Theo dõi phần sở hữu, trạng thái vận hành, hợp đồng và dòng tiền sau khi tham gia",
    summaryTitle: "Người dùng thấy gì ở đây?",
    summaryText:
      "Màn dành cho nhà đầu tư đã vào deal: xem tài sản đang chạy thế nào và tiền đã về chưa.",
    investor: {
      role: "Investor",
      totalLabel: "Tổng sở hữu",
      totalValue: "100kWp",
      project: "ANL-BD-500 | Bình Dương",
      metrics: [
        { label: "Tháng này", value: "24,3tr" },
        { label: "ROI", value: "1.9%" },
        { label: "Trạng thái", value: "Operating" },
        { label: "Hợp đồng", value: "Đã ký" }
      ],
      timeline: [
        { label: "Funding" },
        { label: "Closed" },
        { label: "Nghiệm thu" },
        { label: "Chi trả tháng" }
      ]
    },
    adminPreview: {
      kicker: "Admin",
      title: "Tạo deal → mở deal → đóng vốn → nghiệm thu → kích hoạt chi trả",
      rows: [
        { deal: "ANL-BD-500", kwp: "500", fill: "76%", status: "Funding" },
        { deal: "ANL-LA-360", kwp: "360", fill: "100%", status: "Operating" },
        { deal: "ANL-DN-720", kwp: "720", fill: "41%", status: "Draft" }
      ],
      actions: [
        { icon: "plus", label: "Tạo deal" },
        { icon: "users", label: "Xem NĐT" },
        { icon: "chart-no-axes-combined", label: "Báo cáo" }
      ]
    }
  },
  lead: {
    kicker: "Đăng ký quan tâm",
    title: "Nhận deal phù hợp, hướng dẫn KYC và bộ hồ sơ đúng với mức kWp bạn muốn sở hữu",
    description:
      "Đây là nơi để lại nhu cầu. Đội vận hành sẽ gọi lại, xác nhận vai trò và gửi đúng hồ sơ deal liên quan.",
    illustrationUrl: "/assets/lead-consult.svg",
    illustrationAlt: "Minh họa form tư vấn đầu tư điện mặt trời",
    nameLabel: "Họ và tên",
    phoneLabel: "Số điện thoại/Zalo",
    roleLabel: "Vai trò",
    needLabel: "Nhu cầu",
    needPlaceholder: "Ví dụ: muốn booking 100kWp deal Bình Dương, cần xem hợp đồng và lịch chi trả.",
    submitLabel: "Gửi yêu cầu tư vấn",
    successMessage: "Đã lưu yêu cầu tư vấn. Đội vận hành sẽ liên hệ lại sớm.",
    roles: ["Nhà đầu tư cá nhân", "Môi giới / đối tác", "Bên thuê hệ thống", "Đội vận hành nội bộ"]
  },
  footer: {
    riskNote:
      "Thông tin trên trang phục vụ giới thiệu mô hình và nhận diện pháp nhân doanh nghiệp. Nhà đầu tư cần đọc hợp đồng, hồ sơ pháp lý, điều khoản rủi ro và tư vấn chuyên môn trước khi tham gia.",
    companyName: "CÔNG TY TNHH AN NAM LỢI",
    taxCode: "4401113424",
    contacts: [
      {
        icon: "building-2",
        label: "Địa chỉ pháp nhân",
        value: "Khu phố Lộc Đông, Phường Phú Yên, Tỉnh Đắk Lắk",
        href: "https://maps.google.com/?q=Khu+pho+Loc+Dong+Phuong+Phu+Yen+Tinh+Dak+Lak"
      },
      {
        icon: "globe",
        label: "Website",
        value: "annamloi.vn",
        href: "https://annamloi.vn/"
      },
      {
        icon: "mail",
        label: "Email",
        value: "contact@annamloi.vn",
        href: "mailto:contact@annamloi.vn"
      },
      {
        icon: "headset",
        label: "Hỗ trợ",
        value: "Tư vấn deal",
        href: "#lead"
      }
    ]
  }
};
