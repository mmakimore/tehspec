// Основная функция загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Элементы для анимации загрузки
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    // Анимация загрузки: шестеренка крутится 1.5с, потом двери распахиваются
    setTimeout(() => {
        // После вращения шестеренки двери открываются
        setTimeout(() => {
            // Прячем лоадер
            if (loader) loader.style.display = 'none';
            
            // Показываем основной контент
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.classList.add('visible');
            }
            
            // Запускаем анимацию появления остального контента
            animateContent();
        }, 800); // Ждем завершения анимации дверей (0.8с)
    }, 1500); // Шестеренка крутится 1.5 секунды

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
        const slideWidth = document.querySelector('.work-slide').offsetWidth + 30;
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
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модального окна
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
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
            const name = document.getElementById('form-name')?.value.trim();
            const telegram = document.getElementById('form-telegram')?.value.trim();
            const phone = document.getElementById('form-phone')?.value.trim();
            const message = document.getElementById('form-message')?.value.trim();
            
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
                // Fallback: открываем Telegram с предзаполненным сообщением
                const fallbackMessage = `Заявка с сайта:\n\nИмя: ${name}\nTelegram: @${telegram}\nТелефон: ${phone || 'не указан'}\nЗадача: ${message}`;
                window.open(`https://t.me/tehspecgleb?text=${encodeURIComponent(fallbackMessage)}`, '_blank');
                
                // Показываем уведомление
                alert('Сообщение подготовлено для отправки в Telegram. Пожалуйста, отправьте его вручную.');
                
                // Очищаем форму
                if (document.getElementById('form-name')) document.getElementById('form-name').value = '';
                if (document.getElementById('form-telegram')) document.getElementById('form-telegram').value = '';
                if (document.getElementById('form-phone')) document.getElementById('form-phone').value = '';
                if (document.getElementById('form-message')) document.getElementById('form-message').value = '';
                
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка. Пожалуйста, свяжитесь со мной напрямую в Telegram: @tehspecgleb');
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
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
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

    console.log('Сайт успешно загружен!');
});
