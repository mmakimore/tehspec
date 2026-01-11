// Основная функция загрузки для Telegram Mini App
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
        tg.MainButton.setText('Написать в Telegram');
        tg.MainButton.onClick(() => {
            window.open('https://t.me/tehspecgleb', '_blank');
        });
    }

    // Элементы
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const contactSubmitBtn = document.getElementById('contact-submit');
    const mainSubmitBtn = document.getElementById('submit-form');

    // Настройка анимации загрузки для миниапа
    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }
        showPage('main');
        animateTitle();
        animateServicesOnScroll();
        animateReviewsExpand();
    }, 800);

    // Мобильное меню
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Навигация по страницам
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                showPage(page);
                
                // Обновляем активный пункт меню
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Закрываем меню на мобильных
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Функция показа страницы
    function showPage(pageName) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === `page-${pageName}`) {
                setTimeout(() => {
                    page.classList.add('active');
                    animatePageContent(page);
                }, 50);
            }
        });
        
        // Прокрутка вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Анимация контента страницы
    function animatePageContent(page) {
        const elements = page.querySelectorAll('.service-card, .review-card, .work-slide, .stat-card, .skill-category, .timeline-item, .portfolio-item');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Анимация заголовка "ТЕХНИЧЕСКИЙ СПЕЦИАЛИСТ"
    function animateTitle() {
        const title = document.querySelector('#animated-title');
        if (!title) return;
        
        const text = title.innerText;
        title.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px) scale(0.8)';
            span.style.animation = `letterReveal 0.5s ease ${i * 0.05}s forwards`;
            title.appendChild(span);
            
            if (text[i] === ' ') {
                span.style.margin = '0 4px';
            }
        }
    }

    // Анимация волны для плашек услуг при скролле
    function animateServicesOnScroll() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const rect = card.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // Вычисляем прогресс видимости карточки
                    const cardCenter = rect.top + rect.height / 2;
                    const distanceFromCenter = Math.abs(cardCenter - windowHeight / 2);
                    const maxDistance = windowHeight / 2;
                    const progress = 1 - (distanceFromCenter / maxDistance);
                    
                    // Масштабируем карточку в зависимости от позиции
                    const scale = 0.8 + progress * 0.2;
                    const yOffset = Math.sin(progress * Math.PI) * -15;
                    
                    card.style.transform = `translateY(${yOffset}px) scale(${scale})`;
                    card.style.zIndex = Math.round(progress * 10);
                    card.style.boxShadow = `0 ${10 * progress}px ${30 * progress}px rgba(237, 118, 14, ${0.2 * progress})`;
                }
            });
        }, { threshold: 0.1, rootMargin: '-50px' });
        
        serviceCards.forEach(card => observer.observe(card));
    }

    // Анимация раскрытия отзывов
    function animateReviewsExpand() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.style.animation = 'expandCard 0.6s ease forwards';
                    
                    // Добавляем небольшую задержку между карточками
                    const index = Array.from(reviewCards).indexOf(card);
                    card.style.animationDelay = `${index * 0.1}s`;
                }
            });
        }, { threshold: 0.2 });
        
        reviewCards.forEach(card => observer.observe(card));
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
        
        // Адаптация при ресайзе
        window.addEventListener('resize', () => {
            if (slides.length > 0) {
                const newSlideWidth = slides[0].offsetWidth + 30;
                currentPosition = Math.round(currentPosition / slideWidth) * newSlideWidth;
                slideWidth = newSlideWidth;
                updateSliderPosition();
            }
        });
    }

    // Модальные окна
    const serviceCards = document.querySelectorAll('.service-card[data-modal], .work-slide[data-modal], .portfolio-item[data-modal]');
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

    // ===== ВАЛИДАЦИЯ И ОТПРАВКА ФОРМ =====
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        if (!formData.telegram) {
            errors.push('Введите ник в Telegram');
        } else if (!formData.telegram.startsWith('@')) {
            errors.push('Telegram должен начинаться с @');
        }
        
        if (formData.phone && formData.phone.trim() !== '') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                errors.push('Введите корректный номер телефона');
            }
        }
        
        if (!formData.message || formData.message.length < 10) {
            errors.push('Сообщение должно содержать минимум 10 символов');
        }
        
        return errors;
    }

    // Обработка формы на главной
    if (mainSubmitBtn) {
        mainSubmitBtn.addEventListener('click', async function() {
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
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '7884533080';
                
                const formattedMessage = `
📨 НОВАЯ ЗАЯВКА С МИНИАПА

👤 Имя: ${name}
📱 Telegram: ${telegram}
☎️ Телефон: ${phone || 'не указан'}
📝 Задача:
${message}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
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
                alert('Произошла ошибка. Пожалуйста, напишите мне напрямую в Telegram: @tehspecgleb');
            } finally {
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }

    // Обработка формы на странице контактов
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
📨 НОВАЯ ЗАЯВКА С МИНИАПА (страница контакты)

👤 Имя: ${name}
📱 Telegram: ${telegram}
☎️ Телефон: ${phone || 'не указан'}
📝 Проект:
${message}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
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
                alert('Произошла ошибка. Пожалуйста, напишите мне напрямую в Telegram: @tehspecgleb');
            } finally {
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }

    // Плавная прокрутка для якорей
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

    // Убираем синее подчеркивание навсегда
    function removeBlueUnderlines() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.outline = 'none';
                this.style.boxShadow = '0 0 0 2px rgba(237, 118, 14, 0.2)';
            });
            
            input.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });
        });
    }
    
    removeBlueUnderlines();

    // Добавляем анимацию для подзаголовка в миниап
    function initSubtitleAnimation() {
        const subtitle = document.querySelector('.hero-description');
        if (subtitle && !subtitle.classList.contains('animated')) {
            subtitle.classList.add('animated');
        }
    }
    
    initSubtitleAnimation();

    console.log('Telegram Mini App загружен!');
});

// Добавляем анимацию для букв заголовка
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('#animated-title');
    if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            span.style.animation = `fadeInUp 0.3s ease ${i * 0.05 + 0.5}s forwards`;
            title.appendChild(span);
        }
    }
});
