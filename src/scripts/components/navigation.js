/**
 * Navigation Component
 * Handles navigation behavior and mobile menu
 */

import { querySelector, querySelectorAll } from '../utils/domHelpers.js';
import { config } from '../config.js';

class Navigation {
  constructor() {
    this.nav = null;
    this.navLinks = null;
    this.mobileToggle = null;
    this.isMenuOpen = false;
  }

  /**
   * Initialize navigation
   */
  init() {
    this.nav = querySelector('.nav');
    this.navLinks = querySelector('.nav-links');
    this.mobileToggle = querySelector('.mobile-menu-toggle');
    
    this.attachScrollListener();
    this.attachMobileMenuListener();
    this.attachLinkClickListeners();
    this.initActiveSectionObserver();
  }

  /**
   * Initialize Intersection Observer for active section highlighting
   */
  initActiveSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to corresponding link
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Handle navigation link click
   * @param {Event} event - Click event
   */
  handleLinkClick(event) {
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
      this.closeMobileMenu();
    }
  }

  /**
   * Attach scroll listener for sticky nav
   */
  attachScrollListener() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.nav?.classList.add('scrolled');
      } else {
        this.nav?.classList.remove('scrolled');
      }
    });
  }

  /**
   * Attach mobile menu toggle listener
   */
  attachMobileMenuListener() {
    if (!this.mobileToggle || !this.navLinks) return;

    this.mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && 
          !e.target.closest('.nav-links') && 
          !e.target.closest('.mobile-menu-toggle')) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Attach click listeners to nav links
   */
  attachLinkClickListeners() {
    const links = querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMobileMenu();
        }
      });
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.navLinks?.classList.add('active');
    this.mobileToggle?.classList.add('active');
    this.isMenuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.navLinks?.classList.remove('active');
    this.mobileToggle?.classList.remove('active');
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}

export const navigation = new Navigation();

