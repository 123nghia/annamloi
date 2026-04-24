import { absoluteUrl, escapeAttr, escapeHtml, parseJson, slugify } from "./utils.js";

function layout({ settings, title, description, body, structuredData = "" }) {
  const siteUrl = settings.site_url || "";
  const pageTitle = title || settings.seo_title || settings.site_name;
  const pageDescription = description || settings.seo_description || "";
  const ogImage = absoluteUrl(settings.og_image || settings.hero_image || "/image.jpg", siteUrl);

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(pageDescription)}">
  <meta name="keywords" content="${escapeAttr(settings.seo_keywords || "")}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeAttr(siteUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(pageDescription)}">
  <meta property="og:image" content="${escapeAttr(ogImage)}">
  <meta property="og:url" content="${escapeAttr(siteUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
  <meta name="twitter:description" content="${escapeAttr(pageDescription)}">
  <meta name="twitter:image" content="${escapeAttr(ogImage)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  ${structuredData}
</head>
<body id="top">
${body}
<script src="/site.js" defer></script>
</body>
</html>`;
}

function header(settings) {
  return `<header class="site-header">
  <nav class="nav" aria-label="Điều hướng chính">
    <a class="brand-logo-wrap" href="#top" aria-label="${escapeAttr(settings.site_name)}">
      <img class="brand-logo" src="${escapeAttr(settings.logo_url || "/logo.png")}" alt="${escapeAttr(settings.company_name || settings.site_name)}">
    </a>
    <ul class="nav-links">
      <li><a href="#journeys">Nhu cầu</a></li>
      <li><a href="#trust">Pháp lý</a></li>
      <li><a href="#projects">Deal</a></li>
      <li><a href="#risk">Rủi ro</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <a class="nav-cta" href="tel:${escapeAttr(settings.phone_href || "")}">Gọi/Zalo tư vấn</a>
  </nav>
