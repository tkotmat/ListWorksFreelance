// Счётчики в блоке «Результаты»: запускаются, когда блок появляется на экране
const counters = document.querySelectorAll('[data-to]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function format(el, value) {
  const dec = +el.dataset.dec || 0;
  el.textContent = (el.dataset.prefix || '') + value.toFixed(dec) + (el.dataset.suffix || '');
}

function run(el) {
  const to = +el.dataset.to;
  if (reduce) return format(el, to);
  const start = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    format(el, to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  });
}, { threshold: 0.6 });
counters.forEach((c) => io.observe(c));

// Форма: проверка и подтверждение (подключите свой обработчик/CRM вместо заглушки)
const form = document.getElementById('lead');
const msg = form.querySelector('.form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.replace(/[^\d+]/g, '');
  form.name.classList.toggle('err', !name);
  form.phone.classList.toggle('err', phone.length < 10);
  if (!name || phone.length < 10) {
    msg.textContent = 'Укажите имя и телефон в формате +380XXXXXXXXX.';
    return;
  }
  msg.textContent = `Спасибо, ${name}! Позвоним в течение 15 минут в рабочее время.`;
  form.reset();
});
