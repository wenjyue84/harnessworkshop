/* ═══════════════════════════════════════════════════════
   HARNESS ENGINEERING — Navigation Component
   Include this script in every page.
   ═══════════════════════════════════════════════════════ */

(function() {

const MODULES = [
  { id:'01', title:'Install & Subscribe',       sub:'Get Claude Pro ($20)',            icon:'💳', path:'/pages/01-install.html',       time:'5 min',  section:'Getting Started' },
  { id:'02', title:'/init Command',              sub:'Bootstrap your AI workspace',     icon:'🚀', path:'/pages/02-init.html',          time:'8 min',  section:'Getting Started' },
  { id:'03', title:'Global Claude.md',           sub:'Universal AI rules',              icon:'🌐', path:'/pages/03-global-claude.html', time:'10 min', section:'Getting Started' },
  { id:'04', title:'Project Claude.md',          sub:'Per-project constraints',         icon:'📁', path:'/pages/04-project-claude.html',time:'10 min', section:'Getting Started' },
  { id:'05', title:'claude-mem',                 sub:'Persistent AI memory',            icon:'🧠', path:'/pages/05-claude-mem.html',    time:'8 min',  section:'Memory & Context' },
  { id:'06', title:'Session Start Hook',         sub:'Auto-init your workspace',        icon:'⏰', path:'/pages/06-session-hook.html',  time:'10 min', section:'Hooks & Automation' },
  { id:'07', title:'Other Hooks',                sub:'Lifecycle automation',            icon:'⚡', path:'/pages/07-other-hooks.html',   time:'12 min', section:'Hooks & Automation' },
  { id:'08', title:'Agent Browser Skill',        sub:'Semantic web navigation',         icon:'🌐', path:'/pages/08-agent-browser.html', time:'10 min', section:'Skills & Tools' },
  { id:'09', title:'Pinchtab',                   sub:'Browser tab context capture',     icon:'📌', path:'/pages/09-pinchtab.html',      time:'8 min',  section:'Skills & Tools' },
  { id:'10', title:'AWS CLI',                    sub:'Cloud ops from your AI',          icon:'☁️', path:'/pages/10-aws-cli.html',       time:'12 min', section:'Skills & Tools' },
  { id:'11', title:'GitHub MCP',                 sub:'AI-native git operations',        icon:'🐙', path:'/pages/11-github-mcp.html',    time:'10 min', section:'MCP Servers' },
  { id:'12', title:'Context7',                   sub:'Live docs for your LLM',          icon:'📚', path:'/pages/12-context7.html',      time:'8 min',  section:'MCP Servers' },
  { id:'13', title:'Firecrawl MCP',              sub:'Web scraping for AI agents',      icon:'🔥', path:'/pages/13-firecrawl.html',     time:'10 min', section:'MCP Servers' },
  { id:'14', title:'/clear and /compact',        sub:'Context window management',       icon:'🧹', path:'/pages/14-clear-compact.html', time:'8 min',  section:'Context Management' },
  { id:'15', title:'dangerously-skip-permissions',sub:'Autonomous execution mode',      icon:'⚠️', path:'/pages/15-dangerous.html',     time:'10 min', section:'Advanced' },
  { id:'16', title:'Ralph',                      sub:'Long-running background agents',  icon:'🤖', path:'/pages/16-ralph.html',         time:'15 min', section:'Advanced' },
  { id:'17', title:'Comprehensive Test Suites',  sub:'Let AI self-improve via tests',   icon:'🧪', path:'/pages/17-testing.html',       time:'12 min', section:'Advanced' },
  { id:'18', title:'Agent / Subagent',           sub:'Context management hierarchy',    icon:'🏗️', path:'/pages/18-agent-subagent.html',time:'12 min', section:'Multi-Agent' },
  { id:'19', title:'Agent Team',                 sub:'Coder + Tester + Reviewer',       icon:'👥', path:'/pages/19-agent-team.html',    time:'15 min', section:'Multi-Agent' },
  { id:'20', title:'Codex in Cursor',            sub:'GPT-4 coding agent setup',        icon:'🖊️', path:'/pages/20-codex-cursor.html',  time:'10 min', section:'Other Tools' },
  { id:'21', title:'Gemini --yolo',              sub:'Full-autonomy Gemini CLI',        icon:'✨', path:'/pages/21-gemini-yolo.html',   time:'8 min',  section:'Other Tools'  },
];

// Detect current page path — normalize for Vercel cleanUrls (strips .html)
function getCurrentPath() {
  const p = window.location.pathname;
  return p.replace(/\/$/, '').replace(/\.html$/, '') || '/';
}

// Normalize a module path for comparison (strip .html)
function normPath(path) {
  return path.replace(/\.html$/, '');
}

// Check completion from localStorage
function isDone(id) {
  return localStorage.getItem('he_done_' + id) === '1';
}

function markDone(id) {
  localStorage.setItem('he_done_' + id, '1');
  updateProgress();
}

function updateProgress() {
  const done = MODULES.filter(m => isDone(m.id)).length;
  const pct = Math.round((done / MODULES.length) * 100);
  const fill = document.getElementById('sp-fill');
  const label = document.getElementById('sp-count');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = done + ' / ' + MODULES.length + ' complete';
  // Update sidebar dots
  MODULES.forEach(m => {
    const link = document.querySelector('.module-link[data-id="'+m.id+'"]');
    if (link) {
      if (isDone(m.id)) link.classList.add('completed');
      else link.classList.remove('completed');
    }
  });
}

function buildSidebar() {
  const curr = getCurrentPath();
  let currentIndex = -1;
  MODULES.forEach((m, i) => {
    const np = normPath(m.path);
    if (curr === np || curr === m.path || curr.endsWith(np.replace(/^\//, ''))) currentIndex = i;
  });

  let html = `
    <div class="sidebar-logo">
      <a href="/">
        <div class="sidebar-logo-mark">⚙</div>
        <div>
          <div class="sidebar-logo-text">Harness Engineering</div>
          <div class="sidebar-logo-sub">Self-Study Workshop</div>
        </div>
      </a>
    </div>
    <div class="sidebar-progress">
      <div class="sp-label">
        <span>Progress</span>
        <span id="sp-count">0 / 21 complete</span>
      </div>
      <div class="sp-bar"><div class="sp-fill" id="sp-fill" style="width:0%"></div></div>
    </div>
    <nav class="sidebar-modules">
  `;

  let lastSection = '';
  MODULES.forEach((m, i) => {
    if (m.section !== lastSection) {
      html += `<div class="sidebar-section-label">${m.section}</div>`;
      lastSection = m.section;
    }
    const isActive = i === currentIndex;
    const done = isDone(m.id);
    html += `
      <a class="module-link${isActive?' active':''}${done?' completed':''}"
         href="${m.path}" data-id="${m.id}">
        <span class="ml-num">${m.id}</span>
        <span class="ml-title">${m.title}</span>
        <span class="ml-check">✓</span>
      </a>
    `;
  });

  html += `</nav>`;
  return html;
}

function buildTopbar(currentIndex) {
  const m = currentIndex >= 0 ? MODULES[currentIndex] : null;
  return `
    <div class="topbar">
      <button class="hamburger" id="hamburger" onclick="toggleSidebar()">☰</button>
      <div class="topbar-breadcrumb">
        <a href="/">Home</a>
        <span class="sep">›</span>
        ${m ? `<span>${m.title}</span>` : '<span>Course</span>'}
      </div>
      ${m ? `<span class="topbar-module-badge">Module ${m.id} / 21</span>` : ''}
      <button class="pm-toggle-btn" id="pm-toggle-btn" onclick="window.HE.togglePresMode()" title="Toggle Presentation Mode">
        <span id="pm-icon">⊞</span>
        <span id="pm-label">Website</span>
      </button>
    </div>
  `;
}

function buildModuleNav(currentIndex) {
  const prev = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const next = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;
  return `
    <div class="module-nav">
      ${prev
        ? `<a class="nav-card" href="${prev.path}">
             <span class="nav-direction">← Previous</span>
             <span class="nav-title">${prev.icon} ${prev.title}</span>
           </a>`
        : `<div class="nav-card disabled"><span class="nav-direction">← Previous</span><span class="nav-title">Start of course</span></div>`
      }
      ${next
        ? `<a class="nav-card next" href="${next.path}">
             <span class="nav-direction">Next →</span>
             <span class="nav-title">${next.title} ${next.icon}</span>
           </a>`
        : `<div class="nav-card next disabled"><span class="nav-direction">Next →</span><span class="nav-title">Course complete 🎉</span></div>`
      }
    </div>
  `;
}

// ── Presentation mode ──

function wrapPresContent() {
  document.querySelectorAll('.content-section').forEach(function(section) {
    if (section.querySelector('.pm-collapse')) return; // already wrapped
    const title = section.querySelector('.section-title');
    if (!title) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'pm-collapse';
    const inner = document.createElement('div');
    inner.className = 'pm-collapse-inner';
    wrapper.appendChild(inner);
    // Move every child except the title into the collapsible wrapper
    Array.from(section.children).forEach(function(child) {
      if (child !== title) inner.appendChild(child);
    });
    section.appendChild(wrapper);
  });
}

function updatePmBtn(isPresMode) {
  const iconEl  = document.getElementById('pm-icon');
  const labelEl = document.getElementById('pm-label');
  const btn     = document.getElementById('pm-toggle-btn');
  if (iconEl)  iconEl.textContent  = isPresMode ? '▣' : '⊞';
  if (labelEl) labelEl.textContent = isPresMode ? 'Presentation' : 'Website';
  if (btn) btn.classList.toggle('active', isPresMode);
}

function togglePresMode() {
  const isPresMode = document.body.classList.toggle('presentation-mode');
  localStorage.setItem('he_pres_mode', isPresMode ? '1' : '0');
  updatePmBtn(isPresMode);
}

function initPresMode() {
  wrapPresContent();
  const isPresMode = localStorage.getItem('he_pres_mode') === '1';
  if (isPresMode) document.body.classList.add('presentation-mode');
  updatePmBtn(isPresMode);
}

// ── Main init ──
window.addEventListener('DOMContentLoaded', function() {
  const curr = getCurrentPath();
  let currentIndex = -1;
  MODULES.forEach((m, i) => {
    const np = normPath(m.path);
    if (curr === np || curr === m.path || curr.endsWith(np.replace(/^\//, ''))) currentIndex = i;
  });

  // Inject sidebar
  const sidebarEl = document.getElementById('nav-sidebar');
  if (sidebarEl) sidebarEl.innerHTML = buildSidebar();

  // Inject topbar
  const topbarEl = document.getElementById('nav-topbar');
  if (topbarEl) topbarEl.innerHTML = buildTopbar(currentIndex);

  // Inject module nav
  const moduleNavEl = document.getElementById('module-nav');
  if (moduleNavEl && currentIndex >= 0) moduleNavEl.innerHTML = buildModuleNav(currentIndex);

  // Reading progress bar
  const progressFill = document.getElementById('reading-progress-fill');
  if (progressFill) {
    window.addEventListener('scroll', function() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressFill.style.width = pct + '%';
    });
  }

  // Mark complete button
  const markBtn = document.getElementById('mark-complete-btn');
  if (markBtn && currentIndex >= 0) {
    const m = MODULES[currentIndex];
    if (isDone(m.id)) markBtn.textContent = '✓ Module Complete';
    markBtn.addEventListener('click', function() {
      markDone(m.id);
      markBtn.textContent = '✓ Module Complete';
      markBtn.classList.add('btn-green');
      markBtn.classList.remove('btn-ghost');
    });
  }

  // Update progress
  updateProgress();

  // Presentation mode — wraps content, restores saved state
  initPresMode();
});

window.toggleSidebar = function() {
  const sb = document.getElementById('nav-sidebar');
  if (sb) sb.classList.toggle('open');
};

// Expose for pages to use
window.HE = { MODULES, isDone, markDone, updateProgress, togglePresMode };

})();
