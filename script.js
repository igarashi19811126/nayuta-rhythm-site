const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const mailLinks = document.querySelectorAll("[data-mail-link]");
const youtubePicker = document.querySelector("[data-youtube-picker]");
const youtubeToggle = document.querySelector("[data-youtube-toggle]");
const youtubeMenu = document.querySelector("[data-youtube-menu]");
const youtubeStatus = document.querySelector("[data-youtube-status]");
const revealItems = document.querySelectorAll(".reveal:not(.members-section)");
const galleryItems = document.querySelectorAll("[data-lightbox]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const reservationMail = {
  to: "igarashi19811126@gmail.com",
  subject: "なゆたリズム 7/25ライブ予約",
  body: ["お名前：", "人数：", "ご連絡先：", "メッセージ："].join("\n"),
};

mailLinks.forEach((link) => {
  const href = `mailto:${reservationMail.to}?subject=${encodeURIComponent(reservationMail.subject)}&body=${encodeURIComponent(reservationMail.body)}`;
  link.setAttribute("href", href);
});

const closeYoutubeMenu = () => {
  if (!youtubeMenu || !youtubeToggle) return;
  youtubeMenu.hidden = true;
  youtubeToggle.setAttribute("aria-expanded", "false");
};

youtubeToggle?.addEventListener("click", () => {
  if (!youtubeMenu) return;
  const willOpen = youtubeMenu.hidden;
  youtubeMenu.hidden = !willOpen;
  youtubeToggle.setAttribute("aria-expanded", String(willOpen));
  if (youtubeStatus) youtubeStatus.textContent = "";
});

youtubeMenu?.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (!link) return;

  if (link.getAttribute("href") === "#") {
    event.preventDefault();
    if (youtubeStatus) youtubeStatus.textContent = "準備中";
    return;
  }

  closeYoutubeMenu();
});

document.addEventListener("click", (event) => {
  if (!youtubePicker || !youtubeMenu || youtubeMenu.hidden) return;
  if (event.target instanceof Node && youtubePicker.contains(event.target)) return;
  closeYoutubeMenu();
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
});

nav?.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "メニューを開く");
});

const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.18 }
    )
  : null;

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("is-visible");
  }
});

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  window.setTimeout(() => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage?.setAttribute("src", "");
  }, 340);
};

galleryItems.forEach((item) => {
  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  const itemAlt = item.querySelector("img")?.getAttribute("alt") || "ギャラリー画像";
  item.setAttribute("aria-label", `${itemAlt}を拡大表示`);

  const open = () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const src = item.getAttribute("data-lightbox");
    const caption = item.getAttribute("data-caption") || "";
    const alt = item.querySelector("img")?.getAttribute("alt") || caption;

    lightboxImage.setAttribute("src", src || "");
    lightboxImage.setAttribute("alt", alt);
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    window.requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
    });
    lightboxClose?.focus();
  };

  item.addEventListener("click", open);
  item.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    open();
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
  if (event.key === "Escape") closeYoutubeMenu();
});

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
