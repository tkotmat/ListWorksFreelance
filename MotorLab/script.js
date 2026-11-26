(() => {
    "use strict";

    /* ---------- Данные прайса (цены — пример, замените своими) ---------- */
    const PRICES = {
        Диагностика: [
            ["Компьютерная диагностика двигателя", "30–40 мин", "490 ₴"],
            ["Диагностика ходовой на подъёмнике", "30 мин", "350 ₴"],
            ["Диагностика АКПП", "40 мин", "650 ₴"],
            ["Проверка авто перед покупкой", "90 мин", "1 200 ₴"],
        ],
        ТО: [
            ["Замена масла и фильтра", "40 мин", "от 450 ₴"],
            ["ТО-1: масло, воздушный и салонный фильтры", "90 мин", "от 900 ₴"],
            ["Замена свечей зажигания", "30 мин", "от 300 ₴"],
            ["Замена ремня ГРМ", "4 ч", "от 3 200 ₴"],
        ],
        Ходовая: [
            ["Замена амортизатора", "1,5 ч", "от 900 ₴"],
            ["Замена рычагов и сайлентблоков", "1,5 ч", "от 700 ₴"],
            ["Развал-схождение", "60 мин", "800 ₴"],
            ["Шиномонтаж, 4 колеса", "60 мин", "600 ₴"],
        ],
        Тормоза: [
            ["Замена колодок (одна ось)", "50 мин", "от 500 ₴"],
            ["Замена дисков и колодок (одна ось)", "1,5 ч", "от 900 ₴"],
            ["Прокачка тормозной системы", "40 мин", "450 ₴"],
            ["Диагностика ABS", "40 мин", "500 ₴"],
        ],
    };

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    const tabsEl = $(".tabs");
    const listEl = $("#price-list");
    const select = $("#service-select");

    /* ---------- Список услуг в форме ---------- */
    select.innerHTML =
        '<option value="">Нужна консультация</option>' +
        Object.entries(PRICES)
            .map(
                ([cat, items]) =>
                    `<optgroup label="${cat}">${items.map((i) => `<option>${i[0]}</option>`).join("")}</optgroup>`,
            )
            .join("");

    /* ---------- Вкладки прайса ---------- */
    function renderList(cat) {
        listEl.innerHTML = PRICES[cat]
            .map(
                ([name, time, cost]) => `
      <li>
        <span class="price__name">${name}</span>
        <span class="price__time">${time}</span>
        <span class="price__cost">${cost}</span>
        <button class="price__pick" type="button" data-service="${name}">Записаться</button>
      </li>`,
            )
            .join("");
    }

    Object.keys(PRICES).forEach((cat, i) => {
        const b = document.createElement("button");
        b.className = "tab";
        b.type = "button";
        b.role = "tab";
        b.textContent = cat;
        b.setAttribute("aria-selected", i === 0);
        b.addEventListener("click", () => {
            $$(".tab").forEach((t) => t.setAttribute("aria-selected", t === b));
            renderList(cat);
        });
        tabsEl.append(b);
    });
    renderList(Object.keys(PRICES)[0]);

    /* ---------- Выбор услуги → форма записи ---------- */
    document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-service]");
        if (!el) return;
        select.value = el.dataset.service;
        if (el.tagName === "BUTTON") {
            $("#booking").scrollIntoView({ behavior: "smooth" });
            setTimeout(
                () =>
                    $("#book-form [name=name]").focus({ preventScroll: true }),
                500,
            );
        }
    });

    /* ---------- Маска телефона (+380 XX XXX XX XX) ---------- */
    function formatPhone(raw) {
        let d = raw.replace(/\D/g, "");
        if (d.startsWith("380")) d = d.slice(3);
        else if (d.startsWith("0")) d = d.slice(1);
        d = d.slice(0, 9);
        const p = [
            d.slice(0, 2),
            d.slice(2, 5),
            d.slice(5, 7),
            d.slice(7, 9),
        ].filter(Boolean);
        return d ? "+380 " + p.join(" ") : "";
    }
    $$("input[type=tel]").forEach((inp) =>
        inp.addEventListener("input", () => {
            inp.value = formatPhone(inp.value);
        }),
    );

    /* ---------- Отправка форм ---------- */
    $$("[data-form]").forEach((form) => {
        const status = $(".form__status", form);
        const setStatus = (msg, ok) => {
            status.textContent = msg;
            status.className = "form__status " + (ok ? "is-ok" : "is-err");
        };

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const phoneOk = form.phone.value.replace(/\D/g, "").length === 12;

            $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
            if (!name) {
                form.name.closest(".field").classList.add("is-invalid");
                form.name.focus();
                return setStatus("Укажите, как к вам обращаться.", false);
            }
            if (!phoneOk) {
                form.phone.closest(".field").classList.add("is-invalid");
                form.phone.focus();
                return setStatus(
                    "Проверьте номер: нужно 9 цифр после +380.",
                    false,
                );
            }

            const btn = $("button[type=submit]", form);
            btn.disabled = true;
            setStatus("Отправляем…", true);

            try {
                const data = Object.fromEntries(new FormData(form));
                /* TODO: подключите свой обработчик, например:
           await fetch('/api/lead', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }); */
                console.info("Заявка:", data);
                await new Promise((r) => setTimeout(r, 600));
                form.reset();
                setStatus(
                    "Заявка принята. Перезвоним в течение 10 минут.",
                    true,
                );
            } catch {
                setStatus(
                    "Не получилось отправить. Позвоните нам: +380 (93) 816-32-74.",
                    false,
                );
            } finally {
                btn.disabled = false;
            }
        });
    });

    /* ---------- Дата: не раньше сегодняшней ---------- */
    const date = $("input[type=date]");
    if (date) date.min = new Date().toISOString().slice(0, 10);

    /* ---------- Обратный отсчёт до конца месяца ---------- */
    const cd = $("#countdown");
    function tick() {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const ms = end - now;
        const d = Math.floor(ms / 864e5);
        const h = Math.floor(ms / 36e5) % 24;
        const m = Math.floor(ms / 6e4) % 60;
        cd.textContent = `${d} дн. ${String(h).padStart(2, "0")} ч ${String(m).padStart(2, "0")} мин`;
    }
    tick();
    setInterval(tick, 30000);
})();
