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
    
    this.attachSmoothScrolling();
    this.attachScrollListener();
    this.attachMobileMenuListener();
    this.attachLinkClickListeners();
  }

  /**
   * Attach smooth scrolling to navigation links
   */
  attachSmoothScrolling() {
    const links = querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => this.handleLinkClick(e));
    });
  }

  /**
   * Handle navigation link click
   * @param {Event} event - Click event
   */
  handleLinkClick(event) {
    event.preventDefault();

    const targetSelector = event.currentTarget.getAttribute('href');
    const target = document.querySelector(targetSelector);

    if (target) {
      const offsetTop = target.offsetTop - config.animation.smoothScrollOffset;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
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

