/**
 * VISSTYA AI - Real-Time Forensic Case Analysis Engine
 * Animates live evidence matrix stream and updates module progress bars.
 * Implements AUDIT GATE LOCK: module tabs are locked until all 4 nodes complete.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. CLEAR PREVIOUS AUDIT STATE ON FRESH LOAD FROM INDEX ────────────────
  // If user arrived via "New Analysis" button, clear the flag
  const referrer = document.referrer;
  if (referrer && (referrer.includes('index.html') || referrer.endsWith('vai1/'))) {
    localStorage.removeItem('visstya_audit_complete');
  }

  // ─── 2. BACKGROUND DATA STREAM MATRIX ──────────────────────────────────────
  const streamContainer = document.getElementById('bg-stream');
  if (streamContainer) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/[]{}:;-_=+<>';
    const generateData = () => {
      let output = '';
      for (let i = 0; i < 4000; i++) {
        output += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i % 120 === 0) output += '<br>';
      }
      streamContainer.innerHTML = output;
    };
    generateData();
    setInterval(generateData, 2200);
  }

  // ─── 3. TOAST NOTIFICATION HELPER ──────────────────────────────────────────
  function showToast(message) {
    let toast = document.getElementById('gate-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3000);
  }

  // ─── 4. MODULE TAB GATE LOCK ────────────────────────────────────────────────
  const moduleLinks = document.querySelectorAll('.module-nav-link');
  let auditComplete = localStorage.getItem('visstya_audit_complete') === 'true';

  function applyLockState() {
    moduleLinks.forEach(link => {
      if (!auditComplete) {
        // Show locked visual style
        link.classList.add('opacity-40', 'cursor-not-allowed');
        link.setAttribute('data-locked', 'true');
      } else {
        // Unlock
        link.classList.remove('opacity-40', 'cursor-not-allowed');
        link.removeAttribute('data-locked');
      }
    });
  }

  applyLockState();

  // Intercept clicks on locked module links
  moduleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('data-locked') === 'true') {
        e.preventDefault();
        showToast('ANALYSIS IN PROGRESS // ACCESS LOCKED UNTIL COMPLETE');
      }
    });
  });

  // ─── 5. PROGRESS BAR SIMULATION ────────────────────────────────────────────
  const modules = [
    { id: 'meta',     progress: 42,  target: 100 },
    { id: 'vision',   progress: 68,  target: 100 },
    { id: 'weather',  progress: 15,  target: 100 },
    { id: 'evidence', progress: 89,  target: 100 }
  ];

  let completedModules = 0;

  function showExecutiveSummary() {
    const hub = document.getElementById('analysis-hub');
    const summary = document.getElementById('executive-summary-panel');
    const syncStatus = document.getElementById('sync-status');

    if (hub) {
      const hubLabel = hub.querySelector('.font-label-caps');
      if (hubLabel) hubLabel.innerText = 'COMPLETE';
      const hubIcon = hub.querySelector('.material-symbols-outlined');
      if (hubIcon) {
        hubIcon.innerText = 'verified';
        hubIcon.classList.add('text-tertiary-fixed-dim');
      }
    }

    if (summary) {
      summary.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      summary.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      setTimeout(() => {
        summary.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }

    if (syncStatus) {
      syncStatus.innerHTML = `
        <span class="font-bold text-tertiary-fixed-dim">AUDIT COMPLETE // EXECUTIVE SUMMARY &amp; TOTAL SCORE (87/100) GENERATED BELOW</span>
      `;
    }

    // ── Set audit complete flag & unlock module tabs ──
    localStorage.setItem('visstya_audit_complete', 'true');
    auditComplete = true;
    applyLockState();

    if (window.initVisstyaShader) {
      const shaderCanvas = document.getElementById('analysis-summary-shader');
      if (shaderCanvas && !shaderCanvas.dataset.initialized) {
        window.initVisstyaShader('analysis-summary-shader');
        shaderCanvas.dataset.initialized = 'true';
      }
    }
  }

  function updateProgress() {
    modules.forEach((mod) => {
      if (mod.progress < mod.target) {
        mod.progress += Math.random() * 3 + 1;
        if (mod.progress >= 100) {
          mod.progress = 100;
          completedModules++;
        }
        const bar  = document.getElementById(`${mod.id}-progress`);
        const text = document.getElementById(`${mod.id}-percent`);
        if (bar)  bar.style.width  = `${mod.progress}%`;
        if (text) text.innerText   = `${Math.floor(mod.progress)}%`;
      }
    });

    if (completedModules >= 4) {
      clearInterval(progressInterval);
      showExecutiveSummary();
    }
  }

  const progressInterval = setInterval(updateProgress, 600);
});
