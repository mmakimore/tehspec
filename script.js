// Основная функция загрузки
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    // Быстрая анимация: шестеренка крутится 1 секунду, потом двери открываются
    setTimeout(() => {
        // Шестеренка уже должна исчезнуть (анимация в CSS)
        // Ждем еще немного перед открытием дверей
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.classList.remove('hidden');
            
            // Запускаем анимацию появления контента
            animateContent();
            
            // Инициализируем слайдер
            initSlider();
            
            // Инициализируем форму
            initForm();
        }, 800); // Двери открываются 0.8 секунды
    }, 1000); // Шестеренка крутится 1 секунду

    // Функция анимации появления контента
    function animateContent() {
        const elements = document.querySelectorAll('.section-title, .service-card, .review-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // Инициализация слайдера работ
    function initSlider() {
        const worksTrack = document.getElementById('works-track');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!worksTrack || !prevBtn || !nextBtn) return;
        
        let currentPosition = 0;
        const slides = document.querySelectorAll('.work-slide');
        if (slides.length === 0) return;
        
        const slideWidth = slides[0].offsetWidth + 25; // + gap
        const totalSlides = slides.length;
        
        function updateSliderPosition() {
            worksTrack.style.transform = `translateX(-${currentPosition}px)`;
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition -= slideWidth;
                updateSliderPosition();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const maxPosition = slideWidth * (totalSlides - 1);
            if (currentPosition < maxPosition) {
                currentPosition += slideWidth;
                updateSliderPosition();
            }
        });
        
        // Адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].offsetWidth + 25;
            currentPosition = Math.round(currentPosition / slideWidth) * newSlideWidth;
            updateSliderPosition();
        });
    }

    // Инициализация формы
    function initForm() {
        const submitBtn = document.getElementById('submit-form');
        
        if (!submitBtn) return;
        
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('form-name').value.trim();
            const telegram = document.getElementById('form-telegram').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Валидация
            if (!name || !telegram || !message) {
                alert('Пожалуйста, заполните обязательные поля: Имя, Telegram и Сообщение');
                return;
            }
            
            // Показываем индикатор загрузки
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                // Твой токен бота и ID чата
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '710000000'; // ЗАМЕНИ НА СВОЙ ID TELEGRAM!
                
                // Форматируем сообщение
                const formattedMessage = `
📨 НОВАЯ ЗАЯВКА С САЙТА

👤 Имя: ${name}
📱 Telegram: @${telegram.replace('@', '')}
☎️ Телефон: ${phone || 'не указан'}
📝 Задача:
${message}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
                `;
                
                // Отправляем в Telegram
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: formattedMessage,
                        parse_mode: 'HTML'
                    })
                });
                
                const data = await response.json();
                
                if (data.ok) {
                    alert('✅ Заявка отправлена! Я свяжусь с вами в Telegram в течение 15 минут.');
                    
                    // Очищаем форму
                    document.getElementById('form-name').value = '';
                    document.getElementById('form-telegram').value = '';
                    document.getElementById('form-phone').value = '';
                    document.getElementById('form-message').value = '';
                    
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка:', error);
                
                // Fallback: открываем Telegram с предзаполненным сообщением
                const fallbackMessage = `Заявка с сайта:%0A%0AИмя: ${name}%0ATelegram: @${telegram}%0AТелефон: ${phone}%0AЗадача: ${message}`;
                window.open(`https://t.me/tehspecgleb?text=${encodeURIComponent(fallbackMessage)}`, '_blank');
                
                alert('Сообщение подготовлено для отправки в Telegram. Пожалуйста, отправьте его вручную.');
                
            } finally {
                // Восстанавливаем кнопку
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Обновляем активную ссылку
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Обновление активной ссылки при прокрутке
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('Сайт загружен!');
});
