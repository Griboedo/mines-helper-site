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
