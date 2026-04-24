import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { assertRuntimeConfig, config } from "./config.js";

assertRuntimeConfig();

const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken
});

let initPromise;

const defaultSettings = {
  site_name: "An Nam Lợi",
  site_url: config.publicSiteUrl,
  seo_title: "An Nam Lợi | Thuê điện mặt trời mái nhà xưởng",
  seo_description: "An Nam Lợi kết nối nhà xưởng thuê điện mặt trời, nhà đầu tư theo từng dự án và đối tác giới thiệu lead nhà xưởng.",
  seo_keywords: "An Nam Lợi, điện mặt trời mái nhà, thuê điện mặt trời, đầu tư điện mặt trời, rooftop solar, nhà xưởng",
  og_image: "/image.jpg",
  logo_url: "/logo.png",
  hero_eyebrow: "Điện mặt trời mái nhà xưởng | Thuê điện | Deal đầu tư",
  hero_title: "An Nam Lợi kết nối nhà xưởng, nhà đầu tư và đối tác bán hàng",
  hero_copy: "Nhà xưởng thuê điện mặt trời để giảm chi phí ban ngày. Nhà đầu tư xem từng deal riêng trước khi quyết định. Đối tác bán hàng gửi lead và theo dõi trạng thái xử lý.",
  hero_image: "/image.jpg",
  company_name: "Công ty TNHH An Nam Lợi",
  tax_code: "Đang cập nhật",
  address: "Đang cập nhật",
  hotline: "0900 000 000",
  phone_href: "0900000000",
  zalo_url: "https://zalo.me/0900000000",
  email: "contact@example.com",
  footer_note: "Thông tin trên trang là nội dung giới thiệu mô hình và số liệu minh họa. Dòng tiền thực tế cần căn cứ hợp đồng, sản lượng vận hành, lịch thanh toán, chi phí O&M và hồ sơ pháp lý của từng dự án. Nhà đầu tư nên tự rà soát hồ sơ trước khi tham gia."
};

const defaultProjects = [
  {
    name: "Nhà máy thực phẩm Bình Dương",
    status: "open",
    location: "Bình Dương",
    capacity: "500 kWp",
    factory_type: "Thực phẩm",
    lease_term: "10 năm + gia hạn 5 năm",
    price: "+1.780 đ/kWh",
    annual_increase: "3%/năm",
    progress: 62,
    summary: "Hồ sơ đang cập nhật",
    note: "Còn mở cho nhà đầu tư quan tâm. Hồ sơ chi tiết sẽ gửi sau khi xác minh.",
    image_url: "/image.jpg",
    gallery_json: JSON.stringify(["/image.jpg", "/image.jpg", "/image.jpg"]),
    sort_order: 1
  },
  {
    name: "Kho lạnh Long An",
    status: "closed",
    location: "Long An",
    capacity: "750 kWp",
    factory_type: "Kho lạnh",
    lease_term: "10 năm + gia hạn 5 năm",
    price: "+1.780 đ/kWh",
    annual_increase: "3%/năm",
    progress: 100,
    summary: "Deal đã đóng",
    note: "Deal đã chốt nên đóng nhận đăng ký mới.",
    image_url: "/image.jpg",
    gallery_json: JSON.stringify(["/image.jpg", "/image.jpg", "/image.jpg"]),
    sort_order: 2
  },
  {
    name: "Xưởng cơ khí Đồng Nai",
    status: "open",
    location: "Đồng Nai",
    capacity: "300 kWp",
    factory_type: "Cơ khí",
    lease_term: "10 năm + gia hạn 5 năm",
    price: "+1.780 đ/kWh",
    annual_increase: "3%/năm",
    progress: 38,
    summary: "Hồ sơ đang cập nhật",
    note: "Còn mở. Khi chốt sẽ chuyển sang trạng thái đã chốt.",
    image_url: "/image.jpg",
    gallery_json: JSON.stringify(["/image.jpg", "/image.jpg", "/image.jpg"]),
    sort_order: 3
  }
];

