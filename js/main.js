/* ==========================================================================
   SHIRSAK GOSWAMI - MAIN JAVASCRIPT LOGIC
   Features: Preloader, Canvas Particle System, Scroll Reveal, Active Nav,
             3D Tilt Effect, Custom Glowing Cursor, Form Toast, Modal Showcase
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Preloader Screen Handler
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    });
    // Fallback timer if load takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 2500);
  }

  // ------------------------------------------------------------------------
  // 2. Interactive Background Particle Canvas System
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(0, 212, 199, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 212, 199, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < Math.min(numberOfParticles, 75); i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(0, 212, 199, ${opacity * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener('resize', initParticles);
  }

  // ------------------------------------------------------------------------
  // 3. Custom Glowing Cursor Follower
  // ------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (cursorDot && cursorOutline && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 250, fill: 'forwards' });
    });

    // Expand cursor on interactive elements hover
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.borderColor = 'var(--accent-secondary)';
        cursorOutline.style.backgroundColor = 'rgba(0, 212, 199, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--accent-primary)';
        cursorOutline.style.backgroundColor = 'transparent';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Scroll Progress Indicator & Header Scroll Tracking
  // ------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    // Update Progress Bar
    if (scrollProgress && totalHeight > 0) {
      const progress = (currentScroll / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Header Background Blur Toggle
    if (header) {
      if (currentScroll > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (currentScroll > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active Section Navigation Highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll to top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 5. Mobile Drawer Navigation Toggle
  // ------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Scroll Reveal Observer (IntersectionObserver)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ------------------------------------------------------------------------
  // 7. Interactive 3D Tilt Effect for Hero Glass Card
  // ------------------------------------------------------------------------
  const heroCard = document.getElementById('heroGlassCard');
  if (heroCard && window.innerWidth > 991) {
    const cardInner = heroCard.querySelector('.glass-card-inner');
    
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      if (cardInner) {
        cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    heroCard.addEventListener('mouseleave', () => {
      if (cardInner) {
        cardInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Button Ripple Effect
  // ------------------------------------------------------------------------
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.classList.add('ripple');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

  // ------------------------------------------------------------------------
  // 9. Demo Modal Window Controller
  // ------------------------------------------------------------------------
  const demoTriggers = document.querySelectorAll('.demo-trigger');
  const demoModal = document.getElementById('demoModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const modalCloseBtn2 = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');

  function openModal(projectName) {
    if (demoModal) {
      if (modalTitle) modalTitle.textContent = projectName || 'Project Live Demo';
      demoModal.classList.add('active');
    }
  }

  function closeModal() {
    if (demoModal) {
      demoModal.classList.remove('active');
    }
  }

  demoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projName = trigger.getAttribute('data-project');
      openModal(projName);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseBtn2) modalCloseBtn2.addEventListener('click', closeModal);

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. Contact Form Handler & Toast Notification
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="${type === 'success' ? '#00D4C7' : '#ef4444'}" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      // Simulate successful form submission
      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }

});
