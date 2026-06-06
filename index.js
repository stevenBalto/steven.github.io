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
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
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