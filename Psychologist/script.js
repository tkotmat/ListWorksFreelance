// Дыхательный ритм героя: 4 с вдох, 6 с выдох (совпадает с CSS-анимацией 10 с)
const breath = document.getElementById('breath');
if (breath && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const cycle = () => {
    breath.textContent = 'Вдох';
    setTimeout(() => (breath.textContent = 'Выдох'), 4000);
  };
  cycle();
  setInterval(cycle, 10000);
}

// Форма записи: проверка и сообщение. Для реальной отправки подключите бэкенд или Formspree.
const form = document.getElementById('form');
const status = document.getElementById('status');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const required = form.querySelectorAll('[required]');
  let ok = true;
  required.forEach((el) => {
    const bad = !el.value.trim();
    el.classList.toggle('err', bad);
    if (bad) ok = false;
  });
  status.classList.toggle('bad', !ok);
  if (!ok) {
    status.textContent = 'Заполните имя и контакт, чтобы я могла вам ответить.';
    return;
  }
  const name = form.elements.name.value.trim();
  status.textContent = `${name}, заявка принята. Отвечу в течение дня.`;
  form.reset();
});
