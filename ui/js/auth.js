/**
 * VISSTYA AI - Authentication & Agent Clearance System
 */

// ── Apply saved theme IMMEDIATELY (before DOM renders) to prevent flash ──
(function() {
  const savedTheme = localStorage.getItem('visstya_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const biometricBtn = document.getElementById('biometric-btn');
  const authStatus = document.getElementById('auth-status');
  const agentIdInput = document.getElementById('agent-id');
  const passkeyInput = document.getElementById('passkey');

  // Check login state on initial load
  const isAuth = localStorage.getItem('visstya_authenticated') === 'true';
  const userAgentId = localStorage.getItem('visstya_agent_id') || 'AGENT-8824-ALPHA';

  if (window.location.pathname.endsWith('analysis.html') && !isAuth) {
    window.location.href = 'login.html?returnTo=index.html%23audit-section';
    return;
  }

  // Update header UI if user element exists
  const headerUserLabel = document.getElementById('header-agent-id');
  if (headerUserLabel) {
    if (isAuth) {
      headerUserLabel.textContent = userAgentId;
      headerUserLabel.classList.remove('hidden');
    } else {
      headerUserLabel.classList.add('hidden');
    }
  }

  // Handle Biometric scan simulation
  if (biometricBtn) {
    biometricBtn.addEventListener('click', () => {
      biometricBtn.classList.add('animate-pulse', 'border-primary');
      if (authStatus) {
        authStatus.textContent = 'SCANNING BIOMETRIC PRINT... STANDBY';
        authStatus.className = 'font-data-mono text-xs text-primary font-bold animate-pulse';
      }

      setTimeout(() => {
        if (agentIdInput) agentIdInput.value = 'AGENT-8824-ALPHA';
        if (passkeyInput) passkeyInput.value = '••••••••••••';
        if (authStatus) {
          authStatus.textContent = 'BIOMETRIC VERIFIED // ACCESS GRANTED';
          authStatus.className = 'font-data-mono text-xs text-tertiary-fixed-dim font-bold';
        }
        biometricBtn.classList.remove('animate-pulse');

        if (loginForm) {
          setTimeout(() => {
            if (typeof loginForm.requestSubmit === 'function') {
              loginForm.requestSubmit();
            } else {
              loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }, 300);
        }
      }, 1200);
    });
  }

  // Handle Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const agentId = agentIdInput ? agentIdInput.value.trim() : 'AGENT-8824-ALPHA';
      
      if (authStatus) {
        authStatus.textContent = 'AUTHENTICATING CLEARANCE LEVEL...';
        authStatus.className = 'font-data-mono text-xs text-primary font-bold';
      }

      setTimeout(() => {
        localStorage.setItem('visstya_authenticated', 'true');
        localStorage.setItem('visstya_agent_id', agentId || 'AGENT-8824-ALPHA');
        localStorage.removeItem('visstya_audit_complete');

        const params = new URLSearchParams(window.location.search);
        const requestedDestination = params.get('returnTo');
        const destination = requestedDestination && !requestedDestination.startsWith('http')
          ? requestedDestination
          : 'index.html#audit-section';
        const message = 'AUTHENTICATED // ACCESS GRANTED TO FORENSIC STAGE';

        if (window.smoothNavigate) {
          window.smoothNavigate(destination, message);
        } else {
          window.location.href = destination;
        }
      }, 900);
    });
  }
});
