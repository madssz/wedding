// ===== Зворотній відлік =====
function initCountdown() {
    const weddingDate = new Date('2026-07-25T16:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Анімації при скролі =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ===== Прелоадер =====
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('hidden');
        }, 800);
    });
}

// ===== Валідація форми =====
function showError(input, message) {
    input.classList.add('input-error');
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// ===== Форма RSVP =====
function initForm() {
    const form = document.getElementById('rsvp-form');
    const attendance = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guests-group');
    const alcoholGroup = document.getElementById('alcohol-group');
    const transferGroup = document.getElementById('transfer-group');
    const transferSelect = document.getElementById('transfer');
    const transferDetailsGroup = document.getElementById('transfer-details-group');

    // Очищення помилки конкретного поля при зміні
    function clearFieldError(e) {
        const input = e.target;
        if (input.classList.contains('input-error')) {
            input.classList.remove('input-error');
            const errorEl = input.parentNode.querySelector('.field-error');
            if (errorEl) errorEl.remove();
        }
    }
    form.addEventListener('input', clearFieldError);
    form.addEventListener('change', clearFieldError);

    // Показати/сховати поля залежно від відвідування
    attendance.addEventListener('change', function () {
        const willAttend = this.value === 'yes';
        guestsGroup.style.display = willAttend ? 'block' : 'none';
        alcoholGroup.style.display = willAttend ? 'block' : 'none';
        document.getElementById('children-group').style.display = willAttend ? 'block' : 'none';
        transferGroup.style.display = willAttend ? 'block' : 'none';

        if (!willAttend) {
            transferDetailsGroup.style.display = 'none';
            document.getElementById('children-count-group').style.display = 'none';
        }
    });

    // Показати деталі трансферу (при будь-якому варіанті «так»)
    transferSelect.addEventListener('change', function () {
        transferDetailsGroup.style.display = (this.value && this.value !== 'no') ? 'block' : 'none';
    });

    // Курсор в кінець поля телефону при фокусі
    const phoneInput = document.getElementById('guest-phone');
    phoneInput.addEventListener('focus', function () {
        const len = this.value.length;
        this.setSelectionRange(len, len);
    });
    const childrenSelect = document.getElementById('children');
    const childrenCountGroup = document.getElementById('children-count-group');

    childrenSelect.addEventListener('change', function () {
        const hasChildren = this.value === 'yes';
        childrenCountGroup.style.display = hasChildren ? 'block' : 'none';
    });

    // Показати поле для свого варіанту напою
    const alcoholOther = document.getElementById('alcohol-other');
    const alcoholOtherText = document.getElementById('alcohol-other-text');
    alcoholOther.addEventListener('change', function () {
        alcoholOtherText.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) alcoholOtherText.value = '';
    });

    // Обробка форми
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Валідація
        clearErrors();
        let hasErrors = false;

        const name = form.querySelector('#guest-name');
        const phone = form.querySelector('#guest-phone');
        const attendanceVal = form.querySelector('#attendance');
        const guestsCount = form.querySelector('#guests-count');
        const transferVal = form.querySelector('#transfer');

        if (!name.value.trim()) {
            showError(name, 'Будь ласка, введіть ваше ім\'я та прізвище');
            hasErrors = true;
        }

        if (!phone.value.trim()) {
            showError(phone, 'Будь ласка, введіть номер телефону');
            hasErrors = true;
        } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone.value.trim())) {
            showError(phone, 'Введіть коректний номер телефону (наприклад: +380 67 123 45 67)');
            hasErrors = true;
        }

        if (!attendanceVal.value) {
            showError(attendanceVal, 'Будь ласка, оберіть варіант');
            hasErrors = true;
        }

        if (attendanceVal.value === 'yes') {
            if (!guestsCount.value) {
                showError(guestsCount, 'Будь ласка, вкажіть кількість гостей');
                hasErrors = true;
            }
            if (!transferVal.value) {
                showError(transferVal, 'Будь ласка, оберіть варіант трансферу');
                hasErrors = true;
            }
        }

        if (hasErrors) {
            const firstError = form.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Надсилаємо...</span>';

        const formData = new FormData(form);
        const data = {};

        // Збираємо дані
        data.name = formData.get('name');
        data.phone = formData.get('phone');
        data.attendance = formData.get('attendance');
        data.guests_count = formData.get('guests_count');
        data.alcohol = formData.getAll('alcohol').join(', ');
        if (formData.get('alcohol_other')) {
            data.alcohol = data.alcohol.replace('other', formData.get('alcohol_other'));
        }
        data.children = formData.get('children');
        data.children_table = data.children === 'yes' ? 'yes' : '';
        data.children_count = formData.get('children_count');
        data.transfer = formData.get('transfer');
        data.transfer_details = formData.get('transfer_details');
        data.wishes = formData.get('wishes');
        data.timestamp = new Date().toISOString();

        // Відправляємо у Google Sheets
        sendToGoogleSheets(data)
            .then(() => {
                form.style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('success-message').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            })
            .catch(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Надіслати відповідь</span>';
                alert('Сталася помилка при відправці. Будь ласка, спробуйте ще раз.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Надіслати відповідь</span>';
            });
    });
}

// ===== Google Sheets інтеграція =====
// Замініть URL нижче на ваш Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpYkZNy1tqX7kyDROXaU0TnnsDpOEDrVLaKmYHZjmGc2KKG6DO_Qks01sMhVoeGC8P7g/exec';

function sendToGoogleSheets(data) {
    if (!navigator.onLine) {
        return Promise.reject(new Error('offline'));
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
}

// ===== Ініціалізація =====
document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initCountdown();
    initScrollAnimations();
    initForm();
});
