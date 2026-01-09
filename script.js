// Основная функция загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находится ли пользователь в Telegram Mini App
    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    
    // Если это мини-ап, добавляем класс к body
    if (isTelegramWebApp) {
        document.body.classList.add('telegram-webapp');
        
        // Инициализируем Telegram Web App
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        // Запускаем анимации через requestAnimationFrame для мини-ап
        requestAnimationFrame(() => {
            animateForMiniApp();
        });
    } else {
        // Обычная загрузка сайта
        normalPageLoad();
    }
    
    function animateForMiniApp() {
        // Запускаем анимацию печатания текста для мини-ап
        const description = document.querySelector('.hero-description');
        if (description) {
            description.style.animation = 'fadeIn 2s ease forwards';
        }
        
        // Показываем контент
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }
        
        // Запускаем остальные анимации
        setTimeout(() => {
            animateContent();
        }, 500);
    }
    
    function normalPageLoad() {
        // Проверяем, первый ли это запуск главной страницы
        const isFirstVisit = !sessionStorage.getItem('visited');
        const isMainPage = document.querySelector('body').classList.contains('main-page');
        
        // Элементы для анимации загрузки
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');
        
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

    // Обработка формы заявки
    const submitBtn = document.getElementById('submit-form');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('form-name')?.value.trim();
            const telegram = document.getElementById('form-telegram')?.value.trim();
            const phone = document.getElementById('form-phone')?.value.trim();
            const message = document.getElementById('form-message')?.value.trim();
            
            if (!name || !telegram || !message) {
                alert('Пожалуйста, заполните обязательные поля: Имя, Telegram и Сообщение');
                return;
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '7884533080';
                
                const formattedMessage = `
📨 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Имя:</b> ${name}
📱 <b>Telegram:</b> @${telegram.replace('@', '')}
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
                    alert('✅ Заявка отправлена! Я свяжусь с вами в Telegram в течение 15 минут.');
                    
                    document.getElementById('form-name').value = '';
                    document.getElementById('form-telegram').value = '';
                    document.getElementById('form-phone').value = '';
                    document.getElementById('form-message').value = '';
                    
                    this.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
                    setTimeout(() => {
                        this.style.background = '';
                    }, 2000);
                    
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, свяжитесь со мной напрямую в Telegram: @tehspecgleb');
            } finally {
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }

    // Обработка формы на странице контактов
    const contactSubmitBtn = document.querySelector('button[onclick="sendContactToTelegram()"]');
    if (contactSubmitBtn) {
        contactSubmitBtn.onclick = async function() {
            const name = document.getElementById('contact-name')?.value.trim();
            const phone = document.getElementById('contact-phone')?.value.trim();
            const message = document.getElementById('contact-message')?.value.trim();
            
            if (!name || !phone || !message) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            this.disabled = true;
            
            try {
                const botToken = '8328083670:AAHkb_xbhVHaL53rzU_LoSLtnfs3bDsgiao';
                const chatId = '7884533080';
                
                const formattedMessage = `
📨 <b>НОВАЯ ЗАЯВКА С САЙТА (контакты)</b>

👤 <b>Имя:</b> ${name}
📱 <b>Контакты:</b> ${phone}
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
                    alert('✅ Заявка отправлена! Я свяжусь с вами в течение 15 минут.');
                    
                    document.getElementById('contact-name').value = '';
                    document.getElementById('contact-phone').value = '';
                    document.getElementById('contact-message').value = '';
                    
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
        };
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
