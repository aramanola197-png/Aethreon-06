/* AETHREON IQ — vanilla JS client */
(function () {
  'use strict';

  // ─── Storage / session ──────────────────────────────────────────────
  const LS = {
    cid: 'aiq.cid',
    avatar: 'aiq.avatar',
    theme: 'aiq.theme',
    anim: 'aiq.anim',
    notif: 'aiq.notif',
    lastResult: (page) => `aiq.last.${page}`,
  };
  function uid() { return 'aiq_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  let CID = localStorage.getItem(LS.cid);
  if (!CID) { CID = uid(); localStorage.setItem(LS.cid, CID); }

  // ─── Fetch helper ────────────────────────────────────────────────────
  async function api(path, opts = {}) {
    const headers = Object.assign({ 'x-client-id': CID, 'Content-Type': 'application/json' }, opts.headers || {});
    const res = await fetch(path, Object.assign({}, opts, { headers }));
    const data = await res.json().catch(() => ({ ok: false, message: 'Invalid response' }));
    if (!res.ok || data.ok === false) {
  throw new Error(
    'AETHREON could not locate this STX address.'
  );
}
    return data;
  }

  // ─── Toast ───────────────────────────────────────────────────────────
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastMsg.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => toastEl.hidden = true, 320); }, 3200);
  }

  // ─── Sidebar (mobile) ────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('sidebar-scrim');
  const hamb = document.getElementById('hamburger');
  function openSidebar() { sidebar?.classList.add('open'); scrim?.classList.add('open'); }
  function closeSidebar() { sidebar?.classList.remove('open'); scrim?.classList.remove('open'); }
  hamb?.addEventListener('click', openSidebar);
  scrim?.addEventListener('click', closeSidebar);
  sidebar?.addEventListener('click', (e) => { if (e.target.closest('.nav-item')) closeSidebar(); });

  // ─── Panels (close on outside click) ─────────────────────────────────
  const panels = {
  'notif-panel': document.getElementById('notif-panel'),
  'control-panel': document.getElementById('control-panel'),
  'ai-terminal': document.getElementById('ai-terminal'),
};
const openers = {
  'notif-panel': document.getElementById('notif-btn'),
  'control-panel': document.getElementById('control-btn'),
  'ai-terminal': document.getElementById('fab-ai'),
};
  function openPanel(id) {
    Object.entries(panels).forEach(([k, el]) => { if (el && k !== id) el.hidden = true; });
    const p = panels[id]; if (!p) return;
    p.hidden = false;
    if (id === 'notif-panel') renderNotifications();
  }
  function closePanel(id) { const p = panels[id]; if (p) p.hidden = true; }
  Object.entries(openers).forEach(([id, btn]) => {
    btn?.addEventListener('click', (e) => { e.stopPropagation(); panels[id].hidden ? openPanel(id) : closePanel(id); });
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      const id = e.target.closest('[data-close]').dataset.close;
      closePanel(id);
      return;
    }
    Object.entries(panels).forEach(([id, el]) => {
      if (el && !el.hidden && !el.contains(e.target) && !openers[id]?.contains(e.target)) closePanel(id);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') Object.keys(panels).forEach(closePanel);
  });

   // ─── Notifications ──────────────────────────────────────────────────
  const notifDot = document.getElementById('notif-dot');
  const notifList = document.getElementById('notif-list');
  async function pushNotif(tag, message) {
    if (localStorage.getItem(LS.notif) === '0') return;
    try { await api('/api/notifications', { method: 'POST', body: JSON.stringify({ tag, message }) }); } catch {}
    if (notifDot) notifDot.hidden = false;
  }
  async function renderNotifications() {
    if (!notifList) return;
    notifList.innerHTML = '<div class="empty-state">Loading…</div>';
    try {
      const { items } = await api('/api/notifications');
      if (!items.length) { notifList.innerHTML = '<div class="empty-state">No Notifications</div>'; if (notifDot) notifDot.hidden = true; return; }
      notifList.innerHTML = items.map(n => `
        <div class="notif-item">
          <h6>${escape(n.tag)}</h6>
          <p>${escape(n.message)}</p>
          <time>${new Date(n.createdAt).toLocaleString()}</time>
        </div>`).join('');
      api('/api/notifications/read-all', { method: 'POST' }).catch(() => {});
      if (notifDot) notifDot.hidden = true;
    } catch (err) {
      notifList.innerHTML = `<div class="empty-state">${escape(err.message)}</div>`;
    }
  }

  // ─── AI Terminal ────────────────────────────────────────────────────
  const aiLog = document.getElementById('ai-log');
  const aiForm = document.getElementById('ai-form');
  const aiInput = document.getElementById('ai-input');
  const aiGreet = document.getElementById('ai-greet');
  let aiGreeted = false;
  function focusAi() {
    if (!aiGreeted) { typeWriter(aiGreet, 'Hello, how can I help you today?'); aiGreeted = true; }
    setTimeout(() => aiInput?.focus(), 220);
  }
  function typeWriter(el, text) {
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const tick = () => {
      if (i >= text.length) return;
      el.textContent += text[i++]; setTimeout(tick, 22);
    };
    tick();
  }
// Ensure your aiForm event handler is fully constructed and handles the server fetch
aiForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const q = aiInput.value.trim();
    if (!q) return;

    // 1. Render user message locally
    aiInput.value = '';
    appendAi('user', q);

    // 2. Safely bridge to your backend API
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: q })
        });

        const data = await response.json();

        if (data.ok) {
            appendAi('bot', data.reply); 
        } else {
            appendAi('bot', '⚠️ Failed to extract intelligence signals.');
        }
    } catch (err) {
        console.error('AI Terminal Error:', err);
        appendAi('bot', '❌ Connection offline. Check backend status.');
    }
}); // 👈 Properly closes your submit event listener block!
  function appendAi(role, text) {
    if (!aiLog) return;
    const div = document.createElement('div');
    div.className = `ai-line ai-line-${role === 'bot' ? 'bot' : 'user'}`;
    div.innerHTML = `<span class="ai-prompt">${role === 'bot' ? '»' : '›'}</span><span></span>`;
    div.lastElementChild.textContent = text;
    aiLog.appendChild(div); aiLog.scrollTop = aiLog.scrollHeight;
  }

   // ─── Settings UI ────────────────────────────────────────────────────
  const animToggle = document.getElementById('anim-toggle');
  if (animToggle) {
    animToggle.checked = localStorage.getItem(LS.anim) !== '0';
    animToggle.addEventListener('change', () => {
      localStorage.setItem(LS.anim, animToggle.checked ? '1' : '0');
      initParticles();
    });
  }
  const notifToggle = document.getElementById('notif-toggle');
  if (notifToggle) {
    notifToggle.checked = localStorage.getItem(LS.notif) !== '0';
    notifToggle.addEventListener('change', () => localStorage.setItem(LS.notif, notifToggle.checked ? '1' : '0'));
  }