</header>`;
}

function hero(settings) {
  return `<section class="hero">
  <div class="hero-inner">
    <div class="hero-content">
      <div class="eyebrow">${escapeHtml(settings.hero_eyebrow)}</div>
      <h1>${escapeHtml(settings.hero_title)}</h1>
      <p class="hero-copy">${escapeHtml(settings.hero_copy)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="#projects">Xem dự án đang mở</a>
        <a class="button button-green" href="#cta" data-lead-role="Chủ nhà xưởng muốn thuê điện">Đăng ký khảo sát</a>
        <a class="button button-ghost" href="tel:${escapeAttr(settings.phone_href || "")}">Gọi/Zalo tư vấn</a>
      </div>
      <div class="quick-stats">
        <div class="stat"><span class="stat-value">Không cần bỏ vốn</span><span class="stat-label">Nhà xưởng thuê điện mặt trời</span></div>
        <div class="stat"><span class="stat-value">Theo deal</span><span class="stat-label">Không gộp chéo dòng tiền</span></div>
        <div class="stat"><span class="stat-value">Hồ sơ rõ</span><span class="stat-label">Kiểm tra hợp đồng trước khi tham gia</span></div>
      </div>
    </div>
    <div class="hero-visual">
      <img src="${escapeAttr(settings.hero_image || "/image.jpg")}" alt="Hệ thống điện mặt trời mái nhà xưởng">
    </div>
  </div>
</section>`;
}

function sectionHead(block) {
  return `<div class="section-head">
    <div>
      <div class="section-kicker">${escapeHtml(block.kicker || "")}</div>
      <h2>${escapeHtml(block.title || "")}</h2>
    </div>
    ${block.description ? `<p class="section-desc">${escapeHtml(block.description)}</p>` : ""}
  </div>`;
}

function journeys(block) {
  const items = parseJson(block.content_json, []);
  const buttons = ["button-primary", "button-green", "button-light"];
  return `<section class="section" id="journeys">
  <div class="wrap">
    ${sectionHead(block)}
    <div class="journey-grid">
      ${items.map((item, index) => `<article class="card">
        <div class="icon-box" aria-hidden="true">${index + 1}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <ul class="mini-list">${(item.items || []).map((line) => `<li><span class="check">✓</span>${escapeHtml(line)}</li>`).join("")}</ul>
        <a class="button ${buttons[index] || "button-light"}" href="${index === 1 ? "#projects" : "#cta"}" data-lead-role="${escapeAttr(item.role || "")}">${escapeHtml(item.cta || "Liên hệ")}</a>
      </article>`).join("")}
    </div>
  </div>
</section>`;
}

function trust(settings) {
  return `<section class="section alt" id="trust">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="section-kicker">Thông tin tin cậy</div>
        <h2>Thông tin pháp nhân và hồ sơ cần kiểm tra trước khi chốt deal</h2>
      </div>
      <p class="section-desc">Các trường dưới đây có thể chỉnh trong admin trước khi đưa trang vào vận hành.</p>
    </div>
    <div class="trust-grid">
      <article class="card trust-card">
        <h3>Pháp nhân</h3>
        <dl class="data-list">
          <div><dt>Tên công ty</dt><dd>${escapeHtml(settings.company_name)}</dd></div>
          <div><dt>Mã số thuế</dt><dd>${escapeHtml(settings.tax_code)}</dd></div>
          <div><dt>Địa chỉ</dt><dd>${escapeHtml(settings.address)}</dd></div>
          <div><dt>Email</dt><dd>${escapeHtml(settings.email)}</dd></div>
        </dl>
      </article>
      <article class="card trust-card">
        <h3>Điều khoản cần rõ</h3>
        <dl class="data-list">
          <div><dt>Giá thuê</dt><dd>Ghi theo từng hợp đồng</dd></div>
          <div><dt>Thời hạn</dt><dd>10 năm hoặc theo deal</dd></div>
          <div><dt>Tăng giá</dt><dd>Thường theo %/năm</dd></div>
          <div><dt>O&M</dt><dd>Nêu rõ đơn vị vận hành</dd></div>
        </dl>
      </article>
      <article class="card trust-card">
        <h3>Checklist hồ sơ pháp lý</h3>
        <ul class="doc-list">
          <li><span class="check">✓</span>Hợp đồng thuê điện với nhà xưởng</li>
          <li><span class="check">✓</span>Quyền sử dụng mái và hiện trạng công trình</li>
          <li><span class="check">✓</span>Khảo sát kỹ thuật, kết cấu mái, đấu nối</li>
          <li><span class="check">✓</span>PCCC, an toàn điện, bảo hiểm và bảo trì</li>
          <li><span class="check">✓</span>Phụ lục chia doanh thu nếu có</li>
        </ul>
      </article>
    </div>
  </div>
</section>`;
}

function projectStatus(project) {
  const isClosed = project.status === "closed";
  return `<div class="status ${isClosed ? "closed" : ""}"><span class="status-icon ${isClosed ? "closed" : "open"}" aria-hidden="true"></span>${isClosed ? "Đã chốt" : "Còn mở"}</div>`;
}

function projectsSection(projects) {
  return `<section class="section" id="projects">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="section-kicker">Danh sách nhà máy thuê điện</div>
        <h2>Dự án đang mở và deal đã chốt</h2>
      </div>
      <p class="section-desc">Thông tin hiển thị được quản lý trong admin. Khi có khách hàng thật, cập nhật tên nhà máy, ảnh thực tế, hợp đồng thuê điện và hồ sơ xác minh.</p>
    </div>
    <div class="deal-toolbar">
      <div class="segmented" role="tablist" aria-label="Lọc trạng thái deal">
        <button class="is-active" type="button" data-filter="all">Tất cả</button>
        <button type="button" data-filter="open">Còn mở</button>
        <button type="button" data-filter="closed">Đã chốt</button>
      </div>
      <a class="button button-light button-small" href="#cta" data-lead-role="Nhà đầu tư cá nhân">Nhận chi tiết dự án</a>
    </div>
    <div class="deal-grid">
      ${projects.map((project) => projectCard(project)).join("")}
    </div>
  </div>
</section>`;
}

function projectCard(project) {
  const gallery = parseJson(project.gallery_json, []).slice(0, 3);
  return `<article class="deal-card" data-status="${escapeAttr(project.status)}">
  <div class="deal-media">
    <img src="${escapeAttr(project.image_url)}" alt="${escapeAttr(project.name)}">
    ${projectStatus(project)}
    <div class="deal-progress">
      <div class="progress-meta"><span>${project.status === "closed" ? "Deal đã đóng" : "Deal đang nhận"}</span><span>${Number(project.progress || 0)}%</span></div>
      <div class="bar"><span style="width: ${Math.max(0, Math.min(100, Number(project.progress || 0)))}%"></span></div>
    </div>
  </div>
  <div class="deal-gallery" aria-label="Ảnh dự án ${escapeAttr(project.name)}">
    ${(gallery.length ? gallery : [project.image_url, project.image_url, project.image_url]).map((src) => `<img src="${escapeAttr(src)}" alt="${escapeAttr(project.name)}">`).join("")}
  </div>
  <div class="deal-body">
    <h3>${escapeHtml(project.name)}</h3>
    <div class="location">${escapeHtml(project.location)} | ${escapeHtml(project.capacity)} | ${escapeHtml(project.summary)}</div>
    <div class="spec-grid">
      <div class="spec"><span class="spec-label">Nhà máy</span><span class="spec-value">${escapeHtml(project.factory_type)}</span></div>
      <div class="spec"><span class="spec-label">Thời gian thuê</span><span class="spec-value">${escapeHtml(project.lease_term)}</span></div>
      <div class="spec"><span class="spec-label">Giá thuê</span><span class="spec-value">${escapeHtml(project.price)}</span></div>
      <div class="spec"><span class="spec-label">Tăng hằng năm</span><span class="spec-value">${escapeHtml(project.annual_increase)}</span></div>
    </div>
    <p class="deal-note">${escapeHtml(project.note)}</p>
  </div>
  <div class="deal-foot">
    <div class="slot"><strong>${project.status === "closed" ? "Đã chốt" : "Còn mở"}</strong>${project.status === "closed" ? "đóng deal" : "nhận đăng ký"}</div>
    <button class="button ${project.status === "closed" ? "button-light" : "button-primary"} button-small" type="button" data-detail-button>Xem chi tiết</button>
  </div>
</article>`;
}

function risk(block) {
  const items = parseJson(block.content_json, []);
  return `<section class="section alt" id="risk">
  <div class="wrap">
    <div class="risk-band">
      <div>
        <div class="section-kicker">${escapeHtml(block.kicker)}</div>
        <h2>${escapeHtml(block.title)}</h2>
        <p>${escapeHtml(block.description)}</p>
        <a class="button button-green" href="#cta" data-lead-role="Nhà đầu tư cá nhân">Tôi muốn đầu tư</a>
      </div>
      <ul class="risk-list">${items.map((line) => `<li><span class="check">!</span>${escapeHtml(line)}</li>`).join("")}</ul>
    </div>
  </div>
</section>`;
}

function calculator() {
  return `<section class="section" id="calculator">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="section-kicker">Ước tính minh họa</div>
        <h2>Tính thử doanh thu điện theo sản lượng và giá thuê</h2>
      </div>
      <p class="section-desc">Công cụ chỉ để minh họa. Số liệu thật cần lấy từ khảo sát, hợp đồng thuê điện và lịch vận hành nhà máy.</p>
    </div>
    <div class="calculator">
      <div class="calc-panel">
        <h3>Thông số deal</h3>
        <div class="field"><label for="capacity">Công suất hệ thống</label><div class="range-row"><input id="capacity" type="range" min="300" max="1200" value="500" step="50"><div class="range-value"><span id="capacityValue">500</span> kWp</div></div></div>
        <div class="field"><label for="yield">Sản lượng ước tính mỗi kWp/tháng</label><select id="yield"><option value="110">110 kWh - thận trọng</option><option value="120" selected>120 kWh - tiêu chuẩn</option><option value="135">135 kWh - tốt</option></select></div>
        <div class="field"><label for="price">Giá thuê điện chưa VAT</label><input id="price" type="number" min="1000" max="3000" value="1780" step="10"></div>
        <div class="field"><label for="share">Tỷ lệ doanh thu cho nhà đầu tư</label><div class="range-row"><input id="share" type="range" min="70" max="90" value="80" step="1"><div class="range-value"><span id="shareValue">80</span>%</div></div></div>
      </div>
      <div class="result-panel">
        <div class="result-head"><h3>Kết quả dự kiến</h3><p>Doanh thu thực tế phụ thuộc sản lượng, lịch vận hành, thanh toán của bên thuê điện và điều khoản hợp đồng.</p></div>
        <div class="result-grid">
          <div class="result-item"><span class="result-label">Sản lượng/tháng</span><span class="result-value" id="outKwh">60.000 kWh</span></div>
          <div class="result-item"><span class="result-label">Doanh thu/tháng</span><span class="result-value" id="outRevenue">106,8 tr</span></div>
          <div class="result-item"><span class="result-label">Nhà đầu tư nhận</span><span class="result-value green" id="outInvestor">85,4 tr</span></div>
          <div class="result-item"><span class="result-label">O&M, vận hành, sales</span><span class="result-value" id="outOps">21,4 tr</span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function process(block) {
  const phases = parseJson(block.content_json, []);
  return `<section class="section alt" id="process">
  <div class="wrap">
    ${sectionHead(block)}
    <div class="timeline">${phases.map((phase, index) => `<article class="phase"><div class="phase-num">${String(index + 1).padStart(2, "0")}</div><h3>${escapeHtml(phase[0])}</h3><p>${escapeHtml(phase[1])}</p></article>`).join("")}</div>
  </div>
</section>`;
}

function faqSection(faqs) {
  return `<section class="section" id="faq">
  <div class="wrap">
    <div class="section-head"><div><div class="section-kicker">FAQ</div><h2>Câu hỏi cần trả lời trước khi khách để lại thông tin</h2></div></div>
    <div class="faq-grid">${faqs.map((faq) => `<article class="faq-item"><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`).join("")}</div>
  </div>
</section>`;
}

function cta(settings) {
  return `<section class="cta" id="cta">
  <div class="wrap cta-inner">
    <div>
      <div class="section-kicker">Liên hệ</div>
      <h2>Nhận tư vấn theo đúng vai trò của bạn</h2>
      <p>Gửi thông tin để An Nam Lợi phản hồi theo nhu cầu: khảo sát nhà xưởng, nhận hồ sơ deal đầu tư hoặc đăng ký làm đối tác referral.</p>
      <div class="contact-links">
        <a class="button button-primary" href="tel:${escapeAttr(settings.phone_href)}">Gọi: ${escapeHtml(settings.hotline)}</a>
        <a class="button button-ghost" href="${escapeAttr(settings.zalo_url)}" target="_blank" rel="noopener">Zalo tư vấn</a>
      </div>
    </div>
    <div class="contact-box">
      <h3>Thông tin liên hệ</h3>
      <p class="form-intro">Chọn đúng vai trò để An Nam Lợi phản hồi theo nhu cầu: khảo sát nhà xưởng, nhận hồ sơ deal hoặc gửi lead đối tác.</p>
      <form class="lead-form" id="leadForm" method="post" action="/lead" novalidate>
        <div class="form-grid">
          <div class="form-field" data-required><label for="leadName">Họ và tên</label><input id="leadName" name="name" type="text" autocomplete="name" placeholder="Nguyễn Văn A" required><span class="field-error">Vui lòng nhập họ tên.</span></div>
          <div class="form-field" data-required><label for="leadPhone">Điện thoại/Zalo</label><input id="leadPhone" name="phone" type="tel" autocomplete="tel" placeholder="09xx xxx xxx" required><span class="field-error">Vui lòng nhập số điện thoại hoặc Zalo.</span></div>
          <div class="form-field"><label for="leadRole">Vai trò</label><select id="leadRole" name="role"><option value="">Chọn vai trò</option><option>Chủ nhà xưởng muốn thuê điện</option><option>Nhà đầu tư cá nhân</option><option>Sales/referral partner</option></select></div>
          <div class="form-field"><label for="leadProvince">Tỉnh/thành</label><input id="leadProvince" name="province" type="text" placeholder="Bình Dương, Đồng Nai, Long An..."></div>
          <div class="form-field full"><label for="leadScale">Diện tích mái nhà xưởng hoặc số tiền muốn đầu tư</label><input id="leadScale" name="scale" type="text" placeholder="Ví dụ: mái 5.000 m² hoặc đầu tư 500 triệu"></div>
          <div class="form-field full"><label for="leadNote">Ghi chú</label><textarea id="leadNote" name="note" placeholder="Nhu cầu, thời gian triển khai, deal quan tâm hoặc thông tin người phụ trách nhà xưởng"></textarea></div>
        </div>
        <button class="button button-primary" type="submit" style="width: 100%;">Gửi thông tin</button>
        <div class="form-note">Thông tin sẽ được tổng hợp vào email tư vấn để đội phụ trách phản hồi nhanh hơn.</div>
        <div class="form-status" id="formStatus" aria-live="polite"></div>
      </form>
    </div>
  </div>
</section>`;
}

function footer(settings) {
  return `<footer class="footer">
  <div class="wrap">
    <a class="footer-logo" href="#top" aria-label="${escapeAttr(settings.company_name)}"><img src="${escapeAttr(settings.logo_url || "/logo.png")}" alt="${escapeAttr(settings.company_name)}"></a>
    <div class="footer-company">
      <h2 class="footer-title">Thông tin công ty</h2>
      <div class="footer-info">
        <p><span>Tên công ty</span>${escapeHtml(settings.company_name)}</p>
        <p><span>Mã số thuế</span>${escapeHtml(settings.tax_code)}</p>
        <p><span>Địa chỉ</span>${escapeHtml(settings.address)}</p>
        <p><span>Hotline/Zalo</span><a href="tel:${escapeAttr(settings.phone_href)}">${escapeHtml(settings.hotline)}</a></p>
        <p><span>Email</span><a href="mailto:${escapeAttr(settings.email)}">${escapeHtml(settings.email)}</a></p>
      </div>
    </div>
    <div class="disclaimer">${escapeHtml(settings.footer_note)}</div>
  </div>
</footer>`;
}

function modal() {
  return `<div class="project-modal" id="projectModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
  <div class="modal-card" role="document">
    <div class="modal-head"><h2 id="modalTitle">Chi tiết dự án</h2><button class="modal-close" type="button" data-modal-close aria-label="Đóng chi tiết dự án">×</button></div>
    <div class="modal-body">
      <div class="modal-media"><img id="modalImage" src="/image.jpg" alt=""></div>
      <div class="modal-content">
        <div class="modal-status" id="modalStatus"><span class="status-icon open" aria-hidden="true"></span><span>Còn mở</span></div>
        <div class="modal-location" id="modalLocation"></div>
        <div class="modal-spec-grid" id="modalSpecs"></div>
        <div class="modal-block">
          <h3>Điểm cần kiểm tra</h3>
          <ul class="modal-checklist">
            <li><span class="check">✓</span>Hợp đồng thuê điện và thời hạn gia hạn</li>
            <li><span class="check">✓</span>Pháp lý mái, đấu nối, PCCC và bảo hiểm</li>
            <li><span class="check">✓</span>Sản lượng đo đếm, lịch thanh toán và O&M</li>
          </ul>
        </div>
        <p class="modal-note" id="modalNote"></p>
        <div class="modal-actions"><a class="button button-primary button-small" id="modalPrimaryAction" href="#cta" data-modal-close data-lead-role="Nhà đầu tư cá nhân">Nhận hồ sơ deal</a><button class="button button-light button-small" type="button" data-modal-close>Đóng</button></div>
      </div>
    </div>
  </div>
</div>`;
}

function structuredData(settings, projects, faqs) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.company_name,
      url: settings.site_url,
      logo: absoluteUrl(settings.logo_url || "/logo.png", settings.site_url),
      telephone: settings.hotline,
      email: settings.email
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Dự án thuê điện mặt trời",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name,
        url: `${settings.site_url}#${slugify(project.name)}`
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }
  ];

  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function renderHome({ settings, projects, faqs, blocks }) {
  const blockMap = Object.fromEntries(blocks.map((block) => [block.slug, block]));
  const body = `${header(settings)}
<main>
  ${hero(settings)}
  ${journeys(blockMap.journeys)}
  ${trust(settings)}
  ${projectsSection(projects)}
  ${risk(blockMap.risk)}
  ${calculator()}
  ${process(blockMap.process)}
  ${faqSection(faqs)}
  ${cta(settings)}
</main>
${footer(settings)}
${modal()}
<div class="mobile-cta" aria-label="Liên hệ nhanh trên di động"><a class="button button-primary button-small" href="tel:${escapeAttr(settings.phone_href)}">Gọi/Zalo</a><a class="button button-green button-small" href="#cta">Đăng ký</a></div>`;

  return layout({
    settings,
    title: settings.seo_title,
    description: settings.seo_description,
    structuredData: structuredData(settings, projects, faqs),
    body
  });
}

export function renderLeadThanks(settings) {
  return layout({
    settings,
    title: `Đã nhận thông tin | ${settings.site_name}`,
    description: settings.seo_description,
    body: `${header(settings)}<main><section class="section thanks"><div class="wrap"><h1>Đã nhận thông tin</h1><p>An Nam Lợi sẽ phản hồi theo thông tin bạn gửi. Bạn có thể gọi/Zalo trực tiếp nếu cần xử lý nhanh.</p><a class="button button-primary" href="tel:${escapeAttr(settings.phone_href)}">Gọi/Zalo tư vấn</a><a class="button button-light" href="/">Về trang chính</a></div></section></main>${footer(settings)}`
  });
}
