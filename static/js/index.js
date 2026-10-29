document.documentElement.classList.add('js');

// Mask pill: hover to preview distraction mask
document.querySelectorAll('.mask-pill').forEach(pill => {
  const card = pill.closest('.has-mask');
  const img  = card.querySelector('.main-img');
  const predSrc = img.src;
  const maskSrc = img.dataset.mask;

  pill.addEventListener('mouseenter', () => {
    img.src = maskSrc;
    pill.classList.add('active');
  });
  pill.addEventListener('mouseleave', () => {
    img.src = predSrc;
    pill.classList.remove('active');
  });
});
const POPUP_HTML = `<span class="f1star-popup"><strong>F1* score</strong> excludes distraction pixels from the evaluation. Only pixels where the distraction mask M&nbsp;=&nbsp;0 are considered. This way models are neither rewarded nor penalized for detecting the distraction itself.<br><br><code>F1* = 2·TP / (2·TP + FP + FN)</code><br><em>(computed only over non-distraction pixels)</em></span>`;

document.querySelectorAll('.score-badge').forEach(el => {
  el.classList.add('f1star-trigger');
  el.insertAdjacentHTML('beforeend', POPUP_HTML);
});

// Masking switch (small screens): choose which of the three masking columns is shown
document.querySelectorAll('.visual-results').forEach(group => {
  const buttons = group.querySelectorAll('.mode-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      group.dataset.mode = btn.dataset.mode;
      buttons.forEach(b => b.classList.toggle('is-active', b === btn));
    });
  });
});

// Navbar layout + sticky offsets: the grid header sits below the navbar, the model label below the grid header
const nav = document.querySelector('.top-nav');
function updateNavLayout() {
  if (!nav) return;
  // center brand and links once the links no longer fit next to the brand
  const brand = nav.querySelector('.navbar-brand');
  const menu  = nav.querySelector('.navbar-menu');
  nav.classList.remove('is-wrapped');
  if (brand && menu && menu.offsetTop >= brand.offsetTop + brand.offsetHeight - 1) nav.classList.add('is-wrapped');
}
function updateStickyOffsets() {
  updateNavLayout();
  if (nav) document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
  document.querySelectorAll('.comparison-group').forEach(group => {
    const head = group.querySelector('.sticky-head');
    if (head) group.style.setProperty('--head-h', `${head.offsetHeight}px`);
  });
}
updateStickyOffsets();
window.addEventListener('resize', updateStickyOffsets);
window.addEventListener('load', updateStickyOffsets);

// Results dropdown: close after a choice, even while the mouse still hovers it
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  dropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.add('is-closed');
      link.blur();
    });
  });
  dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('is-closed'));
});

// "Citation" in the navbar: show the takeaways together with the citation
const citationLink = document.querySelector('.top-nav a[href="#citation"]');
const takeaways = document.querySelector('.takeaways');
if (citationLink && takeaways) {
  citationLink.addEventListener('click', e => {
    e.preventDefault();
    takeaways.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#citation');
  });
}

// Citation copy button
const copyBtn = document.querySelector('.copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = document.querySelector('.bibtex-block code').textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // fallback for browsers that block the clipboard API (e.g. some file:// pages)
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = '<i class="far fa-copy"></i>';
    }, 1600);
  });
}