// Export quality switch
const exportButtons = document.querySelectorAll('.export-switch button');

if (exportButtons.length) {
  const savedExport = localStorage.getItem('aethreon.export') || 'standard';

  exportButtons.forEach(btn => {
    if (btn.dataset.export === savedExport) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', () => {
      exportButtons.forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      localStorage.setItem('aethreon.export', btn.dataset.export);
    });
  });
}
  // ─── Background particles ───────────────────────────────────────────
  const canvas = document.getElementById('bg-particles');
  let particleAnim;
  function initParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const enabled = localStorage.getItem(LS.anim) !== '0';
    cancelAnimationFrame(particleAnim);
    if (!enabled) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; }
    size(); window.addEventListener('resize', size);
    const N = Math.min(Math.floor((innerWidth * innerHeight) / 28000), 60);
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr,
      r: (Math.random() * 1.2 + 0.4) * dpr,
    }));
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(123,189,232,0.45)';
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      particleAnim = requestAnimationFrame(tick);
    }
    tick();
  }
  initParticles();

  // ─── Utility page logic ─────────────────────────────────────────────
  const utilEl = document.querySelector('[data-util="wallet-intelligence"], [data-util="reputation"], [data-util="compare-wallets"], [data-util="activity"], [data-util="analytics"], [data-util="discover"], [data-util="saved-searches"]');
  if (utilEl) wireUtility(utilEl);

  function wireUtility(root) {
    const util = root.dataset.util;
    const resultEl = root.querySelector('#result');
    const form = root.querySelector('[data-search]');
    const execBtn = form?.querySelector('.search-exec');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        execBtn?.classList.add('searching');
        try {
          const data = await dispatch(util, form);
          render(util, resultEl, data, form);
          await pushNotif(noteTag(util), `${utilLabel(util)} completed successfully.`);
        } catch (err) {
          resultEl.hidden = false;
          resultEl.innerHTML = `<div class="result-card"><p class="error-text">${escape(err.message)}</p></div>`;
          await pushNotif('System', `${utilLabel(util)} failed: ${err.message}`);
        } finally {
          execBtn?.classList.remove('searching');
        }
      });
    }

    if (util === 'activity') {
      root.querySelectorAll('.chip[data-source]').forEach(c => {
        c.addEventListener('click', async () => {
          root.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === c));
          execBtn?.classList.add('searching');
          try {
            const data = await api(`/api/activity?source=${encodeURIComponent(c.dataset.source)}`);
            render('activity', resultEl, data, null);
            await pushNotif('Activity Feed', 'Activity feed refreshed.');
          } catch (err) {
            resultEl.hidden = false;
            resultEl.innerHTML = `<div class="result-card"><p class="error-text">${escape(err.message)}</p></div>`;
          } finally { execBtn?.classList.remove('searching'); }
        });
      });
      // auto-load on entry
      root.querySelector('.chip.active')?.click();
    }

    if (util === 'analytics') {
      document.getElementById('analytics-refresh')?.addEventListener('click', async () => {
        try {
          const data = await api('/api/analytics');
          render('analytics', resultEl, data, null);
          await pushNotif('Analytics', 'Snapshot refreshed.');
        } catch (err) {
          resultEl.hidden = false;
          resultEl.innerHTML = `<div class="result-card"><p class="error-text">${escape(err.message)}</p></div>`;
        }
      });
      document.getElementById('analytics-refresh').click();
    }

    if (util === 'discover') {
      // load default cohort
      (async () => {
        try { const data = await api('/api/discover'); render('discover', resultEl, data, null); }
        catch (err) { resultEl.hidden = false; resultEl.innerHTML = `<div class="result-card"><p class="error-text">${escape(err.message)}</p></div>`; }
      })();
    }

    if (util === 'saved-searches') {
      (async () => {
        try {
          const { items, offline } = await api('/api/saved');
          if (offline) { resultEl.innerHTML = `<div class="result-card"><p class="muted">Persistence offline. Connect MONGODB_URI to enable Saved Searches.</p></div>`; return; }
          if (!items.length) { resultEl.innerHTML = `<div class="result-card"><p class="muted">No saved searches yet. Run any utility and tap Save.</p></div>`; return; }
          resultEl.innerHTML = items.map(it => savedCard(it)).join('');
          resultEl.querySelectorAll('[data-saved]').forEach(card => {
            card.addEventListener('click', (e) => {
              if (e.target.closest('[data-action]')) return;
              const id = card.dataset.saved;
              card.querySelector('.saved-detail')?.toggleAttribute('hidden');
            });
          });
          resultEl.querySelectorAll('[data-action="export"]').forEach(b => {
            b.addEventListener('click', (e) => {
              e.stopPropagation();
              const item = items.find(i => i._id === b.dataset.id);
              if (item) exportCard(item.utility, item.payload, item.label);
            });
          });
          resultEl.querySelectorAll('[data-action="delete"]').forEach(b => {
            b.addEventListener('click', async (e) => {
              e.stopPropagation();
              if (!confirm('Delete this saved search?')) return;
              try { await api(`/api/saved/${b.dataset.id}`, { method: 'DELETE' }); b.closest('[data-saved]').remove(); toast('Deleted.'); }
              catch (err) { toast(err.message); }
            });
          });
        } catch (err) {
          resultEl.innerHTML = `<div class="result-card"><p class="error-text">${escape(err.message)}</p></div>`;
        }
      })();
    }
  }

  function noteTag(u) {
    return ({
      'wallet-intelligence': 'Wallet Search',
      'reputation': 'Reputation Scan',
      'compare-wallets': 'Compare',
      'activity': 'Activity Feed',
      'analytics': 'Analytics',
      'discover': 'Discover',
    })[u] || 'System';
  }
  function utilLabel(u) {
    return ({
      'wallet-intelligence': 'Wallet Intelligence',
      'reputation': 'Reputation scan',
      'compare-wallets': 'Comparison',
      'activity': 'Activity refresh',
      'analytics': 'Analytics snapshot',
      'discover': 'Discover search',
    })[u] || u;
  }

  async function dispatch(util, form) {
    const fd = new FormData(form);
    if (util === 'wallet-intelligence' || util === 'reputation') {
      const q = (fd.get('q') || '').toString().trim().toUpperCase();
      const route = util === 'reputation' ? '/api/reputation/' : '/api/wallet/';
      return api(route + encodeURIComponent(q));
    }
    if (util === 'compare-wallets') {
      const a = (fd.get('a') || '').toString().trim().toUpperCase();
      const b = (fd.get('b') || '').toString().trim().toUpperCase();
      return api(`/api/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
    }
    if (util === 'discover') {
      const q = (fd.get('q') || '').toString().trim();
      return api(`/api/discover${q ? '?q=' + encodeURIComponent(q) : ''}`);
    }
    throw new Error('Unsupported utility');
  }

  // ─── Renderers ───────────────────────────────────────────────────────
  function render(util, el, data, form) {
    el.hidden = false;
    if (util === 'wallet-intelligence' || util === 'reputation') {
      el.innerHTML = profileCard(data.profile, data.address, util);
    } else if (util === 'compare-wallets') {
      el.innerHTML = `<div class="compare-grid">
        ${profileCard(data.a.profile, data.a.address, 'compare-wallets', true)}
        ${profileCard(data.b.profile, data.b.address, 'compare-wallets', true)}
      </div>` + actionRow(util, data);
    } else if (util === 'activity') {
      el.innerHTML = activityBlock(data) + actionRow(util, data);
    } else if (util === 'analytics') {
      el.innerHTML = analyticsBlock(data) + actionRow(util, data);
    } else if (util === 'discover') {
      el.innerHTML = discoverBlock(data) + actionRow(util, data);
    }
    wireActions(util, el, data, form);
  }

  function profileCard(profile, address, util, embedded) {
    const u = profile.user || {};
    const name = u.displayName || u.name || u.username || profile.displayName || 'Unknown Contributor';
    const tags = (profile.tags || []).map(t => `<span class="tag">${escape(t)}</span>`).join('');
    const sig = profile.signals || {};
    const br = profile.breakdown || {};
    const max = { contribution: 200, governance: 200, consistency: 200, credibility: 200, economic: 200 };
    const bar = (k) => `
      <div class="bar-row">
        <span class="bar-k">${escape(k)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, (br[k] / max[k]) * 100).toFixed(0)}%"></div></div>
        <span class="bar-v">${Math.round(br[k] || 0)}</span>
      </div>`;
    return `<div class="result-card" data-profile>
      <div class="dossier-head">
        <div>
          <h3 class="dossier-name">${escape(name)}</h3>
          <div class="dossier-addr">${escape(address || '')}</div>
        </div>
        <div class="score-block">
          <div class="score-num">${profile.score}</div>
          <div class="tier">${escape(profile.tier)}</div>
        </div>
      </div>
      <div class="tag-row">${tags || '<span class="tag">No tags yet</span>'}</div>
      <div class="signal-grid">
        ${signalTile('Bounties', sig.bounties)}
        ${signalTile('Gigs', sig.gigs)}
        ${signalTile('Quests', sig.quests)}
        ${signalTile('Grants', sig.grants)}
        ${signalTile('Events', sig.events)}
        ${signalTile('Reviews', sig.reviews)}
        ${signalTile('Rating', sig.rating?.toFixed?.(2) ?? sig.rating)}
        ${signalTile('Days Active', sig.daysActive)}
      </div>
      <div class="breakdown">
        ${bar('contribution')}${bar('governance')}${bar('consistency')}${bar('credibility')}${bar('economic')}
      </div>
      ${embedded ? '' : actionRow(util, { profile, address })}
    </div>`;
  }
  function signalTile(k, v) { return `<div class="signal"><div class="signal-k">${escape(k)}</div><div class="signal-v">${escape(v ?? 0)}</div></div>`; }

  function activityBlock(data) {
    return (data.results || []).map(r => `
      <div class="activity-section">
        <h4>${escape(r.source)} <span class="muted small">· ${r.items?.length || 0}</span></h4>
        <div class="activity-list">
          ${(r.items || []).slice(0, 8).map(i => `
            <div class="activity-item">
              <h5>${escape(i.title || i.name || i.slug || (i.category ? i.category + ' Item' : 'Grant Activity'))}</h5>
              ${i.description ? `<p>${escape(String(i.description).slice(0, 160))}</p>` : ''}
              <span class="activity-meta">${escape(i.status || i.category || i.organization?.name || '')}</span>
            </div>`).join('') || '<div class="empty-state">No items</div>'}
        </div>
      </div>`).join('');
  }
  function analyticsBlock(data) {
    const tiles = [];
    const fmt = (v) => v === null || v === undefined ? '—' : typeof v === 'number' ? v.toLocaleString() : String(v);
    const pct = (v) => v === null || v === undefined ? '—' : Number(v).toFixed(1) + '%';
    const usd = (v) => v === null || v === undefined ? '—' : '$' + (Number(v) / 1e6).toFixed(2) + 'M';
    const push = (icon, k, v, note) => {
      if (v === null || v === undefined || v === '' || v === '—') return;
      tiles.push(`<div class="stat-tile">
        <div class="stat-icon">${icon}</div>
        <div class="stat-k">${escape(k)}</div>
        <div class="stat-v">${escape(String(v))}</div>
        ${note ? `<div class="stat-note">${escape(note)}</div>` : ''}
      </div>`);
    };

    // Real API data structure from ZAD responses
    const p  = data.platform || {};   // /stats → { gigs, bounties, quests, events, degrants, tokens, sipIds, tveUsd }
    const u  = data.users    || {};   // /users/stats → totalUsers, activeUsers, profileCompleteness[], topInterests[]
    const g  = data.gigs     || {};   // /gigs/stats → overview{}, financial{}, rates{}, distributions{}
    const q  = data.quests   || {};   // /quest/stats → totalQuests, activeQuests, completedQuests, expiredQuests, totalParticipants
    const s  = data.sips     || {};   // /sips/stats → githubSipsFromGitHubSource, gitHubSipRowsTotal, cabVoting{}, cabGroups

    // ── Platform overview ──
    push('📊', 'Total Gigs',        fmt(p.gigs ?? g.overview?.totalGigs));
    push('🎯', 'Total Bounties',    fmt(p.bounties));
    push('🗺️', 'Total Quests',      fmt(p.quests ?? q.totalQuests));
    push('🎪', 'Total Events',      fmt(p.events));
    push('🏦', 'DeGrants Issued',   fmt(p.degrants));
    push('🪙', 'Tokens Tracked',    fmt(p.tokens));
    push('💰', 'Total Value Locked', usd(p.tveUsd), 'ecosystem TVE');

    // ── Gig intelligence ──
    push('✅', 'Gigs Completed',    fmt(g.overview?.completedGigs));
    push('⚡', 'Gigs Active',       fmt(g.overview?.activeGigs));
    push('🔄', 'Recent Gig Activity', fmt(g.overview?.recentActivity), 'last 30 days');
    push('👥', 'Unique Clients',    fmt(g.overview?.uniqueClients));
    push('🔨', 'Unique Workers',    fmt(g.overview?.uniqueWorkers));
    push('📈', 'Completion Rate',   pct(g.rates?.completionRate));
    push('⚔️', 'Dispute Rate',      pct(g.rates?.disputeRate));
    push('🏁', 'Total Milestones',  fmt(g.overview?.totalMilestones));

    // ── Quest intelligence ──
    push('🗺️', 'Active Quests',     fmt(q.activeQuests));
    push('✅', 'Quests Completed',  fmt(q.completedQuests));
    push('⏱️', 'Quests Expired',    fmt(q.expiredQuests));
    push('🙋', 'Quest Participants', fmt(q.totalParticipants));

    // ── Governance / SIPs ──
    push('📜', 'Total SIPs',        fmt(s.githubSipsFromGitHubSource ?? s.gitHubSipRowsTotal));
    push('🗳️', 'CAB Voting Open',   fmt(s.cabVoting?.openInstances));
    push('🔒', 'CAB Voting Closed', fmt(s.cabVoting?.closedInstances));
    push('🏛️', 'CAB Groups',        fmt(s.cabGroups));

    // ── Users ──
    push('👤', 'Platform Users',    fmt(u.totalUsers ?? u.total));
    push('🟢', 'Active Users',      fmt(u.activeUsers ?? u.active));

    const timestamp = `<div class="analytics-ts">⏱ Snapshot at ${new Date().toLocaleTimeString()}</div>`;
    return `<div class="result-card">
      ${timestamp}
      <div class="stat-grid">${tiles.join('') || '<div class="empty-state">No analytics data returned — tap Refresh to retry</div>'}</div>
    </div>`;
  }
  function discoverBlock(data) {
    const items = data.items || [];
    if (!items.length) return `<div class="result-card"><div class="empty-state">No contributors found</div></div>`;
    return `<div class="result-card"><div class="contrib-grid">${items.slice(0, 24).map(u => {
      const addr = u.stxAddress || u.address || u.wallet || '';
      const name = u.displayName || u.name || u.username || addr.slice(0, 8);
      return `<div class="contrib-card" data-addr="${escape(addr)}">
        <div class="contrib-name">${escape(name)}</div>
        <div class="contrib-addr">${escape(addr || '—')}</div>
      </div>`;
    }).join('')}</div></div>`;
  }

  function actionRow(util, payload) {
    return `<div class="action-row">
      <button class="btn-action" data-action="save" data-util="${util}">
        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 3h12v18l-6-4-6 4z"/></svg> Save
      </button>
      <button class="btn-action" data-action="export" data-util="${util}">
        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 20h14v-2H5zM12 4v10l3-3 1.4 1.4L12 16.8 7.6 12.4 9 11l3 3V4z"/></svg> Export
      </button>
    </div>`;
  }

  function wireActions(util, el, payload, form) {
    el.querySelectorAll('[data-action="save"]').forEach(b => b.addEventListener('click', async () => {
      try {
        const label = buildLabel(util, payload, form);
        await api('/api/saved', { method: 'POST', body: JSON.stringify({ utility: util, label, query: queryFor(form), payload }) });
        toast('Saved successfully. You can view the data later in Saved Searches.');
        await pushNotif('Saved Search', `${utilLabel(util)} saved.`);
      } catch (err) { toast(err.message); }
    }));
    el.querySelectorAll('[data-action="export"]').forEach(b => b.addEventListener('click', () => {
      exportCard(util, payload, buildLabel(util, payload, form));
    }));
    el.querySelectorAll('.contrib-card[data-addr]').forEach(c => c.addEventListener('click', () => {
      const a = c.dataset.addr; if (a) location.href = `/wallet-intelligence?addr=${encodeURIComponent(a)}`;
    }));
  }

  function buildLabel(util, payload, form) {
    if (payload?.address) return `${utilLabel(util)} · ${payload.address.slice(0, 10)}…`;
    if (payload?.a && payload?.b) return `Compare · ${payload.a.address.slice(0, 8)}… vs ${payload.b.address.slice(0, 8)}…`;
    return `${utilLabel(util)} · ${new Date().toLocaleString()}`;
  }
  function queryFor(form) {
    if (!form) return {};
    const fd = new FormData(form); const o = {}; for (const [k, v] of fd.entries()) o[k] = v; return o;
  }

  // ─── Saved card rendering ───────────────────────────────────────────
  function savedCard(it) {
    return `<div class="result-card" data-saved="${it._id}">
      <div class="dossier-head">
        <div>
          <h3 class="dossier-name">${escape(it.label)}</h3>
          <div class="dossier-addr">${escape(it.utility)} · ${new Date(it.createdAt).toLocaleString()}</div>
        </div>
        <div class="action-row" style="margin:0">
          <button class="btn-action" data-action="export" data-id="${it._id}">Export</button>
          <button class="btn-action" data-action="delete" data-id="${it._id}">Delete</button>
        </div>
      </div>
      <div class="saved-detail" hidden><pre class="mono small" style="white-space:pre-wrap;max-height:280px;overflow:auto;color:var(--text-dim)">${escape(JSON.stringify(it.payload, null, 2))}</pre></div>
    </div>`;
  }

  // ─── Export card image generation (unique per utility) ──────────────
  function exportCard(util, payload, label) {
    const c = document.createElement('canvas');
    const W = 1200, H = 720;
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // background
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#192547'); g.addColorStop(1, '#0e1735');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // gold border
    ctx.strokeStyle = '#AD8411'; ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // logo + brand text top-left
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 56, 56, 56, 56);
      ctx.fillStyle = '#FFEDBD';
      ctx.font = '600 22px Geist, sans-serif';
      ctx.fillText('AETHREON IQ', 128, 80);
      ctx.fillStyle = '#AD8411';
      ctx.font = '12px "Ubuntu Mono", monospace';
      ctx.fillText('WEB3 INTELLIGENCE LAYER', 128, 102);

      // utility-specific layout
      if (util === 'wallet-intelligence' || util === 'reputation') drawProfile(ctx, payload, util);
      else if (util === 'compare-wallets') drawCompare(ctx, payload);
      else if (util === 'activity') drawActivity(ctx, payload);
      else if (util === 'analytics') drawAnalytics(ctx, payload);
      else if (util === 'discover') drawDiscover(ctx, payload);

      // download
      const link = document.createElement('a');
      link.download = `aethreon-iq-${util}-${Date.now()}.png`;
      link.href = c.toDataURL('image/png');
      link.click();
      toast('Export downloaded.');
      pushNotif('Export', `${utilLabel(util)} card exported.`);
    };
    img.onerror = () => { toast('Logo missing — exporting without it.'); img.onload(); };
    img.src = '/images/logo-brandname.jpg';
  }

  function drawProfile(ctx, payload, util) {
    const p = payload.profile || payload;
    const addr = payload.address || '';
    ctx.fillStyle = '#FFEDBD';
    ctx.font = '700 56px Geist, sans-serif';
    ctx.fillText(util === 'reputation' ? 'REPUTATION DOSSIER' : 'WALLET INTELLIGENCE', 56, 200);
    ctx.font = '14px "Ubuntu Mono", monospace';
    ctx.fillStyle = 'rgba(255,237,189,0.6)';

const displayName =
  p.user?.displayName ||
  p.user?.name ||
  p.user?.username ||
  p.displayName ||
  'Unknown Contributor';

ctx.fillText(displayName, 56, 230);
ctx.fillText(addr, 56, 260);
    // score block right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#AD8411'; ctx.font = '700 140px Ubuntu, sans-serif';
    ctx.fillText(String(p.score), 1140, 260);
    ctx.fillStyle = '#FFEDBD'; ctx.font = '14px "Ubuntu Mono", monospace';
    ctx.fillText(`TIER · ${p.tier}`, 1140, 260);
    ctx.textAlign = 'left';
    // signals
    const sig = p.signals || {};
    const rows = [['BOUNTIES', sig.bounties], ['GIGS', sig.gigs], ['QUESTS', sig.quests], ['GRANTS', sig.grants], ['EVENTS', sig.events], ['REVIEWS', sig.reviews]];
    rows.forEach((r, i) => {
      const x = 56 + (i % 3) * 380; const y = 340 + Math.floor(i / 3) * 110;
      ctx.strokeStyle = 'rgba(173,132,17,0.4)'; ctx.strokeRect(x, y, 340, 90);
      ctx.fillStyle = 'rgba(255,237,189,0.6)'; ctx.font = '12px "Ubuntu Mono", monospace'; ctx.fillText(r[0], x + 16, y + 28);
      ctx.fillStyle = '#FFEDBD'; ctx.font = '700 38px Ubuntu, sans-serif'; ctx.fillText(String(r[1] ?? 0), x + 16, y + 70);
    });
    // tags strip
    ctx.fillStyle = 'rgba(173,132,17,0.18)'; ctx.fillRect(56, 600, 1088, 56);
    ctx.fillStyle = '#FFEDBD'; ctx.font = '14px Geist, sans-serif';
    ctx.fillText((p.tags || []).slice(0, 8).join('  ·  ') || 'No tags', 72, 636);
  }
  function drawCompare(ctx, payload) {
    ctx.fillStyle = '#FFEDBD'; ctx.font = '700 48px Geist, sans-serif';
    ctx.fillText('COMPARE · WALLETS', 56, 200);
    const drawSide = (p, x, addr) => {
      const displayName =
  p.user?.displayName ||
  p.user?.name ||
  p.user?.username ||
  p.displayName ||
  'Unknown Contributor';
      ctx.fillStyle = '#FFEDBD'; ctx.font = '14px "Ubuntu Mono", monospace';
      ctx.fillText(addr.slice(0, 24) + (addr.length > 24 ? '…' : ''), x, 240);
      ctx.fillStyle = '#AD8411'; ctx.font = '700 110px Ubuntu, sans-serif';
      ctx.fillText(displayName, x, 320);
      ctx.fillText(String(p.score), x, 360);
      ctx.fillStyle = '#FFEDBD'; ctx.font = '14px "Ubuntu Mono", monospace';
      ctx.fillText(`TIER · ${p.tier}`, x, 390);
      const s = p.signals || {};
      const rows = [['BOUNTIES', s.bounties], ['GIGS', s.gigs], ['QUESTS', s.quests], ['GRANTS', s.grants], ['EVENTS', s.events]];
      rows.forEach((r, i) => {
        ctx.fillStyle = 'rgba(255,237,189,0.55)'; ctx.font = '12px "Ubuntu Mono", monospace';
        ctx.fillText(r[0], x, 440 + i * 36);
        ctx.fillStyle = '#FFEDBD'; ctx.font = '700 22px Ubuntu, sans-serif';
        ctx.fillText(String(r[1] ?? 0), x + 220, 440 + i * 36);
      });
    };
    drawSide(payload.a.profile, 80, payload.a.address);
    ctx.strokeStyle = 'rgba(173,132,17,0.5)'; ctx.beginPath(); ctx.moveTo(600, 230); ctx.lineTo(600, 660); ctx.stroke();
    drawSide(payload.b.profile, 640, payload.b.address);
  }
  function drawActivity(ctx, payload) {
    ctx.fillStyle = '#FFEDBD'; ctx.font = '700 56px Geist, sans-serif';
    ctx.fillText('ACTIVITY SNAPSHOT', 56, 200);
    const results = payload.results || [];
    let y = 260;
    results.forEach(r => {
      ctx.fillStyle = '#AD8411'; ctx.font = '14px "Ubuntu Mono", monospace';
      ctx.fillText(`${r.source.toUpperCase()} · ${r.items?.length || 0}`, 56, y);
      y += 26;
      (r.items || []).slice(0, 3).forEach(i => {
        ctx.fillStyle = '#FFEDBD'; ctx.font = '16px Geist, sans-serif';
        const title = (i.title || i.name || i.slug || (i.category ? i.category + ' Item' : 'Grant Activity')).slice(0, 70);
        ctx.fillText('· ' + title, 80, y); y += 24;
      });
      y += 12;
      if (y > 620) return;
    });
  }
  function drawAnalytics(ctx, payload) {
    ctx.fillStyle = '#FFEDBD'; ctx.font = '700 56px Geist, sans-serif';
    ctx.fillText('ECOSYSTEM ANALYTICS', 56, 200);
    const p = payload.platform || {}, u = payload.users || {}, g = payload.gigs || {}, q = payload.quests || {}, s = payload.sips || {};
    const stats = [
      ['USERS', u.totalUsers ?? u.total ?? p.totalUsers ?? '—'],
      ['GIGS', g.totalGigs ?? g.total ?? '—'],
      ['QUESTS', q.totalQuests ?? q.total ?? '—'],
      ['SIPS', s.totalSips ?? s.total ?? '—'],
      ['ACTIVE GIGS', g.activeGigs ?? g.active ?? '—'],
      ['BOUNTIES', p.totalBounties ?? '—'],
    ];
    stats.forEach((row, i) => {
      const x = 56 + (i % 3) * 380; const y = 280 + Math.floor(i / 3) * 180;
      ctx.strokeStyle = 'rgba(173,132,17,0.5)'; ctx.strokeRect(x, y, 340, 150);
      ctx.fillStyle = 'rgba(255,237,189,0.6)'; ctx.font = '12px "Ubuntu Mono", monospace'; ctx.fillText(row[0], x + 18, y + 32);
      ctx.fillStyle = '#AD8411'; ctx.font = '700 56px Ubuntu, sans-serif'; ctx.fillText(String(row[1]), x + 18, y + 110);
    });
  }
  function drawDiscover(ctx, payload) {
    ctx.fillStyle = '#FFEDBD'; ctx.font = '700 56px Geist, sans-serif';
    ctx.fillText('CONTRIBUTOR DISCOVERY', 56, 200);
    const items = (payload.items || []).slice(0, 8);
    items.forEach((u, i) => {
      const y = 260 + i * 50;
      const name = u.displayName || u.name || u.username || (u.stxAddress || '').slice(0, 10);
      const addr = u.stxAddress || u.address || '';
      ctx.fillStyle = '#FFEDBD'; ctx.font = '18px Geist, sans-serif'; ctx.fillText('· ' + name, 72, y);
      ctx.fillStyle = 'rgba(255,237,189,0.55)'; ctx.font = '12px "Ubuntu Mono", monospace';
      ctx.fillText(addr.slice(0, 60), 380, y);
    });
  }

  // ─── Discover deep-link from URL ─────────────────────────────────────
  const urlAddr = new URLSearchParams(location.search).get('addr');
  if (urlAddr) {
    const inp = document.querySelector('[data-search] input[name="q"]');
    const f = document.querySelector('[data-search]');
    if (inp && f) { inp.value = urlAddr; f.dispatchEvent(new Event('submit', { cancelable: true })); }
  }

  // ─── Initial notification dot check ─────────────────────────────────
  (async () => { try { const { items } = await api('/api/notifications'); if (items.some(i => !i.read)) notifDot && (notifDot.hidden = false); } catch {} })();

  // ─── helpers ────────────────────────────────────────────────────────
  function escape(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
})();


  // ─── SETTINGS TOGGLES ───────────────────────────────────────────────
  const toggles = [
    ['anim-toggle', 'aiq.anim'],
    ['notif-toggle', 'aiq.notif'],
    ['autosave-toggle', 'aiq.autosave']
  ];

  toggles.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;

    const saved = localStorage.getItem(key);
    if (saved !== null) {
      el.checked = saved === 'true';
    }

    el.addEventListener('change', () => {
      localStorage.setItem(key, el.checked);

      if (id === 'anim-toggle') {
        document.body.classList.toggle(
          'animations-disabled',
          !el.checked
        );
      }
    });
  });

  // ─── EXPORT QUALITY ───────────────────────────────────────────────
  document.querySelectorAll('.quality-btn').forEach(btn => {

    const saved = localStorage.getItem('aiq.exportQuality') || 'standard';

    if (btn.dataset.quality === saved) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {

      document.querySelectorAll('.quality-btn')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      localStorage.setItem(
        'aiq.exportQuality',
        btn.dataset.quality
      );

      toast('Export quality updated');
    });
  });
