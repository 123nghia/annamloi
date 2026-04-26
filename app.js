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

function formatCounterValue(value, suffix = "") {
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString("en-US");
  return `${formatted}${suffix}`;
}

function animateCounter(node) {
  const target = Number(node.dataset.countTo || "0");
  const suffix = node.dataset.countSuffix || "";
  const duration = Number(node.dataset.countDuration || "1300");
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    node.textContent = formatCounterValue(value, suffix);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      node.textContent = formatCounterValue(target, suffix);
    }
  }

  requestAnimationFrame(step);
}

function bindCountUp() {
  const counters = document.querySelectorAll(".count-up");
  if (!counters.length) return;

  const run = (node) => {
    if (node.dataset.counted === "true") return;
    node.dataset.counted = "true";
    animateCounter(node);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  counters.forEach((counter) => observer.observe(counter));
}

function bindLeadForm() {
  const form = document.querySelector("#leadForm");
  const status = document.querySelector("#formStatus");
  const submitButton = form?.querySelector("button[type='submit']");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      role: String(data.get("role") || "").trim(),
      need: String(data.get("need") || "").trim()
    };

    if (!payload.name || !payload.phone) {
      status.textContent = "Vui lòng nhập họ tên và số điện thoại/Zalo.";
      status.style.color = "#b42318";
      return;
    }

    status.textContent = "Đang gửi yêu cầu tư vấn...";
    status.style.color = "#667085";

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Không thể lưu yêu cầu tư vấn.");
      }

      status.textContent = "Đã lưu yêu cầu tư vấn. Đội vận hành sẽ liên hệ lại sớm.";
      status.style.color = "#12805c";
      form.reset();
    } catch (error) {
      status.textContent = error.message || "Không thể gửi yêu cầu tư vấn.";
      status.style.color = "#b42318";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function bindHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const sync = () => {
    header.classList.toggle("scrolled", window.scrollY > 16);
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function bindRevealEffects() {
  const selectors = [
    ".section-head",
    ".trust-item",
    ".trust-proof-card",
    ".story-card",
    ".deal-spotlight-shell",
    ".deal-card",
    ".detail-layout > *",
    ".finance-layout > *",
    ".dashboard-grid > *",
    ".flow-steps li",
    ".wire-panel",
    ".schema-map",
    ".schema-card",
    ".schema-raw",
    ".copy-grid span",
    ".lead-copy",
    ".lead-form",
    ".footer-main",
    ".footer-risk"
  ];

  const seen = new Set();
  const nodes = [];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      if (seen.has(node)) return;
      seen.add(node);
      node.classList.add("reveal");
      node.style.setProperty("--reveal-index", String(index % 6));
      nodes.push(node);
    });
  });

  if (!nodes.length) return;

  const show = (node) => node.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(show);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -6% 0px"
  });

  nodes.forEach((node) => observer.observe(node));
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");
  createIcons();
  bindHeaderState();
  updateCountdowns();
  bindCountUp();
  bindRoiCalculator();
  bindLeadForm();
  bindRevealEffects();
});
