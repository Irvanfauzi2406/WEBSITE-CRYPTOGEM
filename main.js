/* ============================================================
   CRYPTO GEM — main.js
   ============================================================ */

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile hamburger ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Counter animation ─────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start.toLocaleString() + suffix;
  }, 16);
}

const counters = document.querySelectorAll('.stat-num[data-target]');
let counted = false;
const heroSection = document.querySelector('.hero');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.target === '340' ? '%' : el.dataset.target === '2400' ? '+' : '+';
        animateCounter(el, target, suffix);
      });
    }
  });
}, { threshold: 0.5 });
if (heroSection) observer.observe(heroSection);

/* ── Event Slider ─────────────────────────────────────────── */
const track  = document.getElementById('track');
const dotsEl = document.getElementById('dots');
const thumbsEl = document.getElementById('thumbs');

if (track) {
  const slides = track.children.length;
  let cur = 0;
  let autoTimer;

  const thumbBg = [
    'linear-gradient(135deg,#0a1628,#1a3a6e)',
    'linear-gradient(135deg,#0d1f3c,#152e55)',
    'linear-gradient(135deg,#0a1a30,#0f2d50)',
    'linear-gradient(135deg,#101828,#1e3050)',
    'linear-gradient(135deg,#0a1628,#162040)'
  ];
  const thumbIcons = ['◆', '◈', '◎', '▲', '⬡'];

  for (let i = 0; i < slides; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);

    const t = document.createElement('div');
    t.className = 'thumb' + (i === 0 ? ' active' : '');
    t.style.background = thumbBg[i];
    t.textContent = thumbIcons[i];
    t.addEventListener('click', () => goTo(i));
    thumbsEl.appendChild(t);
  }

  function goTo(n) {
    cur = n;
    track.style.transform = `translateX(-${cur * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === cur));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo((cur + 1) % slides), 4500);
  }

  document.getElementById('prev').addEventListener('click', () => { goTo((cur - 1 + slides) % slides); resetAuto(); });
  document.getElementById('next').addEventListener('click', () => { goTo((cur + 1) % slides); resetAuto(); });

  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();

  /* Touch/swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? (cur + 1) % slides : (cur - 1 + slides) % slides); resetAuto(); }
  });
}

/* ── Equity Chart ─────────────────────────────────────────── */
const chartCanvas = document.getElementById('equityChart');
if (chartCanvas && typeof Chart !== 'undefined') {
  const datasets = {
    '1M': [100,104,102,108,107,115,112,120,118,125,122,130,128,136,134,142,140,148,145,152,150,158,155,162,160,168,165,172,175,184],
    '3M': [100,105,103,110,108,115,120,118,125,130,128,134,132,140,138,145,150,148,155,160,158,166,164,172,170,178,180,188,185,195],
    '1Y': [100,108,105,115,112,122,130,128,138,145,142,152,150,162,168,175,172,185,190,188,198,205,202,215,220,218,230,238,235,250],
  };

  const equityChart = new Chart(chartCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: datasets['1M'].map((_, i) => i + 1),
      datasets: [{
        data: datasets['1M'],
        borderColor: '#c9a84c',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.42,
        fill: true,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 130);
          g.addColorStop(0, 'rgba(201,168,76,0.2)');
          g.addColorStop(1, 'rgba(201,168,76,0)');
          return g;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,22,40,0.95)',
          borderColor: 'rgba(201,168,76,0.3)',
          borderWidth: 1,
          titleColor: '#e8c96d',
          bodyColor: '#8fa0bb',
          callbacks: { label: v => `Ekuitas: ${Math.round(v.raw)}%` }
        }
      },
      scales: {
        x: { display: false },
        y: {
          display: true,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8fa0bb', font: { size: 10 }, callback: v => v + '%' }
        }
      }
    }
  });

  document.querySelectorAll('.ctab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.key;
      equityChart.data.labels = datasets[key].map((_, i) => i + 1);
      equityChart.data.datasets[0].data = datasets[key];
      equityChart.update();
    });
  });
}

/* ── Trade Journal Table ──────────────────────────────────── */
const trades = [
  { coin: '$EIGEN', dot: '#7ba8e0', action: 'BUY',  entry: '$3.20',       exit: '$6.80',      pnl: '+$1,840', roi: '+112%', pos: true  },
  { coin: '$STRK',  dot: '#4caf8a', action: 'SELL', entry: '$0.48',       exit: '$0.94',      pnl: '+$920',   roi: '+96%',  pos: true  },
  { coin: '$PEPE',  dot: '#e8c96d', action: 'SELL', entry: '$0.000012',   exit: '$0.000054',  pnl: '+$4,200', roi: '+347%', pos: true  },
  { coin: '$ALT',   dot: '#afa9ec', action: 'BUY',  entry: '$0.32',       exit: '$0.28',      pnl: '-$240',   roi: '-12%',  pos: false },
  { coin: '$TIA',   dot: '#5dcaa5', action: 'SELL', entry: '$5.10',       exit: '$9.80',      pnl: '+$2,350', roi: '+92%',  pos: true  },
  { coin: '$W',     dot: '#f08080', action: 'BUY',  entry: '$0.55',       exit: '$0.48',      pnl: '-$175',   roi: '-13%',  pos: false },
];

const tbody = document.getElementById('tradeRows');
if (tbody) {
  trades.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="coin-cell"><div class="coin-dot" style="background:${t.dot}"></div>${t.coin}</div></td>
      <td><span class="${t.action === 'BUY' ? 'badge-buy' : 'badge-sell'}">${t.action}</span></td>
      <td class="td-muted">${t.entry}</td>
      <td class="td-muted">${t.exit}</td>
      <td class="${t.pos ? 'pnl-pos' : 'pnl-neg'}">${t.pnl}</td>
      <td class="${t.pos ? 'pnl-pos' : 'pnl-neg'}">${t.roi}</td>`;
    tbody.appendChild(tr);
  });
}

/* ── Scroll-reveal animation ──────────────────────────────── */
const revealEls = document.querySelectorAll('.port-card, .ach-card, .member-card, .pnl-metric');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObs.observe(el);
});
