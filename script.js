// Мобильное меню
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Отправка формы в Telegram
async function sendToTelegram() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    if (!name || !phone || !message) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
    const chatId = '@tehspecgleb';
    
    const text = `📨 Новая заявка с сайта%0A%0A👤 Имя: ${name}%0A📱 Контакты: ${phone}%0A📝 Сообщение: ${message}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        if (data.ok) {
            alert('Сообщение отправлено! С вами свяжутся в течение 15 минут.');
            
            // Очищаем форму
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('message').value = '';
        } else {
            throw new Error(data.description);
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        // Fallback - открываем Telegram с предзаполненным сообщением
        window.open(`https://t.me/tehspecgleb?text=${text}`, '_blank');
    }
}

function sendContactToTelegram() {
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !phone || !message) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    const text = `📨 Новая заявка с КОНТАКТНОЙ формы%0A%0A👤 Имя: ${name}%0A📱 Контакты: ${phone}%0A📝 Сообщение: ${message}`;
    
    // Используем API бота
    sendToTelegramAPI(name, phone, message);
}

async function sendToTelegramAPI(name, phone, message) {
    const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
    const chatId = '@tehspecgleb';
    
    const text = `📨 Новая заявка с сайта%0A%0A👤 Имя: ${name}%0A📱 Контакты: ${phone}%0A📝 Сообщение: ${message}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        if (data.ok) {
            alert('Сообщение отправлено! С вами свяжутся в течение 15 минут.');
            
            // Очищаем форму
            if (document.getElementById('contact-name')) {
                document.getElementById('contact-name').value = '';
                document.getElementById('contact-phone').value = '';
                document.getElementById('contact-message').value = '';
            }
        } else {
            throw new Error(data.description);
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        // Fallback
        window.open(`https://t.me/tehspecgleb?text=${text}`, '_blank');
    }
}

// Анимация при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Активная ссылка в навигации
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Добавляем класс для анимации загрузки
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuBtn) {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});
