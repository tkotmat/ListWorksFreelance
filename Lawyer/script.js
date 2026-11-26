// Валидация и отправка форм (замените блок "отправка" на запрос к вашему backend/CRM)
document.querySelectorAll('[data-form]').forEach(form => {
  const phone = form.querySelector('[name=phone]');
  const valid = el => el.name === 'phone'
    ? el.value.replace(/\D/g, '').length >= 10
    : el.value.trim().length >= 2;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[name=name],[name=phone]').forEach(el => {
      const bad = !valid(el);
      el.classList.toggle('err', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;

    const data = Object.fromEntries(new FormData(form)); // отправка: fetch('/api/lead', {method:'POST', body: JSON.stringify(data)})
    console.log('Новая заявка:', data);
    form.querySelector('.ok').hidden = false;
    form.querySelectorAll('input,select,textarea,button').forEach(el => el.disabled = true);
  });

  form.addEventListener('input', e => e.target.classList.remove('err'));
});
