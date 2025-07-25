// Performance monitoring utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const measurePerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Wait for the page to be fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      if (import.meta.env.DEV) {
        console.log('Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connect Time: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);
      }

      // Send to analytics in production
      if (import.meta.env.PROD && window.gtag) {
        window.gtag('event', 'page_load_time', {
          value: pageLoadTime,
          event_category: 'performance',
        });
      }
    }, 0);
  });
};

// Web Vitals monitoring
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((vitals) => {
      vitals.onCLS(onPerfEntry);
      vitals.onINP(onPerfEntry);  // INP replaced FID
      vitals.onFCP(onPerfEntry);
      vitals.onLCP(onPerfEntry);
      vitals.onTTFB(onPerfEntry);
    });
  }
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      imgElement.src = imgElement.dataset.src!;
      imgElement.removeAttribute('data-src');
    });
  }
};