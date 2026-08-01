/* ==========================================================================
   Shirsak Goswami Portfolio - Main Navigation & App Logic
   Handles Header Scroll, Mobile Nav Drawer, Active Links, Project Filtering,
   Live Preview Modal, Contact Form Validation, and Email Copying.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. Sticky Navbar & Scroll Progress Bar
     -------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    // Navbar shadow & compact styling
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Progress Indicator Percentage
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrolled}%`;
    }
  });


  /* --------------------------------------------------
     2. Mobile Drawer Navigation Toggle
     -------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinksList = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    hamburgerBtn?.classList.toggle('active');
    navLinks?.classList.toggle('open');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  }

  hamburgerBtn?.addEventListener('click', toggleMobileMenu);

  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks?.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });


  /* --------------------------------------------------
     3. Active Navigation Link Highlighting on Scroll
     -------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));


  /* --------------------------------------------------
     4. Project Category Filter
     -------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });


  /* --------------------------------------------------
     5. Project Interactive Modal Controller
     -------------------------------------------------- */
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalStatus = document.getElementById('modalStatus');
  const modalGithubLink = document.getElementById('modalGithubLink');

  function openProjectModal(data) {
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalTech) modalTech.textContent = data.tech;
    if (modalStatus) modalStatus.textContent = data.status;
    if (modalGithubLink) modalGithubLink.setAttribute('href', data.github || '#');

    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const data = {
        title: btn.getAttribute('data-title'),
        desc: btn.getAttribute('data-desc'),
        tech: btn.getAttribute('data-tech'),
        status: btn.getAttribute('data-status'),
        github: btn.getAttribute('data-github')
      };
      openProjectModal(data);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalConfirmBtn?.addEventListener('click', closeProjectModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeProjectModal();
    }
  });


  /* --------------------------------------------------
     6. Copy Email Button Tooltip
     -------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyTooltip = document.getElementById('copyTooltip');
  const emailText = document.getElementById('emailText');

  copyEmailBtn?.addEventListener('click', () => {
    const email = emailText ? emailText.textContent : 'goswamishirsak2@gmail.com';
    
    navigator.clipboard.writeText(email).then(() => {
      if (copyTooltip) {
        copyTooltip.textContent = 'Copied!';
        copyTooltip.classList.add('show');

        setTimeout(() => {
          copyTooltip.classList.remove('show');
          setTimeout(() => { copyTooltip.textContent = 'Copy'; }, 200);
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  });


  /* --------------------------------------------------
     7. Contact Form Validation & Interactive Feedback
     -------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitFormBtn = document.getElementById('submitFormBtn');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Form inputs
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    // Reset error states
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Remove invalid class on user typing
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input?.addEventListener('input', () => {
        input.closest('.form-group')?.classList.remove('invalid');
      });
    });

    if (isValid) {
      // Simulate form submission process
      if (submitFormBtn) {
        submitFormBtn.disabled = true;
        submitFormBtn.querySelector('span').textContent = 'Sending Message... ⏳';
      }

      setTimeout(() => {
        if (formAlert) {
          formAlert.textContent = '✨ Thank you! Your message has been sent successfully. Shirsak will get back to you soon!';
          formAlert.className = 'form-alert success';
          formAlert.classList.remove('hidden');
        }

        contactForm.reset();

        if (submitFormBtn) {
          submitFormBtn.disabled = false;
          submitFormBtn.querySelector('span').textContent = 'Send Message 🚀';
        }

        // Auto hide success message after 6 seconds
        setTimeout(() => {
          formAlert?.classList.add('hidden');
        }, 6000);
      }, 1200);
    } else {
      if (formAlert) {
        formAlert.textContent = '⚠️ Please fill out all required fields with valid details.';
        formAlert.className = 'form-alert error';
        formAlert.classList.remove('hidden');
      }
    }
  });

});
