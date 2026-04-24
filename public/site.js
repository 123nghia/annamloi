const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll(".deal-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    const status = button.dataset.filter;
    cards.forEach((card) => {
      card.hidden = status !== "all" && card.dataset.status !== status;
    });
  });
});

const detailButtons = document.querySelectorAll("[data-detail-button]");
const projectModal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalImage = document.querySelector("#modalImage");
const modalStatus = document.querySelector("#modalStatus");
const modalLocation = document.querySelector("#modalLocation");
const modalSpecs = document.querySelector("#modalSpecs");
const modalNote = document.querySelector("#modalNote");
const modalPrimaryAction = document.querySelector("#modalPrimaryAction");
let activeDetailButton = null;

function fillProjectModal(card) {
  const title = card.querySelector(".deal-body h3")?.textContent.trim() || "Chi tiết dự án";
  const location = card.querySelector(".location")?.textContent.trim() || "";
  const image = card.querySelector(".deal-media img");
  const statusText = card.querySelector(".status")?.textContent.trim() || "";
  const isClosed = card.dataset.status === "closed";

  modalTitle.textContent = title;
  modalLocation.textContent = location;
  modalImage.src = image?.getAttribute("src") || "/image.jpg";
  modalImage.alt = image?.getAttribute("alt") || title;
  modalStatus.classList.toggle("closed", isClosed);

  const statusIcon = document.createElement("span");
  const statusLabel = document.createElement("span");
  statusIcon.className = `status-icon ${isClosed ? "closed" : "open"}`;
  statusIcon.setAttribute("aria-hidden", "true");
  statusLabel.textContent = statusText;
  modalStatus.replaceChildren(statusIcon, statusLabel);

  modalPrimaryAction.textContent = isClosed ? "Tư vấn deal tương tự" : "Nhận hồ sơ deal";
  modalPrimaryAction.dataset.leadRole = "Nhà đầu tư cá nhân";
  modalPrimaryAction.dataset.leadNote = isClosed ? `Muốn tư vấn deal tương tự sau khi xem: ${title}` : `Quan tâm dự án: ${title}`;
  modalSpecs.replaceChildren();

  card.querySelectorAll(".spec").forEach((spec) => {
    const label = spec.querySelector(".spec-label")?.textContent.trim() || "";
    const value = spec.querySelector(".spec-value")?.textContent.trim() || "";
    const item = document.createElement("div");
    const labelNode = document.createElement("span");
    const valueNode = document.createElement("strong");

    item.className = "modal-spec";
    labelNode.textContent = label;
    valueNode.textContent = value;
    item.append(labelNode, valueNode);
    modalSpecs.appendChild(item);
  });

  modalNote.textContent = card.querySelector(".deal-note")?.textContent.trim() || "";
}

function openProjectModal(card, opener) {
  activeDetailButton = opener;
  fillProjectModal(card);
  projectModal.hidden = false;
  document.body.classList.add("modal-open");
  projectModal.querySelector("[data-modal-close]")?.focus();
}

function closeProjectModal() {
  if (!projectModal || projectModal.hidden) return;
  projectModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeDetailButton?.focus();
}

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".deal-card");
    if (card) openProjectModal(card, button);
  });
});

projectModal?.addEventListener("click", (event) => {
  if (event.target === projectModal || event.target.closest("[data-modal-close]")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProjectModal();
});

const capacity = document.querySelector("#capacity");
const capacityValue = document.querySelector("#capacityValue");
const yieldSelect = document.querySelector("#yield");
const price = document.querySelector("#price");
const share = document.querySelector("#share");
const shareValue = document.querySelector("#shareValue");
const outKwh = document.querySelector("#outKwh");
const outRevenue = document.querySelector("#outRevenue");
const outInvestor = document.querySelector("#outInvestor");
const outOps = document.querySelector("#outOps");
const formatNumber = new Intl.NumberFormat("vi-VN");

function formatMillion(value) {
  const million = value / 1000000;
  return `${formatNumber.format(Math.round(million * 10) / 10)} tr`;
}

function updateCalc() {
  if (!capacity) return;

  const kwp = Number(capacity.value);
  const monthlyYield = Number(yieldSelect.value);
  const kwhPrice = Number(price.value);
  const investorShare = Number(share.value) / 100;
  const kwh = kwp * monthlyYield;
  const revenue = kwh * kwhPrice;
  const investor = revenue * investorShare;
  const ops = revenue - investor;

  capacityValue.textContent = formatNumber.format(kwp);
  shareValue.textContent = Math.round(investorShare * 100);
  outKwh.textContent = `${formatNumber.format(kwh)} kWh`;
  outRevenue.textContent = formatMillion(revenue);
  outInvestor.textContent = formatMillion(investor);
  outOps.textContent = formatMillion(ops);
}

[capacity, yieldSelect, price, share].filter(Boolean).forEach((input) => {
  input.addEventListener("input", updateCalc);
});
updateCalc();

const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");
const leadRole = document.querySelector("#leadRole");
const leadNote = document.querySelector("#leadNote");
const requiredFields = [
  document.querySelector("#leadName"),
  document.querySelector("#leadPhone")
].filter(Boolean);

document.querySelectorAll("[data-lead-role]").forEach((link) => {
  link.addEventListener("click", () => {
    const role = link.dataset.leadRole;
    const note = link.dataset.leadNote;

    if (role && leadRole) leadRole.value = role;
    if (note && leadNote && !leadNote.value.includes(note)) {
      leadNote.value = leadNote.value.trim() ? `${leadNote.value.trim()}\n${note}` : note;
    }

    if (link.getAttribute("href") === "#cta") {
      window.setTimeout(() => document.querySelector("#leadName")?.focus(), 350);
    }
  });
});

function setInvalid(input, invalid) {
  input.closest(".form-field")?.classList.toggle("is-invalid", invalid);
}

requiredFields.forEach((input) => {
  input.addEventListener("input", () => setInvalid(input, !input.value.trim()));
});

leadForm?.addEventListener("submit", (event) => {
  let hasError = false;
  requiredFields.forEach((input) => {
    const invalid = !input.value.trim();
    setInvalid(input, invalid);
    hasError = hasError || invalid;
  });

  if (hasError) {
    event.preventDefault();
    formStatus.textContent = "Vui lòng nhập họ tên và số điện thoại/Zalo trước khi gửi.";
  }
});
