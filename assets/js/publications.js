// Filter the existing bibliography locally; the full list remains usable without JavaScript.
(() => {
  const form = document.querySelector('.publication-filters');
  const list = document.getElementById('publication-results');
  if (!form || !list) return;

  const query = form.querySelector('[name="query"]');
  const type = form.querySelector('[name="type"]');
  const year = form.querySelector('[name="year"]');
  const status = document.getElementById('publication-status');
  const empty = document.getElementById('publication-empty');
  const normalize = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const rows = [...list.querySelectorAll('.bibliography-item')].map(element => ({
    element,
    text: normalize(element.querySelector('h3').textContent + ' ' + element.querySelector('.paper-authors').textContent),
    type: element.dataset.type,
    year: element.dataset.year
  }));
  const sections = [...list.querySelectorAll('.publication-year')].map(element => ({
    element,
    rows: [...element.querySelectorAll('.bibliography-item')],
    link: list.querySelector('.year-nav a[href="#' + element.getAttribute('aria-labelledby') + '"]')
  }));

  function update() {
    const words = normalize(query.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    rows.forEach(row => {
      const matches = words.every(word => row.text.includes(word)) &&
        (!type.value || row.type === type.value) && (!year.value || row.year === year.value);
      row.element.hidden = !matches;
      if (matches) count++;
    });
    sections.forEach(section => {
      section.element.hidden = !section.rows.some(row => !row.hidden);
      if (section.link) section.link.hidden = section.element.hidden;
    });
    status.textContent = `${count} of ${rows.length} publications shown`;
    empty.hidden = count !== 0;
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.querySelector('button').addEventListener('click', () => {
    form.reset();
    update();
    query.focus();
  });
  update();
  form.hidden = false;
  status.hidden = false;
})();
