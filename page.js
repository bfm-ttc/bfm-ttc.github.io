'use strict';

// Keep every video available when JavaScript is disabled.
for (const group of document.querySelectorAll('[data-tabs]')) {
  const list = group.querySelector('.tab-list');
  const tabs = [...list.querySelectorAll('button')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  list.setAttribute('role', 'tablist');

  function selectTab(index) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
      if (!selected) panels[position].querySelectorAll('video').forEach(video => video.pause());
    });
  }

  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowRight': next = (index + 1) % tabs.length; break;
        case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectTab(next);
      tabs[next].focus();
    });
  });
  selectTab(0);
  group.classList.add('tabs-ready');
}

// A new player pauses videos outside its comparison panel.
for (const video of document.querySelectorAll('video')) {
  video.addEventListener('play', () => {
    const panel = video.closest('.tab-panel');
    document.querySelectorAll('video').forEach(other => {
      if (other !== video && (!panel || other.closest('.tab-panel') !== panel)) other.pause();
    });
  });
}
