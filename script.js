// Основная функция загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Элементы для анимации загрузки
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const ctaButton = document.getElementById('cta-button');
    const metalSound = document.getElementById('metalSound');
    
    // Анимация загрузки: шестеренка → двери → контент
    setTimeout(() => {
        // Шестеренка исчезает (уже в CSS анимации)
        // Открываются двери (уже в CSS анимации)
        
        setTimeout(() => {
            // Прячем лоадер
            loader.style.display = 'none';
            
            // Показываем основной контент
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            
            // Воспроизводим звук падения кнопки
            if (metalSound) {
                metalSound.currentTime = 0;
                metalSound.play().catch(e => console.log("Автовоспроизведение звука заблокировано"));
            }
            
            // Запускаем анимацию появления остального контента
            animateContent();
        }, 1000); // Ждем завершения анимации дверей
    }, 2000); // Шестеренка крутится 2 секунды

    // Функция анимации появления контента
    function animateContent() {
        const elements = document.querySelectorAll('.section, .service-card, .review-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // Инициализация слайдера работ
    const worksTrack = document.getElementById('works-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (worksTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const slideWidth = document.querySelector('.work-slide').offsetWidth + 30; // + gap
        const totalSlides = document.querySelectorAll('.work-slide').length;
        
        // Функция обновления позиции слайдера
        function updateSliderPosition() {
            worksTrack.style.transform = `translateX(-${currentPosition}px)`;
        }
        
        // Кнопка "назад"
        prevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition -= slideWidth;
                updateSliderPosition();
            }
        });
        
        // Кнопка "вперед"
        nextBtn.addEventListener('click', () => {
            const maxPosition = slideWidth * (totalSlides - 1);
            if (currentPosition < maxPosition) {
                currentPosition += slideWidth;
                updateSliderPosition();
            }
        });
        
        // Адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            const newSlideWidth = document.querySelector('.work-slide').offsetWidth + 30;
            currentPosition = Math.round(currentPosition / slideWidth) * newSlideWidth;
            slideWidth = newSlideWidth;
            updateSliderPosition();
        });
    }

    // Модальные окна для услуг
    const serviceCards = document.querySelectorAll('.service-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Открытие модального окна при клике на карточку услуги
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем скролл
            }
        });
    });
    
    // Закрытие модального окна
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем скролл
            }
        });
    });
    
    // Закрытие модального окна при клике вне его
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Закрытие модального окна клавишей ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Обработка формы заявки (отправка через Telegram бота)
    const submitBtn = document.getElementById('submit-form');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('form-name').value.trim();
            const telegram = document.getElementById('form-telegram').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Валидация формы
            if (!name || !telegram || !message) {
                alert('Пожалуйста, заполните обязательные поля: Имя, Telegram и Сообщение');
                return;
            }
            
            // Показываем индикатор загрузки
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                // Отправка через Telegram Bot API
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '710000000'; // Твой ID в Telegram (замени на свой)
                
                // Форматируем сообщение
                const formattedMessage = `
📨 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Имя:</b> ${name}
📱 <b>Telegram:</b> @${telegram.replace('@', '')}
☎️ <b>Телефон:</b> ${phone || 'не указан'}
📝 <b>Задача:</b>
${message}

🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
                `;
                
                // Отправляем запрос к Telegram API
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
                    // Успешная отправка
                    alert('✅ Заявка отправлена! Я свяжусь с вами в Telegram в течение 15 минут.');
                    
                    // Очищаем форму
                    document.getElementById('form-name').value = '';
                    document.getElementById('form-telegram').value = '';
                    document.getElementById('form-phone').value = '';
                    document.getElementById('form-message').value = '';
                    
                    // Показываем анимацию успеха
                    this.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
                    setTimeout(() => {
                        this.style.background = '';
                    }, 2000);
                    
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                
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

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Обновляем активную ссылку в навигации
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
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

    // Имитация звука металла при наведении на кнопку
    if (ctaButton && metalSound) {
        ctaButton.addEventListener('mouseenter', function() {
            metalSound.currentTime = 0.1;
            metalSound.volume = 0.3;
            metalSound.play().catch(e => console.log("Звук не воспроизведен"));
        });
    }

    // Добавляем эффект "пульсации" для кнопок при нажатии
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            // Создаем эффект пульсации
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Добавляем CSS для эффекта пульсации
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn-primary {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);

    // Анимация для кнопки в герое при повторном появлении
    function restartButtonAnimation() {
        if (ctaButton) {
            ctaButton.style.animation = 'none';
            void ctaButton.offsetWidth; // Trigger reflow
            ctaButton.style.animation = 'buttonFall 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        }
    }

    // Перезапуск анимации кнопки при фокусе на секцию героя
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'main') {
                restartButtonAnimation();
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.getElementById('main');
    if (heroSection) observer.observe(heroSection);

    console.log('Сайт успешно загружен!');
});
