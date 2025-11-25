// js/lang.js

(function () {
  const SUPPORTED_LANGS = ["ru", "tj"];
  const DEFAULT_LANG = "ru";

  function getInitialLang() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    const savedLang = localStorage.getItem("siteLang");

    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;
    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) return savedLang;

    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("siteLang", lang);

    // Переключаем текстовые блоки
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      if (el.getAttribute("data-lang") === lang) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });

    // Переключаем картинки
    document.querySelectorAll("[data-i18n-img]").forEach(function (img) {
      const data = img.dataset;
      const attr = lang + "Src"; // ruSrc / tjSrc
      const newSrc = data[attr];
      if (newSrc) img.src = newSrc;
    });

    // Переключаем ссылки
    document.querySelectorAll("[data-i18n-link]").forEach(function (a) {
      const data = a.dataset;
      const attr = lang + "Href"; // ruHref / tjHref
      const newHref = data[attr];
      if (newHref) a.href = newHref;
    });

    // Подсветка активной кнопки языка
    document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
      if (btn.getAttribute("data-lang-switch") === lang) {
        btn.classList.add("lang-active");
      } else {
        btn.classList.remove("lang-active");
      }
    });
  }

  function initLang() {
    const initialLang = getInitialLang();
    setLang(initialLang);

    document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lang = btn.getAttribute("data-lang-switch");
        setLang(lang);
      });
    });
  }

  function initBurger() {
    const burger = document.querySelector("[data-burger]");
    const nav = document.querySelector(".main-nav");

    if (!burger || !nav) return;

    burger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("main-nav-open");
      burger.classList.toggle("burger-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    });

    // Закрывать меню при клике по пункту
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("main-nav-open");
        burger.classList.remove("burger-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initBurger();
  });

  /* ===========================
   SLIDER LOGIC
   =========================== */

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("reviewSlider");
  if (!slider) return;

  const track = slider.querySelector(".slider-track");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const btnPrev = slider.querySelector("[data-slider-prev]");
  const btnNext = slider.querySelector("[data-slider-next]");
  const dotsContainer = slider.querySelector("[data-slider-dots]");

  let index = 0;

  function renderDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === index) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    renderDots();
  }

  btnPrev.addEventListener("click", () => goTo(index - 1));
  btnNext.addEventListener("click", () => goTo(index + 1));

  renderDots();

  /* ===== SWIPE ===== */
  let startX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    let dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  });
});
})();
