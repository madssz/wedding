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

// ===== Форма RSVP =====
function initForm() {
    const form = document.getElementById('rsvp-form');
    const attendance = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guests-group');
    const alcoholGroup = document.getElementById('alcohol-group');
    const transferGroup = document.getElementById('transfer-group');
    const transferSelect = document.getElementById('transfer');
    const transferDetailsGroup = document.getElementById('transfer-details-group');

    // Показати/сховати поля залежно від відвідування
    attendance.addEventListener('change', function () {
        const willAttend = this.value === 'yes';
        guestsGroup.style.display = willAttend ? 'block' : 'none';
        alcoholGroup.style.display = willAttend ? 'block' : 'none';
        transferGroup.style.display = willAttend ? 'block' : 'none';

        if (!willAttend) {
            transferDetailsGroup.style.display = 'none';
        }
    });

    // Показати деталі трансферу
    transferSelect.addEventListener('change', function () {
        transferDetailsGroup.style.display = this.value === 'yes' ? 'block' : 'none';
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
                // Якщо помилка — зберігаємо локально
                saveResponse(data);
                form.style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('success-message').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Надіслати відповідь</span>';
            });
    });
}

// ===== Google Sheets інтеграція =====
// Замініть URL нижче на ваш Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcaa9PubHAPJ1IS3Ygdomwfpq7VKeuJyB-ROcPqJI1eMUQjIxEb1N9NbdyAZh6tkMGyw/exec';

function sendToGoogleSheets(data) {
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Збереження відповіді в localStorage (резервне)
function saveResponse(data) {
    const responses = JSON.parse(localStorage.getItem('wedding_responses') || '[]');
    responses.push(data);
    localStorage.setItem('wedding_responses', JSON.stringify(responses));
    console.log('Відповідь збережено локально:', data);
}

// ===== Ініціалізація =====
document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initCountdown();
    initScrollAnimations();
    initForm();
});
