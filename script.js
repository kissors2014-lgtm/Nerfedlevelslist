let data = null;
let selectedIndex = 0;

// Points for a level based on its rank. Replace with your own formula if you like.
function pointsForRank(rank, mainListSize) {
  if (rank > mainListSize) return 0; // legacy levels give no points
  return Math.round(200 * Math.pow(0.93, rank - 1) * 100) / 100;
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function safeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : "#";
}

async function init() {
  const res = await fetch("levels.json");
  data = await res.json();
  document.getElementById("title").textContent = data.listName;
  document.title = data.listName;
  renderList();
  renderDetail(0);
  renderPlayers();
}

function renderList() {
  const el = document.getElementById("level-list");
  el.innerHTML = "";
  data.levels.forEach((lvl, i) => {
    const rank = i + 1;
    const legacy = rank > data.mainListSize;
    const item = document.createElement("div");
    item.className = "level-item" + (legacy ? " legacy" : "") + (i === selectedIndex ? " selected" : "");
    item.innerHTML = `
      <span class="rank">#${rank}</span>
      <img src="https://img.youtube.com/vi/${encodeURIComponent(lvl.videoId)}/mqdefault.jpg" alt="">
      <div>
        <div class="name">${esc(lvl.name)}</div>
        <div class="by">${esc(lvl.creator)}</div>
      </div>`;
    item.addEventListener("click", () => {
      selectedIndex = i;
      renderList();
      renderDetail(i);
    });
    el.appendChild(item);
  });
}

function renderDetail(i) {
  const lvl = data.levels[i];
  const rank = i + 1;
  const pts = pointsForRank(rank, data.mainListSize);
  const rows = [
    `<tr><td>${esc(lvl.verifier)} (verifier)</td><td>100%</td><td><a href="https://www.youtube.com/watch?v=${encodeURIComponent(lvl.videoId)}" target="_blank" rel="noopener">video</a></td></tr>`,
    ...lvl.records.map(r =>
      `<tr><td>${esc(r.player)}</td><td>${Number(r.percent)}%</td><td><a href="${esc(safeUrl(r.video))}" target="_blank" rel="noopener">video</a></td></tr>`)
  ].join("");

  document.getElementById("level-detail").innerHTML = `
    <h2>#${rank} – ${esc(lvl.name)}</h2>
    <div class="video">
      <iframe src="https://www.youtube.com/embed/${encodeURIComponent(lvl.videoId)}" allowfullscreen></iframe>
    </div>
    <div class="meta">
      <div><span>Creator</span>${esc(lvl.creator)}</div>
      <div><span>Verifier</span>${esc(lvl.verifier)}</div>
      <div><span>Level ID</span>${esc(String(lvl.levelId))}</div>
      <div><span>Min. percent</span>${Number(lvl.requirement)}%</div>
      <div><span>Points (100%)</span>${pts}</div>
    </div>
    <h3>Records</h3>
    <table>
      <thead><tr><th>Player</th><th>Percent</th><th>Proof</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderPlayers() {
  const scores = {};
  data.levels.forEach((lvl, i) => {
    const full = pointsForRank(i + 1, data.mainListSize);
    if (!full) return;
    const add = (player, pct) => {
      // A 100% record gives full points; a partial record (at or above the
      // level's minimum percent) gives 25% of the points.
      const p = pct >= 100 ? full : (pct >= lvl.requirement ? full * 0.25 : 0);
      if (p > 0) scores[player] = (scores[player] || 0) + p;
    };
    add(lvl.verifier, 100);
    lvl.records.forEach(r => add(r.player, r.percent));
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const tbody = document.querySelector("#players-table tbody");
  tbody.innerHTML = sorted.map(([name, pts], i) =>
    `<tr><td>${i + 1}</td><td>${esc(name)}</td><td>${pts.toFixed(2)}</td></tr>`).join("");
}

document.getElementById("tab-list").addEventListener("click", () => switchTab("list"));
document.getElementById("tab-players").addEventListener("click", () => switchTab("players"));

function switchTab(tab) {
  document.getElementById("view-list").hidden = tab !== "list";
  document.getElementById("view-players").hidden = tab !== "players";
  document.getElementById("tab-list").classList.toggle("active", tab === "list");
  document.getElementById("tab-players").classList.toggle("active", tab === "players");
}

init();
