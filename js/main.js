document.addEventListener("DOMContentLoaded", () => {
  // год в футере
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // бургер-меню
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("burger--active");
      nav.classList.toggle("nav--open");
    });
  }
});

// ====== Мультиязычность ======

const translations = {
  ru: {
    hero_title: "Подсказки, куда кликать в игре Mines — в реальном времени",
    hero_subtitle: "Инструмент помогает выбирать более безопасные клетки и снижает хаотичные клики. Не гарантирует прибыль, но даёт структуру и больше контроля над игрой.",
    hero_note: "Важно: это не “бот, который делает x2 к банку”, а подсказчик. Риск в игре остаётся всегда, и относиться к нему нужно осознанно.",
  },
  tj: {
    // ВРЕМЕННО тот же текст, потом заменишь на нормальный таджикский
    hero_title: "Подсказки, куда кликать в игре Mines — в реальном времени",
    hero_subtitle: "Инструмент помогает выбирать более безопасные клетки и снижает хаотичные клики. Не гарантирует прибыль, но даёт структуру и больше контроля над игрой.",
    hero_note: "Важно: это не “бот, который делает x2 к банку”, а подсказчик. Риск в игре остаётся всегда, и относиться к нему нужно осознанно.",
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;

  // сохраняем выбор
  localStorage.setItem("mh_lang", lang);

  // переключаем активную кнопку
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("lang-btn--active", btn.dataset.lang === lang);
  });

  // подставляем текст
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang][key];
    if (value) {
      el.textContent = value;
    }
  });
}

function initLanguage() {
  const storedLang = localStorage.getItem("mh_lang") || "ru";

  // навешиваем обработчики на кнопки
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // применяем язык при загрузке
  setLanguage(storedLang);
}

// вызываем сразу — скрипт подключён в конце body, DOM уже есть
initLanguage();

// ====== Слайдер отзывов ======
(function () {
  const slider = document.querySelector('[data-reviews-slider]');
  if (!slider) return; // на других страницах слайдера нет

  const track = slider.querySelector('[data-reviews-track]');
  const slides = Array.from(track.children);
  const btnPrev = slider.querySelector('[data-slider-prev]');
  const btnNext = slider.querySelector('[data-slider-next]');
  const dotsContainer = slider.querySelector('[data-slider-dots]');

  let index = 0;

  // создаём точки
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' slider-dot--active' : '');
    dot.setAttribute('type', 'button');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function update() {
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('slider-dot--active', i === index);
    });
  }

  function goToSlide(i) {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    index = i;
    update();
  }

  btnPrev.addEventListener('click', () => goToSlide(index - 1));
  btnNext.addEventListener('click', () => goToSlide(index + 1));

  // свайп на мобиле (упрощённый)
  let startX = null;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goToSlide(index + 1);
      else goToSlide(index - 1);
    }
    startX = null;
  });

  // стартовое состояние
  update();
})();
