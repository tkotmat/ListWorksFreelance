(() => {
  const fmt = n => n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + ' ₴';

  // Hero: light follows the pointer
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // Calculator
  const area = document.getElementById('area');
  const spots = document.getElementById('spots');
  const floating = document.getElementById('float');
  const out = document.getElementById('areaOut');
  const sum = document.getElementById('sum');
  const old = document.getElementById('old');

  function calc() {
    const m2 = +area.value;
    const price = +document.querySelector('input[name=type]:checked').value;
    const n = Math.min(Math.max(+spots.value || 0, 0), 40);
    const gift = m2 >= 30 ? Math.min(n, 3) : 0; // 3 светильника в подарок от 30 м²
    const base = m2 * (price + (floating.checked ? 90 : 0)) + (n - gift) * 220;
    const full = m2 * (price + (floating.checked ? 90 : 0)) + n * 220;
    out.textContent = m2 + ' м²';
    old.textContent = fmt(full);
    sum.textContent = fmt(Math.round(base * 0.9));
  }
  document.getElementById('calcForm').addEventListener('input', calc);
  calc();

  // Lead form (demo: подключите свой backend / Telegram-бот / CRM в sendLead)
  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const sendLead = data => Promise.resolve(data); // TODO: fetch('/api/lead', {method:'POST', body: JSON.stringify(data)})
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[^\d+]/g, '');
    msg.className = 'form-msg';
    if (name.length < 2 || phone.replace(/\D/g, '').length < 10) {
      msg.textContent = 'Укажите имя и телефон не короче 10 цифр.';
      msg.classList.add('err');
      return;
    }
    await sendLead({ name, phone, area: area.value, total: sum.textContent });
    msg.textContent = 'Заявка принята. Перезвоним в течение 15 минут.';
    msg.classList.add('ok');
    form.reset();
  });

  // Reveal cards on scroll
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.type,.promo,.steps li').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
})();
