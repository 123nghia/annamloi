const currency = new Intl.NumberFormat("vi-VN");

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateCountdowns() {
  const now = new Date();

  document.querySelectorAll("[data-countdown]").forEach((node) => {
    const target = new Date(`${node.dataset.countdown}T23:59:59+07:00`);
    const diff = target.getTime() - now.getTime();

    if (Number.isNaN(target.getTime()) || diff <= 0) {
      node.textContent = "Sắp đóng";
      return;
    }

    const days = Math.ceil(diff / 86400000);
    node.textContent = `${days} ngày`;
  });
}

function updateRoiCalculator() {
  const kwpRange = document.querySelector("#kwpRange");
  const roiRange = document.querySelector("#roiRange");
  const priceInput = document.querySelector("#priceInput");
  const kwpOut = document.querySelector("#kwpOut");
  const roiOut = document.querySelector("#roiOut");
  const investAmount = document.querySelector("#investAmount");
  const monthlyProfit = document.querySelector("#monthlyProfit");

  if (!kwpRange || !roiRange || !priceInput) return;

  const kwp = Number(kwpRange.value);
  const roi = Number(roiRange.value);
  const price = Number(priceInput.value);
  const amount = kwp * price;
  const profit = amount * (roi / 100);

  kwpOut.textContent = `${currency.format(kwp)}kWp`;
  roiOut.textContent = `${roi.toFixed(1)}%`;
  investAmount.textContent = `${currency.format(Math.round(amount))} VND`;
  monthlyProfit.textContent = currency.format(Math.round(profit));
}

function bindRoiCalculator() {
  ["#kwpRange", "#roiRange", "#priceInput"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("input", updateRoiCalculator);
  });
  updateRoiCalculator();
}

function bindLeadForm() {
  const form = document.querySelector("#leadForm");
  const status = document.querySelector("#formStatus");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!name || !phone) {
      status.textContent = "Vui lòng nhập họ tên và số điện thoại/Zalo.";
      status.style.color = "#b42318";
      return;
    }

    const lines = [
      "Đăng ký tư vấn deal điện mặt trời An Nam Lợi",
      "",
      `Họ tên: ${name}`,
      `Điện thoại/Zalo: ${phone}`,
      `Vai trò: ${data.get("role") || ""}`,
      `Nhu cầu: ${data.get("need") || ""}`
    ];

    status.textContent = "Đã tạo nội dung email tư vấn từ thông tin bạn nhập.";
    status.style.color = "#12805c";
    window.location.href = `mailto:contact@annamloi.vn?subject=${encodeURIComponent("Đăng ký tư vấn deal An Nam Lợi")}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createIcons();
  updateCountdowns();
  bindRoiCalculator();
  bindLeadForm();
});
