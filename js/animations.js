/* ===================================================================
   ANIMATIONS & SCROLL OBSERVERS
   =================================================================== */
(function() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generic reveal
  const revealElements = document.querySelectorAll('[data-reveal]');
  let revealObserver;
  
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    
    document.addEventListener('DOMContentLoaded', () => {
      if (!reducedMotion && revealObserver) {
        revealElements.forEach(el => revealObserver.observe(el));
      } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  window.addEventListener('load', () => {
    // Hero Load
    const hero = document.getElementById('hero');
    if (hero) {
      setTimeout(() => {
        hero.classList.add('is-loaded');
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('is-hidden');
      }, 400);
    }
  });

  // Roadmap Arrow Tracking Logic
  document.addEventListener('DOMContentLoaded', () => {
    const roadmap = document.getElementById('roadmap');
    const roadmapItems = document.querySelectorAll('[data-roadmap-step]');
    const progressLine = document.getElementById('roadmapProgress');
    const arrow = document.getElementById('roadmapArrow');

    if (roadmap && roadmapItems.length > 0 && progressLine && arrow) {
      
      const roadmapObserver = new IntersectionObserver((entries) => {
        let activeIndex = -1;
        
        // Determine the highest visible step
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-roadmap-step'));
            if (stepIndex > activeIndex) activeIndex = stepIndex;
          }
        });
        
        if (activeIndex !== -1) {
          updateRoadmap(activeIndex);
        }
      }, { rootMargin: '-20% 0px -40% 0px', threshold: 0.5 });
      
      roadmapItems.forEach(item => roadmapObserver.observe(item));
      
      function updateRoadmap(activeIndex) {
        roadmapItems.forEach((item, index) => {
          item.classList.remove('is-active', 'is-completed');
          if (index < activeIndex) {
            item.classList.add('is-completed');
          } else if (index === activeIndex) {
            item.classList.add('is-active');
          }
        });
        
        // Calculate progress percentage
        // 0 -> 12.5%, 1 -> 37.5%, 2 -> 62.5%, 3 -> 87.5%
        const percentages = [12.5, 37.5, 62.5, 87.5];
        let targetPercent = percentages[activeIndex] || 0;
        
        // Vertical progress for all screen sizes
        progressLine.style.height = `${targetPercent}%`;
        arrow.style.top = `${targetPercent}%`;
      }
      
      // Update on scroll
      window.addEventListener('scroll', () => {
         // Rely on intersection observer for step activation,
         // the observer triggers updateRoadmap.
      }, {passive: true});
      
      // Initial State
      updateRoadmap(0);
    }
  });

})();
