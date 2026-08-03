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

