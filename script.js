
document.body.classList.add("js-enabled");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");
const yearLabel = document.querySelector("#current-year");
const profileImage = document.querySelector(".hero-image img");
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

profileImage?.addEventListener("error", () => {
	profileImage.closest(".hero-image")?.classList.add("has-no-image");
}, { once: true });

if (yearLabel) {
	yearLabel.textContent = new Date().getFullYear();
}

function closeMenu() {
	menuToggle?.setAttribute("aria-expanded", "false");
	menuToggle?.setAttribute("aria-label", "Open navigation menu");
	navLinks?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
	const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
	menuToggle.setAttribute("aria-expanded", String(!isExpanded));
	menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
	navLinks?.classList.toggle("is-open", !isExpanded);
});

sectionLinks.forEach((link) => {
	link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeMenu();
		menuToggle?.focus();
	}
});

function updateScrollChrome() {
	const hasScrolled = window.scrollY > 24;
	siteHeader?.classList.toggle("is-scrolled", hasScrolled);
	backToTop?.classList.toggle("is-visible", window.scrollY > 420);
}

window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

	const sectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;

			sectionLinks.forEach((link) => {
				const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
				if (isCurrent) {
					link.setAttribute("aria-current", "location");
				} else {
					link.removeAttribute("aria-current");
				}
			});
		});
	}, { rootMargin: "-25% 0px -65% 0px" });

	document.querySelectorAll("main section[id], body > section[id]").forEach((section) => sectionObserver.observe(section));
} else {
	document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}
