/**
 * VISSTYA AI - Core Application Router & UI Interactions
 */

// Global Smooth Page Navigation
window.smoothNavigate = function (url, customMessage) {
  let overlay = document.getElementById('page-transition-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="transition-spinner"></div>
      <div class="transition-text" id="transition-message">ENCRYPTING & TRANSITIONING...</div>
    `;
    document.body.appendChild(overlay);
  }

  const messageEl = document.getElementById('transition-message');
  if (messageEl && customMessage) {
    messageEl.textContent = customMessage;
  }

  overlay.classList.add('active');

  setTimeout(() => {
    window.location.href = url;
  }, 400);
};

// Force manual scroll restoration so browsers don't stay scrolled down on page load/transition
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  // Ensure page starts at top on load (unless navigating to a specific #hash section)
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  // Enforce login check on analysis page view
  if (window.location.pathname.endsWith('analysis.html')) {
    const isAuth = localStorage.getItem('visstya_authenticated') === 'true';
    if (!isAuth) {
      window.location.href = 'login.html?returnTo=index.html%23audit-section';
      return;
    }
  }

  // Bind all smooth transition links
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        // Intercept navigation to protected analysis pages if not authenticated
        const isAuth = localStorage.getItem('visstya_authenticated') === 'true';
        if (!isAuth && (href.includes('analysis') || href.includes('report'))) {
          e.preventDefault();
          window.smoothNavigate('login.html?returnTo=index.html%23audit-section', 'AUTHENTICATION REQUIRED // LOGIN TO ACCESS AUDIT');
          return;
        }

        e.preventDefault();
        const targetPage = href;

        let msg = 'LOADING DOSSIER NODE...';
        if (targetPage.includes('login')) msg = 'INITIALIZING SECURITY CLEARANCE GATE';
        else if (targetPage.includes('index')) msg = 'RETURNING TO ARCHIVAL LANDING STAGE';
        else if (targetPage.includes('analysis')) msg = 'LAUNCHING FORENSIC ANALYZER ENGINE';
        else if (targetPage.includes('report')) msg = 'OPENING TRUST REPORT DOSSIER';
        else if (targetPage.includes('archive')) msg = 'RETRIEVING GLOBAL VERIFICATION ARCHIVES';
        else if (targetPage.includes('directives')) msg = 'ACCESSING LEGAL OPERATIONAL DIRECTIVES';
        
        window.smoothNavigate(targetPage, msg);
      });
    }
  });

  // Forensic Audit Initiation form / button listener
  const initiateBtn = document.getElementById('initiate-audit-btn');
  const urlInput = document.getElementById('source-url-input');

  if (urlInput && initiateBtn) {
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        initiateBtn.click();
      }
    });
  }

  if (initiateBtn) {
    initiateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isAuth = localStorage.getItem('visstya_authenticated') === 'true';

      // If user is NOT authenticated, redirect to login first!
      if (!isAuth) {
        window.smoothNavigate('login.html?returnTo=index.html%23audit-section', 'AUTHENTICATION REQUIRED // PLEASE LOGIN FIRST');
        return;
      }

      initiateBtn.style.opacity = '0.7';
      initiateBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin">sync</span>
        INITIATING AUDIT...
      `;

      setTimeout(() => {
        localStorage.removeItem('visstya_audit_complete');
        window.smoothNavigate('analysis.html', 'INITIATING FORENSIC AUDIT // CASE #882-ALPHA');
      }, 700);
    });
  }

  // Quick Action Buttons
  document.querySelectorAll('.btn-new-analysis').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const isAuth = localStorage.getItem('visstya_authenticated') === 'true';
      if (!isAuth) {
        e.preventDefault();
        window.smoothNavigate('login.html?returnTo=index.html%23audit-section', 'AUTHENTICATION REQUIRED // PLEASE LOGIN FIRST');
      } else {
        localStorage.removeItem('visstya_audit_complete');
        window.smoothNavigate('index.html#audit-section', 'PREPARING NEW ANALYSIS INPUT');
      }
    });
  });

  // Remove overlay on page render
  const overlay = document.getElementById('page-transition-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
});
