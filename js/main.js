/**
 * DEVELOPER PORTFOLIO - SHIRSAK GOSWAMI
 * Main JavaScript File
 * Pure Vanilla JavaScript (No Frameworks, No Libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Preloader Screen
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.querySelector('.preloader-bar');

    if (preloader && preloaderBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 10;
            if (progress > 100) progress = 100;
            preloaderBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    document.body.classList.add('loaded');
                }, 400);
            }
        }, 120);

        window.addEventListener('load', () => {
            preloaderBar.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.add('loaded');
            }, 300);
        });
    }

    // ==========================================================================
    // 2. Live Typing Animation for Hero Subtitle
    // ==========================================================================
    const typingText = document.getElementById('typing-text');
    const titles = [
        'Aspiring Frontend Developer',
        'Python Learner',
        'AI Enthusiast'
    ];

    if (typingText) {
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 90;
        const deleteSpeed = 45;
        const pauseDelay = 2200;

        const typeLoop = () => {
            const currentTitle = titles[titleIndex];

            if (isDeleting) {
                typingText.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentTitle.length) {
                nextDelay = pauseDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                nextDelay = 400;
            }

            setTimeout(typeLoop, nextDelay);
        };

        typeLoop();
    }

    // ==========================================================================
    // 3. Interactive Floating Particle Canvas
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.8;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 199, ${this.alpha})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(width / 30);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);

            // Connect close particles with subtle cyan lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 199, ${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ==========================================================================
    // 4. Ultra-Smooth 60 FPS Custom Cursor with Lerp, Trail & Magnetic Effects
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    // Check if device supports touch or coarse pointer
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            window.matchMedia('(pointer: coarse)').matches);
    };

    if (cursorDot && cursorRing && !isTouchDevice()) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;
        let ringX = mouseX;
        let ringY = mouseY;

        // Trail dots
        const trailDots = [];
        const trailCount = 6;
        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            document.body.appendChild(dot);
            trailDots.push({ element: dot, x: mouseX, y: mouseY });
        }

        // Mousemove event listener
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Direct tracking for inner dot for zero latency
            dotX = mouseX;
            dotY = mouseY;
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        });

        // 60 FPS Lerp Loop for outer ring and trail
        const renderCursor = () => {
            // Linear Interpolation (lerp) for smooth liquid-like movement
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

            // Update trail dots
            let leaderX = mouseX;
            let leaderY = mouseY;

            trailDots.forEach((tDot, index) => {
                tDot.x += (leaderX - tDot.x) * (0.35 - index * 0.04);
                tDot.y += (leaderY - tDot.y) * (0.35 - index * 0.04);
                tDot.element.style.transform = `translate3d(${tDot.x}px, ${tDot.y}px, 0) translate(-50%, -50%) scale(${1 - index * 0.12})`;
                tDot.element.style.opacity = `${0.5 - index * 0.07}`;

                leaderX = tDot.x;
                leaderY = tDot.y;
            });

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Magnetic Hover Targets
        const magneticTargets = document.querySelectorAll('.magnetic-target, a, button, .glass-card, .form-input');

        magneticTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });

            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });

        // Ripple Click Effect
        window.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // ==========================================================================
    // 5. 3D Perspective Mouse Tilt Effect
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (!isTouchDevice()) {
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // ==========================================================================
    // 6. Scroll Progress Bar
    // ==========================================================================
    const scrollProgress = document.getElementById('scroll-progress');

    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const progressPercentage = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progressPercentage}%`;
    };

    window.addEventListener('scroll', updateScrollProgress);

    // ==========================================================================
    // 7. Sticky Header & Active Navigation Highlighting
    // ==========================================================================
    const header = document.querySelector('.navbar-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Toggle Scrolled Header Class
    const handleHeaderScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // Active Nav Link Observer
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // ==========================================================================
    // 8. Mobile Navigation Menu Toggle
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close mobile drawer when clicking a link
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // 9. Animated Skill Progress Bars Observer
    // ==========================================================================
    const progressFills = document.querySelectorAll('.skill-progress-fill');

    const progressObserverOptions = {
        root: null,
        threshold: 0.2
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-progress');
                if (targetWidth) {
                    entry.target.style.width = targetWidth;
                }
                observer.unobserve(entry.target);
            }
        });
    }, progressObserverOptions);

    progressFills.forEach((fill) => progressObserver.observe(fill));

    // ==========================================================================
    // 10. Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserverOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    // ==========================================================================
    // 11. Contact Form Submit-Only Validation & Success Toast
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const toast = document.getElementById('toast');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Reset previous error states
            nameInput.classList.remove('is-invalid');
            emailInput.classList.remove('is-invalid');
            messageInput.classList.remove('is-invalid');

            nameError.classList.remove('visible');
            emailError.classList.remove('visible');
            messageError.classList.remove('visible');

            // 1. Validate Name
            if (!nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                nameError.classList.add('visible');
                isValid = false;
            }

            // 2. Validate Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                emailError.classList.add('visible');
                isValid = false;
            }

            // 3. Validate Message
            if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
                messageInput.classList.add('is-invalid');
                messageError.classList.add('visible');
                isValid = false;
            }

            // Handle successful submit
            if (isValid) {
                // Show success toast
                toast.classList.remove('hidden');

                // Clear input fields
                contactForm.reset();

                // Hide toast after 4 seconds
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 4000);
            }
        });
    }

    // ==========================================================================
    // 12. Scroll To Top Button
    // ==========================================================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
