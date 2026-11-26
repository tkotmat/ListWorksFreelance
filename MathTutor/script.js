// Счётчик баллов в hero: 56 -> 84
(function () {
  var el = document.getElementById('count');
  var to = +el.dataset.to, from = 56;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var t0 = performance.now(), dur = 1600;
  (function tick(t) {
    var p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
})();

// Выбор слота подставляет время в форму
var slotInput = document.getElementById('slot');
document.querySelectorAll('.slot').forEach(function (b) {
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', function () {
    document.querySelectorAll('.slot').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    slotInput.value = b.dataset.slot;
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
  });
});

// Проверка формы (отправку подключите к своему бэкенду или Telegram-боту)
var form = document.getElementById('form'), msg = document.getElementById('msg');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var ok = true;
  ['name', 'contact'].forEach(function (n) {
    var f = form.elements[n], bad = !f.value.trim();
    f.classList.toggle('err', bad);
    if (bad) ok = false;
  });
  msg.className = 'form-msg ' + (ok ? 'ok' : 'bad');
  msg.textContent = ok ? 'Заявка принята. Напишу вам в течение дня.' : 'Заполните имя и контакт.';
  if (ok) form.reset();
});
