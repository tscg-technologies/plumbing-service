/**
 * PLUMBING SERVICES — Pure Vanilla JavaScript
 * Zero External Dependencies (No jQuery, No React, No Frameworks)
 * Static Hosting Compatible
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Mobile Navigation & Sticky Header
  // ------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const siteHeader = document.querySelector('.site-header');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking actual nav link or dropdown item (not dropdown toggle button)
    navLinks.querySelectorAll('.nav-link:not(.nav-dropdown-btn), .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target) && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Back to top click
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active page link state & Dropdown highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const toggleBtn = parentDropdown.querySelector('.nav-dropdown-btn');
        if (toggleBtn) toggleBtn.classList.add('active');
      }
    }
  });

  // Dropdown toggle functionality (click & touch support)
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);

        // Close other dropdowns if any
        navDropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.nav-dropdown-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    navDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('is-open');
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ------------------------------------------------------------------------
  // 2. FAQ Accordion
  // ------------------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      // Close all other items in same accordion
      const parentAccordion = item.closest('.faq-accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      item.classList.toggle('active', !isOpen);
    });
  });

  // ------------------------------------------------------------------------
  // 3. Projects Showcase Filtering & Lightbox Modal
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Lightbox Modal Functionality
  const lightboxModal = document.getElementById('project-lightbox');
  if (lightboxModal) {
    const lightboxTitle = lightboxModal.querySelector('.lightbox-title');
    const lightboxCategory = lightboxModal.querySelector('.lightbox-category');
    const lightboxDesc = lightboxModal.querySelector('.lightbox-desc');
    const lightboxFilename = lightboxModal.querySelector('.lightbox-filename');
    const lightboxImg = lightboxModal.querySelector('.lightbox-img');
    const closeBtn = lightboxModal.querySelector('.lightbox-close-btn');
    const prevBtn = lightboxModal.querySelector('.lightbox-prev');
    const nextBtn = lightboxModal.querySelector('.lightbox-next');

    let currentProjectIndex = 0;
    const projectData = [];

    // Collect project items data
    document.querySelectorAll('.project-card').forEach((card, index) => {
      projectData.push({
        title: card.getAttribute('data-title') || card.querySelector('h3')?.textContent || 'Plumbing Project',
        category: card.getAttribute('data-category-label') || card.querySelector('.project-category')?.textContent || 'Plumbing',
        desc: card.getAttribute('data-desc') || card.querySelector('p')?.textContent || '',
        filename: card.getAttribute('data-filename') || 'plumbing-project.webp'
      });

      const viewBtn = card.querySelector('.project-btn-view');
      const mediaWrap = card.querySelector('.project-media-wrap');

      const triggerOpen = () => {
        currentProjectIndex = index;
        openLightbox();
      };

      if (viewBtn) viewBtn.addEventListener('click', triggerOpen);
      if (mediaWrap) mediaWrap.addEventListener('click', triggerOpen);
    });

    function updateLightboxContent() {
      const data = projectData[currentProjectIndex];
      if (!data) return;

      if (lightboxTitle) lightboxTitle.textContent = data.title;
      if (lightboxCategory) lightboxCategory.textContent = data.category;
      if (lightboxDesc) lightboxDesc.textContent = data.desc;
      if (lightboxFilename) lightboxFilename.textContent = data.filename;
      if (lightboxImg) {
        lightboxImg.src = 'images/' + data.filename;
        lightboxImg.alt = data.title;
      }
    }

    function openLightbox() {
      updateLightboxContent();
      lightboxModal.classList.add('is-open');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('is-open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentProjectIndex = (currentProjectIndex - 1 + projectData.length) % projectData.length;
        updateLightboxContent();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentProjectIndex = (currentProjectIndex + 1) % projectData.length;
        updateLightboxContent();
      });
    }

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        currentProjectIndex = (currentProjectIndex - 1 + projectData.length) % projectData.length;
        updateLightboxContent();
      } else if (e.key === 'ArrowRight') {
        currentProjectIndex = (currentProjectIndex + 1) % projectData.length;
        updateLightboxContent();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Contact & Service Request Form Validation
  // ------------------------------------------------------------------------
  const serviceForm = document.getElementById('service-request-form');
  const successModal = document.getElementById('demo-success-modal');
  const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');

  if (serviceForm) {
    // Optional Demo Photo selector UI
    const photoInput = document.getElementById('photo-attachment');
    const photoZone = document.getElementById('photo-dropzone');
    const photoPreview = document.getElementById('photo-preview-pill');
    const photoFileNameSpan = document.getElementById('photo-file-name');
    const removePhotoBtn = document.getElementById('remove-photo-btn');

    if (photoInput && photoPreview && photoFileNameSpan) {
      photoInput.addEventListener('change', () => {
        if (photoInput.files && photoInput.files[0]) {
          const file = photoInput.files[0];
          photoFileNameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB) [Demo Only]`;
          photoPreview.style.display = 'flex';
        }
      });

      if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          photoInput.value = '';
          photoPreview.style.display = 'none';
        });
      }
    }

    // Validation logic
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fullName = document.getElementById('full-name');
      const phone = document.getElementById('phone-number');
      const email = document.getElementById('email-address');
      const serviceType = document.getElementById('service-type');
      const propertyType = document.getElementById('property-type');
      const issueDesc = document.getElementById('issue-description');
      const location = document.getElementById('property-location');
      const prefDate = document.getElementById('preferred-date');
      const prefTime = document.getElementById('preferred-time');

      // Clear previous error classes
      [fullName, phone, email, serviceType, propertyType, issueDesc, location, prefDate, prefTime].forEach(field => {
        if (field) field.classList.remove('is-invalid');
      });

      // Name validation
      if (!fullName || fullName.value.trim().length < 2) {
        fullName?.classList.add('is-invalid');
        isValid = false;
      }

      // Phone validation (digits only, min 8 digits)
      const phoneRegex = /^[0-9+\s\-()]{8,18}$/;
      if (!phone || !phoneRegex.test(phone.value.trim())) {
        phone?.classList.add('is-invalid');
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        email?.classList.add('is-invalid');
        isValid = false;
      }

      // Dropdown validation
      if (!serviceType || !serviceType.value) {
        serviceType?.classList.add('is-invalid');
        isValid = false;
      }

      if (!propertyType || !propertyType.value) {
        propertyType?.classList.add('is-invalid');
        isValid = false;
      }

      // Issue description (min 10 characters)
      if (!issueDesc || issueDesc.value.trim().length < 10) {
        issueDesc?.classList.add('is-invalid');
        isValid = false;
      }

      // Location
      if (!location || location.value.trim().length < 3) {
        location?.classList.add('is-invalid');
        isValid = false;
      }

      // Preferred Date
      if (!prefDate || !prefDate.value) {
        prefDate?.classList.add('is-invalid');
        isValid = false;
      }

      // Preferred Time
      if (!prefTime || !prefTime.value) {
        prefTime?.classList.add('is-invalid');
        isValid = false;
      }

      if (isValid) {
        // Show demo success modal
        if (successModal) {
          const clientNameSpan = successModal.querySelector('.submitted-name');
          if (clientNameSpan && fullName) {
            clientNameSpan.textContent = fullName.value.trim();
          }
          successModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }

        // Reset form
        serviceForm.reset();
        if (photoPreview) photoPreview.style.display = 'none';
      } else {
        // Scroll to first invalid field
        const firstInvalid = serviceForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      }
    });
  }

  // Close Success Modal
  if (successModal) {
    if (closeSuccessModalBtn) {
      closeSuccessModalBtn.addEventListener('click', () => {
        successModal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Intersection Observer
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
});
