// Основная функция загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находится ли пользователь в Telegram Mini App
    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    
    // Элементы для анимации загрузки
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const isMainPage = document.querySelector('body')?.classList.contains('main-page');
    
    // Если это мини-ап
    if (isTelegramWebApp) {
        document.body.classList.add('telegram-webapp');
        
        // Быстрая загрузка для мини-ап
        if (loader) loader.style.display = 'none';
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }
        
        // Запускаем анимацию для мини-ап
        setTimeout(() => {
            animateForMiniApp();
            animateContent();
        }, 100);
    } else {
        // Обычная загрузка сайта
        normalPageLoad();
    }
    
    function animateForMiniApp() {
        // Для мини-ап форсируем анимацию печатания
        const description = document.querySelector('.hero-description');
        if (description && isMainPage) {
            description.style.animation = 'typewriter 3.5s steps(40, end) 1s forwards, blinkCursor 0.75s step-end infinite';
            description.style.whiteSpace = 'nowrap';
            description.style.borderRight = '3px solid var(--primary)';
            description.style.width = '0';
        }
    }
    
    function normalPageLoad() {
        // Проверяем, первый ли это запуск главной страницы
        const isFirstVisit = !sessionStorage.getItem('visited');
        
        // Если это первое посещение главной страницы - показываем анимацию
        if (isMainPage && isFirstVisit && loader) {
            loader.style.display = 'flex';
            
            // Быстрая анимация: 0.8с шестеренка + 0.4с двери = 1.2с всего
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    mainContent.classList.add('visible');
                }
                
                sessionStorage.setItem('visited', 'true');
                
                setTimeout(() => {
                    animateContent();
                }, 100);
                
            }, 1200);
        } else {
            // Не первое посещение или не главная страница
            if (loader) loader.style.display = 'none';
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.classList.add('visible');
            }
            
            setTimeout(() => {
                animateContent();
            }, 300);
        }
    }

    // Функция анимации появления контента
    function animateContent() {
        const sections = document.querySelectorAll('.section');
        const serviceCards = document.querySelectorAll('.service-card');
        const reviewCards = document.querySelectorAll('.review-card');
        const workSlides = document.querySelectorAll('.work-slide');
        const statCards = document.querySelectorAll('.stat-card');
        const skillCategories = document.querySelectorAll('.skill-category');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Анимация секций
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animated');
            }, index * 200);
        });
        
        // Анимация карточек услуг
        serviceCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 100);
        });
        
        // Анимация отзывов
        reviewCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 150);
        });
        
        // Анимация работ
        workSlides.forEach((slide, index) => {
            setTimeout(() => {
                slide.classList.add('animated');
            }, index * 100);
        });
        
        // Анимация статистики
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 100);
        });
        
        // Анимация навыков (если страница "Обо мне")
        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                category.classList.add('animated');
            }, index * 100);
        });
        
        // Анимация таймлайна
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * 150);
        });
        
        // Анимация прогресс-баров
        animateProgressBars();
    }

    // Анимация прогресс-бара
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 500);
            }
        });
    }

    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Инициализация слайдера работ
    const worksTrack = document.getElementById('works-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (worksTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        let slideWidth = 0;
        const slides = document.querySelectorAll('.work-slide');
        
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth + 30;
        }
        
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
        
        window.addEventListener('resize', () => {
            if (slides.length > 0) {
                const newSlideWidth = slides[0].offsetWidth + 30;
                currentPosition = Math.round(currentPosition / slideWidth) * newSlideWidth;
                slideWidth = newSlideWidth;
                updateSliderPosition();
            }
        });
    }

    // Модальные окна для услуг
    const serviceCards = document.querySelectorAll('.service-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
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
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
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

    // ===== УЛУЧШЕННАЯ ВАЛИДАЦИЯ ФОРМ =====
    function validateForm(formData) {
        const errors = [];
        
        // Валидация имени
        if (!formData.name || formData.name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        // Валидация Telegram
        if (!formData.telegram) {
            errors.push('Введите ник в Telegram');
        } else if (!formData.telegram.startsWith('@')) {
            errors.push('Telegram должен начинаться с @');
        } else if (formData.telegram.length < 6) {
            errors.push('Telegram должен содержать минимум 5 символов после @');
        }
        
        // Валидация телефона (если указан)
        if (formData.phone && formData.phone.trim() !== '') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                errors.push('Введите корректный номер телефона');
            }
        }
        
        // Валидация сообщения
        if (!formData.message || formData.message.length < 10) {
            errors.push('Сообщение должно содержать минимум 10 символов');
        }
        
        return errors;
    }

    // Обработка формы заявки на главной
    const submitBtn = document.getElementById('submit-form');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('form-name')?.value.trim();
            const telegram = document.getElementById('form-telegram')?.value.trim();
            const phone = document.getElementById('form-phone')?.value.trim();
            const message = document.getElementById('form-message')?.value.trim();
            
            const formData = { name, telegram, phone, message };
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }
            
            const originalText = this.innerHTML;
            const originalBackground = this.style.background;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '7884533080';
                
                const formattedMessage = `
📨 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Имя:</b> ${name}
📱 <b>Telegram:</b> ${telegram}
☎️ <b>Телефон:</b> ${phone || 'не указан'}
📝 <b>Задача:</b>
${message}

🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
                `;
                
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
                    // Скрываем форму и показываем сообщение об успехе
                    const contactForm = document.querySelector('.contact-form');
                    if (contactForm) {
                        contactForm.innerHTML = `
                            <div class="form-success active">
                                <i class="fas fa-check-circle"></i>
                                <h3>Заявка отправлена!</h3>
                                <p>Я свяжусь с вами в Telegram в течение 15 минут</p>
                                <p style="color: #aaa; margin-top: 20px;">
                                    <a href="https://t.me/tehspecgleb" style="color: var(--primary); text-decoration: none;">
                                        <i class="fab fa-telegram"></i> @tehspecgleb
                                    </a>
                                </p>
                            </div>
                        `;
                    }
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, свяжитесь со мной напрямую в Telegram: @tehspecgleb');
            } finally {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.background = originalBackground;
            }
        });
    }

    // Обработка формы на странице контактов
    const contactSubmitBtn = document.getElementById('contact-submit');
    
    if (contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', async function() {
            const name = document.getElementById('contact-name')?.value.trim();
            const telegram = document.getElementById('contact-telegram')?.value.trim();
            const phone = document.getElementById('contact-phone')?.value.trim();
            const message = document.getElementById('contact-message')?.value.trim();
            
            const formData = { name, telegram, phone, message };
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '7884533080';
                
                const formattedMessage = `
📨 <b>НОВАЯ ЗАЯВКА С САЙТА (страница контакты)</b>

👤 <b>Имя:</b> ${name}
📱 <b>Telegram:</b> ${telegram}
☎️ <b>Телефон:</b> ${phone || 'не указан'}
📝 <b>Проект:</b>
${message}

🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
                `;
                
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
                    // Скрываем форму, показываем успех
                    const formContainer = document.getElementById('contact-form-container');
                    const successMessage = document.getElementById('contact-success');
                    
                    if (formContainer && successMessage) {
                        formContainer.style.display = 'none';
                        successMessage.classList.add('active');
                    }
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка. Пожалуйста, свяжитесь со мной напрямую в Telegram: @tehspecgleb');
            } finally {
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
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация блика для всех карточек
    function initializeGlowEffects() {
        const cards = document.querySelectorAll('.service-card, .review-card, .stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    initializeGlowEffects();

    console.log('Сайт загружен!');
});
// Добавляем после существующего кода

// Анимация заголовка "ТЕХНИЧЕСКИЙ СПЕЦИАЛИСТ"
function animateTitle() {
    const title = document.getElementById('animated-title');
    if (!title) return;
    
    const text = title.innerText;
    title.innerHTML = '';
    
    // Разбиваем текст на буквы и оборачиваем каждую в span
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.animation = `letterReveal 0.5s ease ${i * 0.05}s forwards`;
        title.appendChild(span);
        
        // Добавляем пробелам нормальное отображение
        if (text[i] === ' ') {
            span.style.margin = '0 4px';
        }
    }
}

