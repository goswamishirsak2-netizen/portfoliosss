/* ==========================================================================
   Shirsak Goswami Portfolio - Interactive Effects & Animations
   Handles Preloader, 3D Card Tilt, Scroll Reveal, Skill Bars, Stats Counter,
   Button Ripples, and Back-to-Top scroll behavior.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. Preloader Animation
     -------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderCounter = document.getElementById('preloaderCounter');

  let currentProgress = 0;
  const progressInterval = setInterval(() => {
    currentProgress += Math.floor(Math.random() * 15) + 5;
    if (currentProgress > 100) currentProgress = 100;

    if (preloaderProgress) preloaderProgress.style.width = `${currentProgress}%`;
    if (preloaderCounter) preloaderCounter.textContent = `${currentProgress}%`;

    if (currentProgress === 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 300);
    }
  }, 60);


  /* --------------------------------------------------
     2. 3D Tilt Card Effect
     -------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  /* --------------------------------------------------
     3. Scroll Reveal Observer
     -------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('reveal-active');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* --------------------------------------------------
     4. Skill Bar Fill Animation
     -------------------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-bar-fill');
        if (fillBar) {
          const targetWidth = fillBar.getAttribute('data-progress');
          fillBar.style.width = targetWidth;
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(card => skillObserver.observe(card));


  /* --------------------------------------------------
     5. Animated Number Counter for Stats
     -------------------------------------------------- */
  const statItems = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsSection = document.querySelector('.stats-counter-grid');

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statItems.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = current;
          }, 40);
        });
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  /* --------------------------------------------------
     6. Button Click Ripple Effect
     -------------------------------------------------- */
  const rippleButtons = document.querySelectorAll('.ripple-btn');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      this.appendChild(circle);

      setTimeout(() => circle.remove(), 600);
    });
  });


  /* --------------------------------------------------
     7. Scroll-To-Top Button
     -------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* --------------------------------------------------
     8. Custom Glowing Mouse Cursor (Smooth Lerp Loop)
     -------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  // Disable custom cursor on touch/mobile devices
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none)').matches;

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouse = { x: -100, y: -100 };
    let ring = { x: -100, y: -100 };

    // Mouse movement tracking
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Immediate dot update
      cursorDot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    });

    // Smooth Lerp Animation for Outer Ring
    function renderCursor() {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;

      cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements (Grow ring 1.5x & add neon glow)
    const interactiveSelectors = 'a, button, input, textarea, select, .btn, .glass-card, .project-card, .skill-card, .pillar-card, .service-card, .copy-btn, .filter-btn, .modal-close, .channel-link';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorRing.classList.add('hovered');
        cursorDot.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorRing.classList.remove('hovered');
        cursorDot.classList.remove('hovered');
      }
    });

    // Click shrink & expand animation
    window.addEventListener('mousedown', () => {
      cursorRing.classList.add('clicked');
      cursorDot.classList.add('clicked');
    });

    window.addEventListener('mouseup', () => {
      cursorRing.classList.remove('clicked');
      cursorDot.classList.remove('clicked');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

});
