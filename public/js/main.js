// ── MODAL ─────────────────────────────────────────────────────────────────────
function toggleModal(open) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.toggle('open', open);
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleModal(false);
});

// ── COPY TO CLIPBOARD ─────────────────────────────────────────────────────────
function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ Copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('✅ Copied!');
  });
}

// ── TOAST NOTIFICATION ────────────────────────────────────────────────────────
function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 1.5rem; right: 1.5rem;
    background: #2ECC71; color: #fff;
    padding: 0.7rem 1.2rem; border-radius: 8px;
    font-size: 0.88rem; font-weight: 600;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999; animation: fadeIn 0.2s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Auto-dismiss flash messages
setTimeout(() => {
  document.querySelectorAll('.flash').forEach(el => {
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  });
}, 4000);