// Открытие модального окна при клике на работу
function initWorkModals() {
    const workSlides = document.querySelectorAll('.work-slide[data-modal]');
    workSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Исправление шапки для гарантированной кликабельности
function fixHeaderClickability() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (header) {
        header.style.zIndex = '10000';
        header.style.pointerEvents = 'auto';
    }
    
    navLinks.forEach(link => {
        link.style.position = 'relative';
        link.style.zIndex = '10001';
        link.style.pointerEvents = 'auto';
    });
}

// Инициализация всех улучшений
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем анимацию заголовка
    setTimeout(animateTitle, 1000);
    
    // Инициализируем модальные окна для работ
    initWorkModals();
    
    // Исправляем кликабельность шапки
    fixHeaderClickability();
    
    // Адаптация для экрана 390px
    function checkViewport() {
        if (window.innerWidth <= 390) {
            document.body.classList.add('viewport-390');
        } else {
            document.body.classList.remove('viewport-390');
        }
    }
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    // Улучшенная обработка формы (дополнение к существующей)
    const submitBtn = document.getElementById('submit-form');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Существующая логика формы...
            // Добавляем проверку для 390px
            if (window.innerWidth <= 390) {
                // Оптимизация для маленьких экранов
                const inputs = document.querySelectorAll('#contact input, #contact textarea');
                inputs.forEach(input => {
                    input.style.fontSize = '16px'; // Предотвращает зумирование в iOS
                });
            }
        });
    }
});

// Исправление для корректного отображения на ПК в мини-приложении
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.expand();
    
    // Адаптация под разные размеры экрана на ПК
    function adjustForDesktop() {
        if (window.innerWidth >= 768) {
            // Для ПК в мини-приложении
            document.body.style.maxWidth = '100%';
            document.body.style.margin = '0 auto';
            
            // Оптимальные размеры для ПК
            const container = document.querySelector('.container');
            if (container) {
                container.style.maxWidth = '800px';
            }
        }
    }
    
    window.addEventListener('load', adjustForDesktop);
    window.addEventListener('resize', adjustForDesktop);
}
