(function () {
  const SUPPORTED_LANGS = ["ru", "tj", "uz", "en"];
  const LANG_META = {
    ru: { name: "Русский", short: "RU", flagSrc: "/img/flags/ru.svg" },
    tj: { name: "Тоҷикӣ", short: "TJ", flagSrc: "/img/flags/tj.svg" },
    uz: { name: "O'zbekcha", short: "UZ", flagSrc: "/img/flags/uz.svg" },
    en: { name: "English", short: "EN", flagSrc: "/img/flags/en.svg" },
  };

  function buildPath(lang, slug) {
    const base = lang === "ru" ? "" : `/${lang}`;
    if (slug === "index") {
      return base ? `${base}/` : "/";
    }
    return `${base}/pages/${slug}.html`;
  }

  function getLangMeta(lang) {
    return (
      LANG_META[lang] || {
        name: lang.toUpperCase(),
        short: lang.toUpperCase(),
        flagSrc: "",
      }
    );
  }

  function closeLanguageMenus(exceptSwitcher) {
    document.querySelectorAll(".lang-switcher.lang-open").forEach((switcher) => {
      if (exceptSwitcher && switcher === exceptSwitcher) return;
      switcher.classList.remove("lang-open");
      const trigger = switcher.querySelector(".lang-current");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function createLanguageOption(lang, pageSlug) {
    const meta = getLangMeta(lang);

    const link = document.createElement("a");
    link.className = "lang-btn lang-option";
    link.href = buildPath(lang, pageSlug);
    link.dataset.switchLang = lang;
    link.setAttribute("role", "menuitem");

    const main = document.createElement("span");
    main.className = "lang-option-main";

    const flag = document.createElement("img");
    flag.className = "lang-option-flag";
    flag.setAttribute("aria-hidden", "true");
    flag.alt = "";
    flag.loading = "lazy";
    flag.decoding = "async";
    flag.src = meta.flagSrc || "";

    const label = document.createElement("span");
    label.className = "lang-option-label";
    label.textContent = meta.name;

    const check = document.createElement("span");
    check.className = "lang-option-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";

    main.append(flag, label);
    link.append(main, check);

    return link;
  }

  function buildLanguageDropdown(switcher, pageSlug) {
    if (switcher.dataset.dropdownReady === "1") return;

    const existingLinks = Array.from(
      switcher.querySelectorAll("[data-switch-lang]")
    )
      .map((node) => node.getAttribute("data-switch-lang"))
      .filter((lang) => SUPPORTED_LANGS.includes(lang));

    const langs = existingLinks.length
      ? SUPPORTED_LANGS.filter((lang) => existingLinks.includes(lang))
      : SUPPORTED_LANGS.slice();

    switcher.innerHTML = "";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "lang-current";
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Language selection");

    const triggerFlag = document.createElement("img");
    triggerFlag.className = "lang-current-flag";
    triggerFlag.dataset.langCurrentFlag = "";
    triggerFlag.setAttribute("aria-hidden", "true");
    triggerFlag.alt = "";
    triggerFlag.decoding = "async";

    const triggerLabel = document.createElement("span");
    triggerLabel.className = "lang-current-label";
    triggerLabel.dataset.langCurrentLabel = "";

    const triggerShort = document.createElement("span");
    triggerShort.className = "lang-current-short";
    triggerShort.dataset.langCurrentShort = "";

    const triggerCaret = document.createElement("span");
    triggerCaret.className = "lang-current-caret";
    triggerCaret.setAttribute("aria-hidden", "true");
    triggerCaret.textContent = "▼";

    trigger.append(triggerFlag, triggerLabel, triggerShort, triggerCaret);

    const menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.setAttribute("role", "menu");

    langs.forEach((lang) => {
      menu.appendChild(createLanguageOption(lang, pageSlug));
    });

    switcher.append(trigger, menu);
    switcher.dataset.dropdownReady = "1";

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !switcher.classList.contains("lang-open");
      closeLanguageMenus(switcher);
      switcher.classList.toggle("lang-open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    menu.addEventListener("click", () => {
      switcher.classList.remove("lang-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  function setLanguageDropdownState(switcher, currentLang, pageSlug) {
    const triggerFlag = switcher.querySelector("[data-lang-current-flag]");
    const triggerLabel = switcher.querySelector("[data-lang-current-label]");
    const triggerShort = switcher.querySelector("[data-lang-current-short]");
    const meta = getLangMeta(currentLang);

    if (triggerFlag) triggerFlag.src = meta.flagSrc || "";
    if (triggerLabel) triggerLabel.textContent = meta.name;
    if (triggerShort) triggerShort.textContent = meta.short;

    switcher.querySelectorAll("[data-switch-lang]").forEach((link) => {
      const lang = link.getAttribute("data-switch-lang");
      if (!SUPPORTED_LANGS.includes(lang)) return;

      link.setAttribute("href", buildPath(lang, pageSlug));
      link.classList.toggle("lang-active", lang === currentLang);
    });
  }

  function initLanguageSwitcher() {
    const body = document.body;
    if (!body) return;

    const currentLang = body.dataset.currentLang || "ru";
    const pageSlug = body.dataset.pageSlug || "index";

    document.querySelectorAll(".lang-switcher").forEach((switcher) => {
      buildLanguageDropdown(switcher, pageSlug);
      setLanguageDropdownState(switcher, currentLang, pageSlug);
    });

    if (body.dataset.langDropdownGlobalReady !== "1") {
      document.addEventListener("click", () => {
        closeLanguageMenus(null);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeLanguageMenus(null);
        }
      });

      body.dataset.langDropdownGlobalReady = "1";
    }
  }

  function initBurger() {
    const burger = document.querySelector("[data-burger]");
    const nav = document.querySelector(".main-nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("main-nav-open");
      burger.classList.toggle("burger-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("main-nav-open");
        burger.classList.remove("burger-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  function normalizePath(path) {
    if (!path) return "";
    let normalized = path.trim();

    try {
      const parsed = new URL(normalized, window.location.origin);
      normalized = parsed.pathname || "/";
    } catch (error) {
      return normalized;
    }

    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    return normalized.toLowerCase();
  }

  function initActiveNavLink() {
    const body = document.body;
    if (!body) return;

    const currentLang = body.dataset.currentLang || "ru";
    const pageSlug = body.dataset.pageSlug || "index";
    const expectedPath = normalizePath(buildPath(currentLang, pageSlug));
    if (!expectedPath) return;

    document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isActive = normalizePath(href) === expectedPath;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initMobileHeaderMetrics() {
    const root = document.documentElement;
    const header = document.querySelector(".site-header");
    if (!root || !header) return;

    const update = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      if (height > 0) {
        root.style.setProperty("--header-mobile-height", `${height}px`);
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
  }

  function getLocalizedAttr(element, baseAttr, lang) {
    return (
      element.getAttribute(`${baseAttr}-${lang}`) ||
      element.getAttribute(`${baseAttr}-default`) ||
      ""
    );
  }

  function initLocalizedMedia() {
    const body = document.body;
    if (!body) return;

    const currentLang = body.dataset.currentLang || "ru";

    document.querySelectorAll("[data-i18n-src]").forEach((element) => {
      const localizedSrc = getLocalizedAttr(element, "data-i18n-src", currentLang);
      if (localizedSrc) {
        element.setAttribute("src", localizedSrc);
      }
    });

    document.querySelectorAll("[data-i18n-srcset]").forEach((element) => {
      const localizedSrcset = getLocalizedAttr(
        element,
        "data-i18n-srcset",
        currentLang
      );
      if (localizedSrcset) {
        element.setAttribute("srcset", localizedSrcset);
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const localizedAlt = getLocalizedAttr(element, "data-i18n-alt", currentLang);
      if (localizedAlt) {
        element.setAttribute("alt", localizedAlt);
      }
    });
  }

  function initReviewsSlider() {
    const slider = document.querySelector("[data-reviews-slider]");
    if (!slider) return;
    if (slider.dataset.sliderReady === "1") return;
    slider.dataset.sliderReady = "1";

    const track = slider.querySelector("[data-reviews-track]");
    const prevBtn = slider.querySelector("[data-slider-prev]");
    const nextBtn = slider.querySelector("[data-slider-next]");
    const dotsContainer = slider.querySelector("[data-slider-dots]");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".slide"));
    if (!slides.length) return;

    let index = 0;
    const dots = [];
    let counter = slider.querySelector("[data-slider-counter]");
    const currentLang = document.body?.dataset.currentLang || "en";
    const dotWordMap = {
      ru: "Слайд",
      tj: "Слайд",
      uz: "Slayd",
      en: "Slide",
    };
    const dotWord = dotWordMap[currentLang] || "Slide";

    function render() {
      const slideWidth = slider.clientWidth;
      track.style.transform = `translate3d(${-index * slideWidth}px, 0, 0)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      if (counter) {
        counter.textContent = `${index + 1} / ${slides.length}`;
      }
    }

    function goTo(nextIndex) {
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      index = nextIndex;
      render();
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `${dotWord} ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    if (!counter) {
      counter = document.createElement("div");
      counter.className = "slider-counter";
      counter.dataset.sliderCounter = "";
      slider.appendChild(counter);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => goTo(index - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => goTo(index + 1));
    }

    slider.setAttribute("tabindex", "0");
    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    slider.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
        if (dx < 0) goTo(index + 1);
        if (dx > 0) goTo(index - 1);
      },
      { passive: true }
    );

    window.addEventListener("resize", render);

    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLanguageSwitcher();
    initActiveNavLink();
    initBurger();
    initMobileHeaderMetrics();
    initLocalizedMedia();
    initReviewsSlider();
  });
})();
