const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector(".menu-toggle");
const animatedItems = document.querySelectorAll("[data-animate]");
const form = document.querySelector("[data-quote-form]");
const formStatus = document.querySelector("[data-form-status]");
const year = document.querySelector("[data-year]");
const cursorGlow = document.querySelector(".cursor-glow");
const hero = document.querySelector(".hero");
const floatingCards = document.querySelectorAll(".floating-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (menu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("menu-open", willOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  animatedItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min(index % 6, 5) * 70}ms`);
    observer.observe(item);
  });
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const recipient = form.dataset.recipient || "Jaredwcoad@gmail.com";
    const formData = new FormData(form);
    const getValue = (name) => String(formData.get(name) || "").trim();
    const selectedServices = formData.getAll("services").filter(Boolean);
    const name = getValue("name");
    const organization = getValue("organization");
    const subject = `01 Production Group quote request${name ? ` - ${name}` : ""}`;
    const body = [
      "New quote request from 01 Production Group website",
      "",
      `Name: ${name || "Not provided"}`,
      `Company / Organization: ${organization || "Not provided"}`,
      `Email: ${getValue("email") || "Not provided"}`,
      `Phone: ${getValue("phone") || "Not provided"}`,
      `Event Date: ${getValue("date") || "Not provided"}`,
      `Event Location: ${getValue("location") || "Not provided"}`,
      `Event Type: ${getValue("event-type") || "Not provided"}`,
      `Estimated Guest Count: ${getValue("guest-count") || "Not provided"}`,
      `Services Needed: ${selectedServices.length ? selectedServices.join(", ") : "Not sure / not selected"}`,
      "",
      "Message / Event Details:",
      getValue("message") || "Not provided"
    ].join("\n");
    const mailtoHref = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.classList.add("is-success");
    formStatus.innerHTML = `
      <strong>Success.</strong>
      Your request is ready to send to Jared.
      <a href="${mailtoHref}">Open email draft</a>
    `;
    formStatus.querySelector("a")?.focus();
  });
}

if (cursorGlow && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

if (hero && floatingCards.length && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      floatingCards.forEach((card) => {
        card.style.setProperty("--mx", `${x * 18}px`);
        card.style.setProperty("--my", `${y * 18}px`);
      });
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", () => {
    floatingCards.forEach((card) => {
      card.style.setProperty("--mx", "0px");
      card.style.setProperty("--my", "0px");
    });
  });
}
