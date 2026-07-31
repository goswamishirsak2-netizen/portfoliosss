/* ----------------------------------------------------
   Shirsak Goswami - Portfolio Interactive JavaScript
   Features: Ambient Particle Canvas, Navbar Scroll,
   Mobile Drawer, Project Modal, Toast Alerts, Contact Validation
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasBackground();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initProjectModal();
    initContactForm();
    initCopyEmail();
    initResumeDownload();
    initScrollAnimations();
});

/* ----------------------------------------------------
   1. Ambient Particle Canvas Background
---------------------------------------------------- */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.15;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 199, ${this.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 212, 199, 0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connecting lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 199, ${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ----------------------------------------------------
   2. Sticky Navbar & Active Section Highlight
---------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link indicator
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ----------------------------------------------------
   3. Mobile Navigation Drawer
---------------------------------------------------- */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

/* ----------------------------------------------------
   4. Smooth Scrolling
---------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });
}

/* ----------------------------------------------------
   5. Project Preview Modal
---------------------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-body-content');
    const modalBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal) return;

    const projectData = {
        '5star': {
            emoji: '🍫',
            title: '5 Star Chocolate Website',
            subtitle: 'Brand Landing Page Concept',
            status: 'Completed',
            image: 'assets/images/project-5star.png',
            desc: 'A modern, responsive landing page created as a tribute to the iconic 5 Star chocolate brand. Designed with dynamic hero interactions, smooth scroll animations, rich chocolate tones, and a sleek dark theme.',
            highlights: [
                'Fully Responsive CSS Flexbox & Grid Layout',
                'Interactive Hover Effects & Micro-animations',
                'Custom Product Feature Cards & Smooth Navigation',
                'Optimized Performance & Semantic HTML Structure'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            github: 'https://github.com/goswamishirsak2-netizen'
        }
    };

    modalBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectData[key];
            if (!data) return;

            modalBody.innerHTML = `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <span style="font-size: 3rem;">${data.emoji}</span>
                    <h2 style="font-size: 2rem; margin-top: 0.5rem;">${data.title}</h2>
                    <p style="color: var(--accent); font-size: 0.95rem; font-weight: 600;">${data.subtitle}</p>
                </div>
                
                <div style="width: 100%; max-height: 250px; overflow: hidden; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid var(--border-glow);">
                    <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

                <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${data.desc}</p>

                <h4 style="font-size: 1.1rem; margin-bottom: 0.8rem; color: var(--text-main);">Key Highlights:</h4>
                <ul style="list-style: none; margin-bottom: 1.5rem;">
                    ${data.highlights.map(h => `<li style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; color: var(--text-sub); font-size: 0.92rem;"><span style="color: var(--accent);">✔</span> ${h}</li>`).join('')}
                </ul>

                <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
                    ${data.tech.map(t => `<span class="tech-tag" style="background: var(--accent-glow-subtle); border-color: var(--border-glow); color: var(--accent);">${t}</span>`).join('')}
                </div>

                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.88rem;">
                        View Source on GitHub
                    </a>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
}

/* ----------------------------------------------------
   6. Contact Form Logic & Toast Notification
---------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', '⚠️');
            return;
        }

        // Simulate sending process
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
            form.reset();
            showToast(`Thank you, ${name}! Your message has been sent to Shirsak.`, '✨');
        }, 1200);
    });
}

/* ----------------------------------------------------
   7. Copy Email Button
---------------------------------------------------- */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const email = 'goswamishirsak2@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email address copied to clipboard!', '📋');
        }).catch(() => {
            showToast('Email: goswamishirsak2@gmail.com', '✉️');
        });
    });
}

/* ----------------------------------------------------
   8. Resume Download Action
---------------------------------------------------- */
function initResumeDownload() {
    const resumeBtn = document.getElementById('download-resume-btn');
    if (!resumeBtn) return;

    resumeBtn.addEventListener('click', () => {
        // Create a stylized text blob resume for instant download demonstration
        const resumeContent = `================================================
SHIRSAK GOSWAMI - RESUME
Aspiring Frontend Developer | Python Learner | AI Enthusiast
Email: shirsakgoswami@gmail.com
Location: India
================================================

PROFILE SUMMARY
Student passionate about Frontend Development, Python programming, and Artificial Intelligence.
Dedicated to building clean, modern, and user-centric web applications with responsive UI.

CORE SKILLS
• Frontend: HTML5, CSS3, JavaScript (ES6+), Flexbox, CSS Grid, Responsive Design
• Programming: Python (Basics, Data Structures, Scripting)
• Tools & Platforms: Git, GitHub, VS Code, AI Tools (ChatGPT, Gemini, Claude)

FEATURED PROJECTS
1. 5 Star Chocolate Website
   - Designed a modern, responsive landing page inspired by the 5 Star brand.
   - Built using HTML, CSS, and JavaScript with smooth UI animations.

2. Personal Developer Portfolio
   - Built a dark turquoise glassmorphism portfolio showcasing skills, timeline, and projects.

LEARNING MILESTONES
✔ HTML & Semantic Markup
✔ CSS Layouts & Glassmorphism
✔ JavaScript DOM & ES6 Logic
✔ Responsive Web Design
✔ Python Programming Fundamentals
🚀 Exploring AI & Smart Developer Workflows

© 2026 Shirsak Goswami
================================================`;

        const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Shirsak_Goswami_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Shirsak Goswami Resume downloaded!', '📄');
    });
}

/* ----------------------------------------------------
   9. Scroll Reveal Animations (Intersection Observer)
---------------------------------------------------- */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.glass-card, .timeline-item, .section-header');
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}

/* Helper: Show Toast Notification */
function showToast(message, icon = '✨') {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = toast.querySelector('.toast-icon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
