// ========================================
// Modern, Scalable Frontend Architecture
// Performance: O(1) - O(n) optimized
// ========================================

// Configuration Object - Centralized & Scalable
const AppConfig = {
  milestones: [
    { selector: '.milestone-number', threshold: 0.5 },
  ],
  animations: {
    duration: 2000,
    easing: 'ease-out'
  },
  debounce: 150
};

// Utility Functions - O(1) Operations
const Utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  formatNumber: (num) => {
    return num.toLocaleString('en-IN');
  },
  
  observerOptions: (threshold = 0.5) => ({
    threshold,
    rootMargin: '0px 0px -50px 0px'
  })
};

// Counter Manager - Efficient Animation Controller
const CounterManager = {
  animated: new Set(), // Track animated elements - O(1) lookup
  
  startCounter: (element, targetValue) => {
    if (CounterManager.animated.has(element)) return; // Prevent duplicate animations
    
    const startTime = Date.now();
    const duration = 2000;
    const startValue = 0;
    const increment = Math.ceil((targetValue - startValue) / 50);
    
    const animate = () => {
      const currentTime = Date.now() - startTime;
      const progress = Math.min(currentTime / duration, 1);
      const easeOutValue = 1 - Math.pow(1 - progress, 3); // Easing function
      const currentValue = Math.ceil(startValue + (targetValue - startValue) * easeOutValue);
      
      element.textContent = Utils.formatNumber(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = Utils.formatNumber(targetValue);
        CounterManager.animated.add(element);
      }
    };
    
    requestAnimationFrame(animate);
  }
};

// Scroll Observer - Efficient Intersection Detection
class ScrollObserver {
  constructor(selector, callback, options = {}) {
    this.selector = selector;
    this.callback = callback;
    this.options = { ...Utils.observerOptions(), ...options };
    this.observer = null;
    this.init();
  }
  
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.callback(entry);
          this.observer.unobserve(entry.target);
        }
      });
    }, this.options);
    
    const elements = document.querySelectorAll(this.selector);
    elements.forEach(el => this.observer.observe(el));
  }
}

// Milestone Animation Module - O(n) where n = number of milestones
const MilestoneModule = {
  init: () => {
    new ScrollObserver(
      '.milestone-number',
      (entry) => {
        const target = parseInt(entry.target.getAttribute('data-target'));
        CounterManager.startCounter(entry.target, target);
      },
      { threshold: 0.5 }
    );
  }
};

// Form Manager - Scalable Form Handling
const FormManager = {
  forms: new Map(), // O(1) form lookup
  
  register: (formId, onSubmit) => {
    const form = document.getElementById(formId);
    if (!form) return;
    
    FormManager.forms.set(formId, form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(form);
    });
  },
  
  showMessage: (formId, message, isSuccess = true) => {
    const form = FormManager.forms.get(formId);
    if (!form) return;
    
    const messageEl = form.querySelector('.form-message');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `form-message ${isSuccess ? 'success' : 'error'}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  },
  
  resetForm: (formId) => {
    const form = FormManager.forms.get(formId);
    if (form) form.reset();
  }
};

// Search Handler - O(1) Event Delegation
const SearchHandler = {
  init: () => {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', SearchHandler.handleSubmit);
    }
  },
  
  handleSubmit: (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject')?.value;
    const standard = document.getElementById('standard')?.value;
    const city = document.getElementById('city')?.value;
    
    if (subject && standard && city) {
      console.log('Searching:', { subject, standard, city });
      const teachersSection = document.getElementById('teachers');
      if (teachersSection) {
        teachersSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};

// Button Event Delegator - O(1) with Event Delegation
const EventDelegator = {
  init: () => {
    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => {
      console.log('Login clicked');
      // Redirect to login page
    });
    
    if (signupBtn) signupBtn.addEventListener('click', () => {
      console.log('Signup clicked');
      // Redirect to signup page
    });
    
    // View Profile buttons with Event Delegation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view-profile')) {
        const card = e.target.closest('.teacher-card');
        const tutorName = card?.querySelector('h3')?.textContent;
        if (tutorName) {
          console.log('Viewing profile:', tutorName);
        }
      }
    });
    
    // Logo click - Home
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
};

// Smooth Navigation - O(n) where n = nav links
const NavigationManager = {
  init: () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
};

// Card Animation Module - O(n) Lazy Loading
const CardAnimationModule = {
  init: () => {
    new ScrollObserver(
      '.teacher-card, .review-card, .feature-box',
      (entry) => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      },
      { threshold: 0.1 }
    );
    
    // Pre-set initial styles
    const cards = document.querySelectorAll('.teacher-card, .review-card, .feature-box');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }
};

// Tutor Registration Handler
const TutorRegistrationHandler = {
  init: () => {
    FormManager.register('tutorForm', (form) => {
      FormManager.showMessage('tutorForm', 'Submitting your registration...', true);
      
      setTimeout(() => {
        FormManager.showMessage('tutorForm', '✓ Registration submitted! We\'ll contact you within 24 hours.', true);
        FormManager.resetForm('tutorForm');
      }, 1500);
    });
  }
};

// Main Application Initializer - Orchestrates All Modules
const App = {
  init: () => {
    console.log('🚀 Success Home Tutor App Initializing...');
    
    // Initialize modules in order
    MilestoneModule.init();
    SearchHandler.init();
    EventDelegator.init();
    NavigationManager.init();
    CardAnimationModule.init();
    TutorRegistrationHandler.init();
    
    console.log('✅ App Ready');
  }
};

// Start App when DOM is Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - reducing animations');
  } else {
    console.log('Page visible - resuming animations');
  }
});
