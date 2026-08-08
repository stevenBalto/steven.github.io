const header = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const themeToggle = document.getElementById("theme-toggle");
const sections = Array.from(document.querySelectorAll("section[id]"));

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", active);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: 0.01,
  }
);

sections.forEach((section) => observer.observe(section));

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") {
  document.body.classList.add("light-mode");
}

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const to = contactForm.dataset.email;
    const data = new FormData(contactForm);
    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();
    const subject = (data.get("subject") || "").trim() || `Portfolio contact — ${name}`;
    const message = (data.get("message") || "").trim();

    const body = `${message}\n\n—\n${name}\n${email}`;
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;

    formStatus.className = "form-status ok";
    formStatus.textContent = "Opening your email app… if nothing happens, write me at " + to;
  });
}

themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", light ? "light" : "dark");

  const icon = themeToggle.querySelector("i");
  icon.className = light ? "fa-regular fa-sun" : "fa-regular fa-moon";
});

if (document.body.classList.contains("light-mode")) {
  const icon = themeToggle.querySelector("i");
  icon.className = "fa-regular fa-sun";
}