const defaultFaqs = [
  ["Cấu trúc pháp lý của deal là gì?", "Cần có hợp đồng thuê điện với nhà xưởng và phụ lục/thoả thuận tham gia dự án thể hiện quyền, nghĩa vụ, tỷ lệ chia doanh thu và phương thức thanh toán."],
  ["Ai sở hữu hệ thống điện mặt trời?", "Quyền sở hữu phải ghi rõ trong hợp đồng: chủ đầu tư dự án, pháp nhân vận hành hoặc cấu trúc đồng tài trợ tùy hồ sơ từng dự án."],
  ["Doanh thu được thu như thế nào?", "Doanh thu thường đến từ tiền điện nhà xưởng thanh toán theo sản lượng đo đếm và đơn giá thuê. Cần xác minh tài khoản nhận tiền, kỳ thanh toán và quyền kiểm tra số liệu."],
  ["Nếu nhà xưởng ngừng mua điện thì sao?", "Cần xem điều khoản vi phạm, chấm dứt, bồi thường, tháo dỡ, chuyển giao hệ thống và phương án xử lý khi phụ tải thay đổi hoặc nhà xưởng dừng hoạt động."],
  ["Ai chịu trách nhiệm O&M?", "Đơn vị vận hành/bảo trì phải được nêu trong hồ sơ, gồm phạm vi bảo trì, thời gian phản hồi, thay thế thiết bị và ngân sách O&M."],
  ["Dự án có bảo hiểm không?", "Cần kiểm tra bảo hiểm tài sản, trách nhiệm dân sự, cháy nổ nếu áp dụng và các trường hợp loại trừ trước khi quyết định."]
];

export async function query(sql, args = []) {
  await ensureDatabase();
  return client.execute({ sql, args });
}

export async function rawQuery(sql, args = []) {
  return client.execute({ sql, args });
}

export async function ensureDatabase() {
  if (!initPromise) initPromise = initializeDatabase();
  return initPromise;
}

