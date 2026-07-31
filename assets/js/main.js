// Proof — сервіс фактчекінгу ІРРП: навігація та відправка форми заявки

document.getElementById('year').textContent = new Date().getFullYear();

// Мобільне меню
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Відправка форми заявки (Formspree) без перезавантаження сторінки
const form = document.getElementById('proofForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (form.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'Форму ще не підключено до Formspree. Додайте ID форми у index.html (див. README).';
    status.className = 'form-status show err';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Надсилаємо…';
  status.className = 'form-status';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.reset();
      status.textContent = 'Дякуємо! Заявку надіслано — ми зв\'яжемося з вами протягом 24 годин.';
      status.className = 'form-status show ok';
    } else {
      const data = await response.json().catch(() => null);
      const message = data && data.errors
        ? data.errors.map((err) => err.message).join(', ')
        : 'Не вдалося надіслати заявку. Спробуйте ще раз або напишіть на irrp.org.ua@gmail.com.';
      status.textContent = message;
      status.className = 'form-status show err';
    }
  } catch (err) {
    status.textContent = 'Не вдалося надіслати заявку. Перевірте з\'єднання або напишіть на irrp.org.ua@gmail.com.';
    status.className = 'form-status show err';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Надіслати заявку';
  }
});
