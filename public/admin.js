document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const linkUrl = new URL(link.href);
  const currentPath = window.location.pathname;
  const isDashboard = linkUrl.pathname === "/admin" && currentPath === "/admin";
  const isSection = linkUrl.pathname !== "/admin" && currentPath.startsWith(linkUrl.pathname);

  link.classList.toggle("is-active", isDashboard || isSection);
});

document.querySelectorAll("[data-image-input]").forEach((input) => {
  input.addEventListener("change", () => {
    const field = input.closest(".image-upload-field");
    if (!field || !input.files?.length) return;

    const files = Array.from(input.files);
    const grid = field.querySelector(".thumb-grid");
    const preview = field.querySelector(".image-upload-preview");

    if (grid) {
      grid.replaceChildren(...files.map((file) => imageNode(file)));
      return;
    }

    if (preview) {
      preview.replaceChildren(imageNode(files[0]));
    }
  });
});

function imageNode(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = file.name || "Ảnh upload";
  img.addEventListener("load", () => URL.revokeObjectURL(img.src), { once: true });
  return img;
}
