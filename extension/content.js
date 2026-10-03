(() => {
  const ROOT_ID = "tubelens-root";

  function scoreFromText(text) {
    const len = text.length;
    const hasNumber = /\d/.test(text);
    const hasHow = /\b(how|why|best|vs|i )\b/i.test(text);
    return Math.max(28, Math.min(96, 40 + Math.min(30, len / 3) + (hasNumber ? 10 : 0) + (hasHow ? 12 : 0)));
  }

  function detectContext() {
    const path = location.pathname;
    if (path === "/results") return "search";
    if (path.startsWith("/watch")) return "watch";
    if (path.startsWith("/@") || path.startsWith("/channel/")) return "channel";
    return "home";
  }

  function keywordFromPage() {
    if (detectContext() === "search") {
      const q = new URLSearchParams(location.search).get("search_query");
      if (q) return q;
    }
    const title =
      document.querySelector("h1.ytd-watch-metadata yt-formatted-string")?.textContent ||
      document.querySelector("h1 yt-formatted-string")?.textContent ||
      document.title.replace(" - YouTube", "");
    return (title || "youtube growth").trim();
  }

  function render() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("aside");
      root.id = ROOT_ID;
      document.documentElement.appendChild(root);
    }

    const ctx = detectContext();
    const keyword = keywordFromPage();
    const score = scoreFromText(keyword);

    root.innerHTML = `
      <div class="tl-panel">
        <div class="tl-brand">
          <span class="tl-mark">TL</span>
          <div>
            <strong>Tubelens</strong>
            <div class="tl-sub">${ctx} overlay</div>
          </div>
          <button class="tl-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="tl-score">
          <div class="tl-score-num">${score}</div>
          <div>
            <div class="tl-label">Opportunity / SEO</div>
            <div class="tl-kw">${escapeHtml(keyword)}</div>
          </div>
        </div>
        <ul class="tl-list">
          <li>Primary phrase near title start</li>
          <li>Promise payoff in first 8 seconds</li>
          <li>Thumbnail: one subject, one emotion</li>
          <li>Bridge Shorts → long-form within 48h</li>
        </ul>
        <a class="tl-cta" href="http://localhost:3000/keywords?q=${encodeURIComponent(keyword)}" target="_blank" rel="noreferrer">
          Open in Tubelens
        </a>
      </div>
    `;

    root.querySelector(".tl-close")?.addEventListener("click", () => root.remove());
  }

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  render();
  let last = location.href;
  setInterval(() => {
    if (location.href !== last) {
      last = location.href;
      render();
    }
  }, 1200);
})();
