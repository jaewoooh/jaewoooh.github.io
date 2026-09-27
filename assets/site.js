(() => {
  'use strict';
  const root = document.documentElement;
  const ko = root.lang === 'ko';
  // Use the owner-provided portrait in the shared English/Korean profile header.
  // Keep the initials as a fallback until the local image has loaded successfully.
  const initials = document.querySelector('.identity .monogram');
  if (initials) {
    const portrait = new Image(132, 132);
    portrait.className = 'profile-photo';
    portrait.alt = ko ? '프로필 사진' : 'Profile photograph';
    portrait.loading = 'eager';
    portrait.decoding = 'async';
    portrait.fetchPriority = 'high';
    // Fit the full portrait inside the existing circle without cropping the head or chin.
    portrait.style.objectFit = 'contain';
    portrait.style.objectPosition = 'center';
    portrait.style.padding = 'clamp(3px, 0.6vw, 6px)';
    portrait.style.backgroundColor = '#fff';
    portrait.addEventListener('load', () => initials.replaceWith(portrait), {once: true});
    portrait.src = new URL('assets/profile.webp', document.baseURI).href;
  }
  const theme = document.querySelector('#theme-toggle');
  const updateThemeLabel = () => {
    const isDark = root.dataset.theme === 'dark';
    const label = ko ? (isDark ? '라이트 모드로 전환' : '다크 모드로 전환') : (isDark ? 'Use light theme' : 'Use dark theme');
    if (theme) {theme.setAttribute('aria-label', label); theme.title = label; theme.setAttribute('aria-pressed', String(isDark));}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#111923' : '#ffffff');
  };
  updateThemeLabel();
  theme?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {localStorage.setItem('jaewoo-academic-theme', root.dataset.theme);} catch (_) { /* Storage may be unavailable in private/file contexts. */ }
    updateThemeLabel();
  });
  document.querySelectorAll('.print-btn').forEach(button => button.addEventListener('click', () => window.print()));
  const filter = document.querySelector('#project-filter');
  const sort = document.querySelector('#project-order');
  const archive = document.querySelector('#dated-projects');
  const groups = Array.from(document.querySelectorAll('.year-group'));
  const foundation = document.querySelector('#foundations');
  const announce = document.querySelector('#archive-announcement');
  function updateArchive() {
    const value = filter?.value || 'all';
    let visible = 0;
    document.querySelectorAll('[data-category]').forEach(item => {
      const matches = value === 'all' || item.dataset.category.split(' ').includes(value);
      item.hidden = !matches;
      if (matches) visible++;
    });
    groups.forEach(group => { group.hidden = !Array.from(group.querySelectorAll('.project-item')).some(item => !item.hidden); });
    if (foundation) foundation.hidden = !Array.from(foundation.querySelectorAll('[data-category]')).some(item => !item.hidden);
    const ascending = sort?.value !== 'desc';
    groups.slice().sort((a,b) => (Number(a.dataset.year) - Number(b.dataset.year)) * (ascending ? 1 : -1)).forEach(group => archive?.appendChild(group));
    const empty = document.querySelector('#archive-empty');
    if (empty) empty.hidden = visible > 0;
    if (announce) announce.textContent = ko ? `${visible}개 프로젝트 표시` : `${visible} projects displayed`;
  }
  filter?.addEventListener('change', updateArchive);
  sort?.addEventListener('change', updateArchive);
  updateArchive();
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const targets = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let scheduled = false;
  function updateCurrentSection() {
    let current = targets[0]?.id;
    for (const section of targets) if (section.getBoundingClientRect().top <= 155) current = section.id;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {if (!scheduled) {scheduled = true; requestAnimationFrame(updateCurrentSection);}}, {passive:true});
  window.addEventListener('resize', updateCurrentSection, {passive:true});
  updateCurrentSection();
  // Follow links to material that is inside a collapsed disclosure.
  function revealHashTarget() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    let node = target.parentElement;
    while (node) {if (node.tagName === 'DETAILS') node.open = true; node = node.parentElement;}
  }
  window.addEventListener('hashchange', revealHashTarget);
  revealHashTarget();
  // Printing is a summary CV: filters must not silently omit projects.
  let beforePrintFilter;
  window.addEventListener('beforeprint', () => {beforePrintFilter = filter?.value; if (filter) {filter.value='all';updateArchive();}});
  window.addEventListener('afterprint', () => {if (filter && beforePrintFilter) {filter.value=beforePrintFilter;updateArchive();}});
})();
