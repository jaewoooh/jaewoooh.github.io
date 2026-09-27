function initPortrait(initials) {
  const portrait = new Image(264, 339);
  portrait.alt = initials.dataset.alt;
  portrait.decoding = 'async';
  portrait.fetchPriority = 'high';

  portrait.addEventListener('load', () => {
    const frame = document.createElement('span');
    frame.className = 'profile-photo';
    frame.append(portrait);
    initials.replaceWith(frame);
  }, { once: true });

  portrait.src = initials.dataset.photo;
}

function initProjects(section) {
  const filter = section.querySelector('#project-filter');
  const order = section.querySelector('#project-order');
  const archive = section.querySelector('#dated-projects');
  const projects = [...section.querySelectorAll('[data-category]')];
  const groups = [...section.querySelectorAll('.foundation, .year-group')];
  const announcement = section.querySelector('#archive-announcement');
  const empty = section.querySelector('#archive-empty');
  let previousFilter;

  function filterProjects() {
    for (const project of projects) {
      const categories = project.dataset.category.split(' ');
      project.hidden = filter.value !== 'all' && !categories.includes(filter.value);
    }

    for (const group of groups) {
      group.hidden = !group.querySelector('[data-category]:not([hidden])');
    }

    const count = projects.filter(project => !project.hidden).length;
    empty.hidden = count > 0;
    announcement.textContent = announcement.dataset.label.replace('{count}', count);
  }

  function sortProjects() {
    const direction = order.value === 'asc' ? 1 : -1;
    const years = [...archive.children];
    years.sort((a, b) => (Number(a.dataset.year) - Number(b.dataset.year)) * direction);
    archive.append(...years);
  }

  filter.addEventListener('change', filterProjects);
  order.addEventListener('change', sortProjects);

  window.addEventListener('beforeprint', () => {
    previousFilter = filter.value;
    filter.value = 'all';
    filterProjects();
  });

  window.addEventListener('afterprint', () => {
    if (previousFilter === undefined) return;
    filter.value = previousFilter;
    filterProjects();
  });

  filterProjects();
  sortProjects();
}

function initNavigation(nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash));
  let scheduled = false;

  function updateSection() {
    let current = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 155) current = section;
    }

    for (const link of links) {
      if (link.hash === `#${current.id}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    scheduled = false;
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateSection);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateSection();
}

function revealHashTarget() {
  let id;

  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(id);

  for (let parent = target?.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
}

initPortrait(document.querySelector('.monogram'));
initProjects(document.querySelector('#projects'));
initNavigation(document.querySelector('.nav'));

for (const button of document.querySelectorAll('.print-btn')) {
  button.addEventListener('click', () => window.print());
}

window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();
