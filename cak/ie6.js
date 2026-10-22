// Wraps the page in an Internet Explorer 6 window: title bar, menus,
// toolbar, address bar and status bar. Without JS the page still works.
(function () {
  var monitor = document.getElementById('crt-monitor');
  var page = monitor && monitor.querySelector('.crt');
  if (!page) return;

  // Where each page lived originally.
  var origins = {
    'index.html': 'http://www.cin.ufpe.br/~cak/',
    'arthur.html': 'http://www.cin.ufpe.br/~cak/arthur.html',
    'familia.html': 'http://www.cin.ufpe.br/~cak/familia.html',
    'gabriela.html': 'http://www.cin.ufpe.br/~cak/gabriela.html',
    'publications.html': 'http://www.cin.ufpe.br/~cak/publications/index.html'
  };
  var file = location.pathname.split('/').pop() || 'index.html';
  var url = origins[file] || 'http://www.cin.ufpe.br/~cak/';

  var icons = {
    back: '<svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#2e9e2e" stroke="#155f15"/><path d="M5 11l6-6v4h6v4h-6v4z" fill="#fff"/></svg>',
    forward: '<svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#2e9e2e" stroke="#155f15"/><path d="M17 11l-6-6v4H5v4h6v4z" fill="#fff"/></svg>',
    stop: '<svg viewBox="0 0 22 22"><path d="M4 2h11l4 4v14H4z" fill="#fff" stroke="#666"/><circle cx="11.5" cy="12" r="6" fill="#d22"/><path d="M9 9.5l5 5M14 9.5l-5 5" stroke="#fff" stroke-width="2"/></svg>',
    refresh: '<svg viewBox="0 0 22 22"><path d="M4 2h11l4 4v14H4z" fill="#fff" stroke="#666"/><path d="M15 9a4.5 4.5 0 1 0 0 5" fill="none" stroke="#2e9e2e" stroke-width="2.2"/><path d="M13 6.5l4 2.5-4 2z" fill="#2e9e2e"/></svg>',
    home: '<svg viewBox="0 0 22 22"><path d="M2 11L11 3l9 8" fill="none" stroke="#7a3b10" stroke-width="2"/><path d="M5 10v10h12V10l-6-5z" fill="#f4e3a1" stroke="#7a3b10"/><path d="M9 20v-6h4v6" fill="#a0522d"/></svg>',
    page: '<svg viewBox="0 0 14 14"><path d="M2 1h7l3 3v9H2z" fill="#fff" stroke="#555"/><circle cx="7" cy="8" r="3" fill="#3a7bd5"/></svg>',
    go: '<svg viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" fill="#2e9e2e" stroke="#155f15"/><path d="M3 7h6M7 4l3 3-3 3" stroke="#fff" stroke-width="1.6" fill="none"/></svg>',
    globe: '<svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#3a7bd5" stroke="#1d4f9a"/><path d="M3 5c2 1 3-1 4 1s-1 3 1 4M8 2c1 1 0 2 2 2" stroke="#3c3" stroke-width="1.5" fill="none"/></svg>'
  };

  function el(cls, html) {
    var div = document.createElement('div');
    div.className = cls;
    div.innerHTML = html;
    return div;
  }

  function button(id, label, icon) {
    return '<button type="button" class="ie-tbtn" data-act="' + id + '">' + icon + '<span>' + label + '</span></button>';
  }

  var title = el('ie-titlebar',
    '<span class="ie-title"></span>' +
    '<button type="button" class="ie-winbtn min" aria-label="Minimize"></button>' +
    '<button type="button" class="ie-winbtn max" aria-label="Maximize"></button>' +
    '<button type="button" class="ie-winbtn close" data-act="close" aria-label="Close"></button>');
  title.querySelector('.ie-title').textContent = document.title.trim() + ' - Microsoft Internet Explorer';

  var menu = el('ie-menubar',
    '<span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>' +
    '<span class="ie-flag"></span>');

  var toolbar = el('ie-toolbar',
    button('back', 'Back', icons.back) +
    button('forward', 'Forward', icons.forward) +
    button('stop', 'Stop', icons.stop) +
    button('refresh', 'Refresh', icons.refresh) +
    button('home', 'Home', icons.home));
  toolbar.insertBefore(el('ie-sep', ''), toolbar.children[2]);

  var address = el('ie-address',
    '<label>Address</label><span class="ie-url">' + icons.page + '<span></span></span>' +
    '<span class="ie-go">' + icons.go + 'Go</span>');
  address.querySelector('.ie-url > span').textContent = url;

  var status = el('ie-status',
    '<span class="ie-msg">' + icons.page + '<span>Done</span></span>' +
    '<span class="ie-zone">' + icons.globe + 'Internet</span>');
  var message = status.querySelector('.ie-msg > span');

  // Flex `order` places these around the page regardless of DOM position.
  [title, menu, toolbar, address, status].forEach(function (part) {
    monitor.insertBefore(part, page);
  });
  monitor.classList.add('has-ie');

  monitor.addEventListener('click', function (e) {
    var target = e.target.closest('[data-act]');
    if (!target) return;
    var act = target.getAttribute('data-act');
    if (act === 'back') history.back();
    else if (act === 'forward') history.forward();
    else if (act === 'refresh') location.reload();
    else if (act === 'home') location.href = './';
    else if (act === 'close') location.href = '/';
  });

  // Like the real thing, hovering a link shows where it goes.
  page.addEventListener('mouseover', function (e) {
    var link = e.target.closest('a[href]');
    message.textContent = link ? link.href : 'Done';
  });
  page.addEventListener('mouseleave', function () {
    message.textContent = 'Done';
  });

  // Old pages that have since been taken down: show an error instead of leaving.
  var dead = [
    /^www\.cin\.ufpe\.br\/~cak\//,
    /^www\.di\.ufpe\.br\//,
    /(^|\.)cefetpb\.br\//
  ];

  function isDead(link) {
    if (!/^https?:$/.test(link.protocol)) return false;
    var where = link.hostname + link.pathname;
    return dead.some(function (re) { return re.test(where); });
  }

  var dialog = el('ie-dialog',
    '<div class="ie-dialog-box" role="alertdialog" aria-modal="true" aria-labelledby="ie-dialog-title" aria-describedby="ie-dialog-text">' +
    '<div class="ie-dialog-title" id="ie-dialog-title">Microsoft Internet Explorer</div>' +
    '<div class="ie-dialog-body">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#d22" stroke="#800"/><path d="M10 10l12 12M22 10L10 22" stroke="#fff" stroke-width="3.5"/></svg>' +
    '<p id="ie-dialog-text">The page cannot be displayed.<br><br>' +
    '<span class="ie-dialog-url"></span> is no longer available. It was taken down long ago.</p>' +
    '</div>' +
    '<button type="button" class="ie-dialog-ok">OK</button>' +
    '</div>');
  var dialogUrl = dialog.querySelector('.ie-dialog-url');
  var ok = dialog.querySelector('.ie-dialog-ok');
  var lastFocus = null;
  monitor.appendChild(dialog);

  function closeDialog() {
    monitor.classList.remove('ie-alert');
    message.textContent = 'Done';
    if (lastFocus) lastFocus.focus();
  }

  page.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link || !isDead(link)) return;
    e.preventDefault();
    lastFocus = link;
    dialogUrl.textContent = link.href;
    message.textContent = 'Cannot find server';
    monitor.classList.add('ie-alert');
    ok.focus();
  });

  ok.addEventListener('click', closeDialog);
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      closeDialog();
    }
  });
})();