async function initializeDatabase() {
  await client.batch([
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      location TEXT NOT NULL DEFAULT '',
      capacity TEXT NOT NULL DEFAULT '',
      factory_type TEXT NOT NULL DEFAULT '',
      lease_term TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT '',
      annual_increase TEXT NOT NULL DEFAULT '',
      progress INTEGER NOT NULL DEFAULT 0,
      summary TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '/image.jpg',
      gallery_json TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS content_blocks (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      kicker TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      content_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      province TEXT NOT NULL DEFAULT '',
      scale TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'website',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ], "write");

  await seedSettings();
  await seedAdmin();
  await seedProjects();
  await seedFaqs();
  await seedContentBlocks();
  await client.execute("INSERT OR IGNORE INTO schema_migrations(version) VALUES (1)");
}

async function seedSettings() {
  for (const [key, value] of Object.entries(defaultSettings)) {
    await client.execute({
      sql: "INSERT OR IGNORE INTO settings(key, value) VALUES (?, ?)",
      args: [key, value]
    });
  }
}

async function seedAdmin() {
  const existing = await client.execute("SELECT id FROM admins LIMIT 1");
  if (existing.rows.length) return;

  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await client.execute({
    sql: "INSERT INTO admins(email, password_hash) VALUES (?, ?)",
    args: [config.adminEmail, passwordHash]
  });
}

async function seedProjects() {
  const existing = await client.execute("SELECT id FROM projects LIMIT 1");
  if (existing.rows.length) return;

  for (const project of defaultProjects) {
    await client.execute({
      sql: `INSERT INTO projects
        (name, status, location, capacity, factory_type, lease_term, price, annual_increase, progress, summary, note, image_url, gallery_json, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        project.name,
        project.status,
        project.location,
        project.capacity,
        project.factory_type,
        project.lease_term,
        project.price,
        project.annual_increase,
        project.progress,
        project.summary,
        project.note,
        project.image_url,
        project.gallery_json,
        project.sort_order
      ]
    });
  }
}

async function seedFaqs() {
  const existing = await client.execute("SELECT id FROM faqs LIMIT 1");
  if (existing.rows.length) return;

  for (const [index, faq] of defaultFaqs.entries()) {
    await client.execute({
      sql: "INSERT INTO faqs(question, answer, sort_order) VALUES (?, ?, ?)",
      args: [faq[0], faq[1], index + 1]
    });
  }
}

async function seedContentBlocks() {
  const blocks = [
    {
      slug: "journeys",
      kicker: "Ba nhóm người dùng",
      title: "Đi đúng nhu cầu trước khi yêu cầu thông tin liên hệ",
      description: "Mỗi nhóm có động cơ khác nhau: giảm tiền điện, tìm dòng tiền theo dự án, hoặc giới thiệu nhà xưởng và theo dõi hoa hồng.",
      content_json: JSON.stringify([
        {
          title: "Chủ nhà xưởng thuê điện",
          body: "Dùng điện mặt trời ngay trên mái, không phải tự bỏ vốn lắp đặt hệ thống.",
          items: ["Giảm chi phí điện ban ngày theo giá thuê đã thỏa thuận", "Không cần bỏ vốn lắp đặt hệ thống ban đầu", "EPC, vận hành và bảo trì được đưa vào phương án"],
          cta: "Đăng ký khảo sát nhà xưởng",
          role: "Chủ nhà xưởng muốn thuê điện"
        },
        {
          title: "Nhà đầu tư cá nhân",
          body: "Tham gia theo từng dự án có hồ sơ riêng, dòng tiền dự kiến riêng và trạng thái riêng.",
          items: ["Dòng tiền mục tiêu theo hợp đồng, phụ thuộc sản lượng thực tế", "Minh bạch tỷ lệ chia doanh thu và chi phí vận hành", "Chỉ xem xét sau khi có bộ hồ sơ xác minh"],
          cta: "Xem deal đầu tư",
          role: "Nhà đầu tư cá nhân"
        },
        {
          title: "Sales/referral partner",
          body: "Gửi lead nhà xưởng, theo dõi tình trạng xử lý và nhận chính sách hoa hồng theo từng hợp đồng.",
          items: ["Nộp thông tin nhà xưởng và người phụ trách", "Theo dõi trạng thái: tiếp nhận, khảo sát, báo giá, ký hợp đồng", "Hoa hồng: bổ sung theo chính sách thực tế"],
          cta: "Gửi lead nhà xưởng",
          role: "Sales/referral partner"
        }
      ])
    },
    {
      slug: "risk",
      kicker: "Công bố rủi ro",
      title: "Nhà đầu tư cần đọc trước khi yêu cầu hồ sơ deal",
      description: "Dòng tiền mục tiêu/dự kiến theo từng hợp đồng, phụ thuộc sản lượng thực tế, điều khoản thuê điện và hồ sơ pháp lý dự án. Đây không phải cam kết lợi nhuận cố định.",
      content_json: JSON.stringify([
        "Sản lượng điện mặt trời có thể thay đổi theo thời tiết, thiết bị, bóng che và hiệu suất vận hành.",
        "Nhu cầu tiêu thụ điện của nhà xưởng có thể thay đổi trong quá trình hợp đồng.",
        "Hợp đồng thuê điện, quyền sử dụng mái, đấu nối và pháp lý dự án phải được kiểm tra trước khi tham gia.",
        "Dòng tiền dự kiến không phải lợi nhuận bảo đảm hoặc lãi suất cố định."
      ])
    },
    {
      slug: "process",
      kicker: "Quy trình",
      title: "Từ khảo sát nhà xưởng đến vận hành và phân bổ doanh thu",
      description: "Quy trình giúp chủ xưởng, nhà đầu tư và đối tác referral biết bước tiếp theo của mình.",
      content_json: JSON.stringify([
        ["Tiếp nhận nhu cầu", "Nhận thông tin mái, hóa đơn điện, người phụ trách và nhu cầu thuê điện hoặc giới thiệu khách."],
        ["Khảo sát và báo giá", "Đánh giá kết cấu mái, phụ tải, đấu nối, sản lượng dự kiến và phương án giá thuê điện."],
        ["Hoàn thiện hồ sơ", "Tập hợp hợp đồng thuê điện, pháp lý mái, phương án EPC/O&M, bảo hiểm và phụ lục chia doanh thu."],
        ["Vận hành và báo cáo", "Theo dõi sản lượng, thu tiền điện, cập nhật trạng thái referral và phân bổ doanh thu theo hồ sơ đã ký."]
      ])
    }
  ];

  for (const block of blocks) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO content_blocks(slug, title, kicker, description, content_json)
        VALUES (?, ?, ?, ?, ?)`,
      args: [block.slug, block.title, block.kicker, block.description, block.content_json]
    });
  }
}

export async function getSettings() {
  const result = await query("SELECT key, value FROM settings");
  return Object.fromEntries(result.rows.map((row) => [row.key, row.value]));
}

export async function updateSettings(entries) {
  for (const [key, value] of Object.entries(entries)) {
    await query(
      `INSERT INTO settings(key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [key, value ?? ""]
    );
  }
}
